define( function (require, exports, module) {
	'use strict';

	var CFG_ACCOUNTS_ENDPOINT = 'accountsEndpoint';
	var CFG_DEFAULT_ACCOUNT = 'defaultAccount';

	/**
	 * Note. AccountsModel is provided for backwards compatability with
	 * old widgets.
	 */

	// @ngInject
	exports.lpAccounts = function(lpCoreUtils) {
		/**
		 * To configure the provider before initialisation.
		 */
		var config;

		/*
		 * Set the configuration object for the accounts provider.
		 *
		 * @param core.configuration config
		 * @return void
		*/
		this.setConfig = function(options) {
			config = options;
		};

		/**
		 * HELPERS
		 * -------
		 */

		// masking account (or any other string) with symbols
		var maskAccount = function(acc, num, symbol) {
			var rx, replacer;
			symbol = symbol || '*';
			num = parseInt(num, 10) || 0;
			if (!acc) { return ''; }
			if (!num) { return acc; }
			replacer = lpCoreUtils.range(num).map(function () { return symbol; }).join('');
			rx = new RegExp('^.{0,' + num + '}', 'i');

			return acc.replace(rx, replacer);
		};

		// Flatten response
		var flattenResponseStructure = function (data) {
			if (lpCoreUtils.isPlainObject(data)) {
				// complex structure -- 'assets'
				return lpCoreUtils.chain(data).values().flatten().value();
			} else {
				return data;
			}
		};

		// @ngInject
		this.$get = function($http, $q) {

			// todo: move out of $get.
			var API = function(options) {
				this.accounts = [];
				this.error = false;
				this.setConfig(options);
			};

			/*
			 * Set the configuration object for the accounts provider.
			 *
			 * @param core.configuration config
			 * @return void
			*/
			API.prototype.setConfig = function(options) {
				if (options && options[CFG_ACCOUNTS_ENDPOINT]) {
					options[CFG_ACCOUNTS_ENDPOINT] = lpCoreUtils.resolvePortalPlaceholders(options[CFG_ACCOUNTS_ENDPOINT]);
				}
				this.config = options;
			};

			/**
			 * Get value from config key/value hash.
			 */
			API.prototype.getAttribute = function(attr) {
				return this.config && this.config[attr];
			};

			API.prototype.load = function(justRefresh) {
                return $http.get(this.getAttribute(CFG_ACCOUNTS_ENDPOINT)).then(function(response) {
                    return this.refreshAccounts(response.data, justRefresh);
                }.bind(this));
			};

			API.prototype.getAll = function(force) {
				return this.load(force);
			};

			API.prototype.pluckDefaultAccount = function(accounts) {
				var accountsWrapper = lpCoreUtils(accounts); // create lodash wrapper.

				return accountsWrapper.first();
			};

			API.prototype.getDefaultAccountBban = function() {
				return this.getAttribute(CFG_DEFAULT_ACCOUNT);
			};

			API.prototype.configureAccountIdentifiers = function(account) {
				var self = this;
				var localeMap = {
					'EU': 'IBAN',
					'US': 'BBAN',
					'en-US': 'BBAN'
				};
				var getProp = function(prop) {
					return self.config[prop] || lpCoreUtils.getPagePreference(prop) || lpCoreUtils.getPortalProperty(prop);
				};

				var locale = getProp('locale');
				if(!locale || !localeMap[locale]) {
					locale = 'EU';
				}

				// Comment:
				//     - if there is a config prop 'hideAccount' is true, then account number will not show up
				//     - if there is a config prop 'maskAccount' is positive number, then account will appear masked
				//       with * the first account characters
				if(account.accountIdentification) {
					lpCoreUtils.forEach(account.accountIdentification, function(identifier) {
						if(identifier.scheme === localeMap[locale]) {
							if (!getProp('hideAccount') && getProp('maskAccount')) {
								account.identifier = maskAccount(identifier.id, getProp('maskAccount'));
							} else if (!getProp('hideAccount') && !getProp('maskAccount')) {
								account.identifier = identifier.id;
							}
						}
					});
				}
			};

			/**
			* Find account by Id
			* @param id
			* @returns {Array}
			*/
			API.prototype.findById = function(id) {
				return this.accounts.filter(function(account){ return account.id === id; })[0];
			};

			/**
			* Find account by Account Number
			* @param id
			* @returns {Array}
			*/
			API.prototype.findByAccountNumber = function(bban) {
				return this.accounts.filter(function(account){ return account.bban === bban; })[0];
			};

			/**
			* Calculate pending
			* @param account
			* @returns {number}
			*/
			API.prototype.getPending = function(account) {
				return account.bookedBalance - account.availableBalance;
			};

			/**
			* Calculate size of the group
			* @param group
			* @returns {number}
			*/
			API.prototype.getGroupSize = function(group) {
				var size = 0;
				for (var i = 0; i < this.accounts.length; i++) {
					if (this.accounts[i].groupCode === group.code) {
						size++;
					}
				}
				return size;
			};

			/**
			* Sets up a delta on individual account
			* @param account account to configure
			**/
			API.prototype.configurePreviousBalanceDeltas = function(account) {

				var self = this;

				if (!self.previousBalances) {
					//initial load - initialize array
					self.previousBalances = [];
					account.delta = 0;
					self.previousBalances[account.id] = account.availableBalance;
				} else {
					if (self.previousBalances[account.id] > account.availableBalance) {
						//new balance has decreased
						account.delta = -1;
					} else if (self.previousBalances[account.id] < account.availableBalance) {
						//new balance has increased
						account.delta = 1;
					} else {
						account.delta = 0;
					}
					self.previousBalances[account.id] = account.availableBalance;
				}
			};

			/**
			* Refresh accountsModel with new accounts
			* @param newAccounts the new accounts to set to the accountsModel
			*/
			API.prototype.refreshAccounts = function(newAccounts, justRefresh) {
				// we're not expecting new accounts just handle
				// existing ones
				if (justRefresh === true) {
					this.accounts = [];
				}

				// check for assets complex response
				newAccounts = flattenResponseStructure(newAccounts);

				for (var i = 0; i < newAccounts.length; i++) {
					this.configureAccountIdentifiers(newAccounts[i]);
					this.configurePreviousBalanceDeltas(newAccounts[i]);
					this.formatAccountBalance(newAccounts[i]);
					this.accounts.push(newAccounts[i]);
				}

                return this.accounts;
			};

			/**
			* Calculate group total balance
			* @param group
			* @returns {{totalBalance: number, currency: *}}
			*/
			API.prototype.getGroupTotal = function(group) {
				var account,
				totalBalance = 0,
				currency;

				for (var j = 0; j < this.accounts.length; j++) {
					account = this.accounts[j];
					if (account.groupCode === group.code) {
						totalBalance += account.balance;
						currency = account.currency;
					}
				}

				return { totalBalance: totalBalance, currency: currency};
			};

			/**
			* TODO: remove after formatting is in place
			*/
			API.prototype.formatAccountBalance = function(account) {
				account.availableBalance = parseFloat(account.availableBalance);
				account.bookedBalance = parseFloat(account.bookedBalance);
			};

			return new API(config);
		};
	};

	// Preserve old Model legacy
	// #TODO DEPRECATE
	exports.AccountsModel = exports.lpAccounts;
});
