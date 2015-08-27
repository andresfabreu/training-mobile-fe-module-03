define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.AssetsModel = function($rootScope, accountsTimeout, groupsTimeout, $resource, lpCoreUtils, $q) {
            /**
             * Assets service constructor
             * @param config
             * @constructor
             */
            var AssetsModel = function(config) {

                var self = this;

                config.assetsEndpoint = lpCoreUtils.resolvePortalPlaceholders(config.assetsEndpoint);

                self.assetsResource = $resource(config.assetsEndpoint);

                self.groupsEnabled = !!config.groupsEndpoint;

                if (self.groupsEnabled) {
                    config.groupsEndpoint = lpCoreUtils.resolvePortalPlaceholders(config.groupsEndpoint);
                    self.groupsResource = $resource(config.groupsEndpoint);
                }

                self.filterByGroupCode = config.groupCodeFilter;

                self.accounts = null;
                self.groups = null;
                self.assetCollection = [];
                self.error = false;

                gadgets.pubsub.subscribe("launchpad-retail:ACCOUNT_BALANCE_CHANGED", function(response) {

                    if(self.accounts !== null) {
                        self.load();
                    }
                });
            };

            /**
             * Load data from server
             */
            AssetsModel.prototype.load = function() {
                var deferred = $q.defer();
                var self = this;

                self.assetsResource.get().$promise.then(function(accounts) {
                    self.accounts = accounts;
                    gadgets.pubsub.publish("launchpad-retail.accountsLoaded", accounts["current-account"]);

                    if(self.groupsResource) {
                        self.groupsResource.query().$promise.then(function(groups) {
                            self.groups = groups;
                            self.configureAssetCollection();

                            deferred.resolve();
                        });
                    }
                    else {
                        deferred.resolve();
                    }
                });

                return deferred.promise;
            };

            /**
             * Formats assetCollection property
             */
            AssetsModel.prototype.configureAssetCollection = function() {

                var self = this;

                if(self.groupsEnabled) {

                    var group;

                    //loop through list of groups
                    for(var i = 0; i < self.groups.length; i++) {

                        group = {
                            title: self.groups[i].defaultTitle,
                            code: self.groups[i].code,
                            accounts: [],
                            isCollapsed: false
                        };

                        for(var accountList in self.accounts) {
                            if(self.accounts.hasOwnProperty(accountList)) {
                                //if this list of accounts matches this group code, add then to this group
                                if(accountList === self.groups[i].code) {
                                    group.accounts = self.accounts[accountList];
                                }
                            }
                        }

                        //if there are more than 0 accounts in this group, push it to the collection
                        if(group.accounts.length > 0) {
                            for(var j = 0; j < group.accounts.length; j++) {
                                self.formatAccountBalance(group.accounts[j]);
                                self.configurePreviousBalanceDelta(group.accounts[j]);
                            }

                            self.assetCollection.push(group);
                        }
                    }
                } else {

                    for(var accounts in self.accounts) {
                        if(self.accounts.hasOwnProperty(accounts)) {
                            for(var k = 0; k < self.accounts[accounts].length; k ++) {
                                self.formatAccountBalance(self.accounts[accounts][k]);
                                self.configurePreviousBalanceDelta(self.accounts[accounts][k]);
                                self.assetCollection.push(self.accounts[accounts][k]);
                            }
                        }
                    }
                }

            };




            /**
             * Calculate pending
             * @param account
             * @returns {number}
             */
            AssetsModel.prototype.getPending = function(account) {

                return account.bookedBalance - account.availableBalance;
            };

            /**
             * Sets up a delta on individual account
             * @param listOfAccounts a list of the new accounts to load
             */
            AssetsModel.prototype.configurePreviousBalanceDelta = function(account) {

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
             * Finds an asset by id
             * @param assetId
             * @returns asset
             */
            AssetsModel.prototype.findById = function(assetId) {

                var self = this;
                var account;

                if(self.groupsEnabled) {
                    for(var i = 0; i < self.assetCollection.length; i++) {
                        for(var j = 0; j < self.assetCollection[i].accounts.length; j++) {
                            if(self.assetCollection[i].accounts[j].id === assetId) {
                                account = self.assetCollection[i].accounts[j];
                                break;
                            }
                        }
                    }
                } else {
                    for(var k = 0; k < self.assetCollection.length; k++) {
                        if(self.assetCollection[k].id === assetId) {
                            account = self.assetCollection[k];
                            break;
                        }
                    }
                }

                return account;
            };

            /**
             * Calculate group total balance
             * @param group
             * @returns {{totalBalance: number, currency: *}}
             */
            AssetsModel.prototype.getGroupTotal = function(group) {
                var account,
                    totalBalance = 0,
                    currency;

                for (var j = 0; j < group.accounts.length; j++) {
                    account = group.accounts[j];
                    totalBalance += account.availableBalance;
                    currency = account.currency;
                }

                return { totalBalance : totalBalance, currency : currency};
            };

            /**
             * TODO: remove after formatting is in place
             */
            AssetsModel.prototype.formatAccountBalance = function(account) {

                account.availableBalance = parseFloat(account.availableBalance);
                account.bookedBalance = parseFloat(account.bookedBalance);
            };



            return {
                getInstance: function(config) {
                    return new AssetsModel(config);
                }
            };
    };
});
