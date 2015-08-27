
define( function( require, exports, module) {

	'use strict';

	// @ngInject
	exports.MainCtrl = function(lpEbilling, lpEbillingUtils) {

		var ctrl = this;

		var eBillOptions = lpEbilling.getConfig();

		ctrl.isTouch = lpEbillingUtils.isTouch;

		ctrl.baseUrl = eBillOptions.baseUrl;

		ctrl.getTemplate = function(tpl) {
			return lpEbilling.getTemplate(tpl);
		};

	};


	// @ngInject
	exports.DetailsCtrl = function(lpEbilling, $scope) {

		var ctrl = this;

		ctrl.init = function(bill) {
			bill.processing = true;
			bill.mandate.$get().then(function( mandate ) {
				ctrl.mandate = mandate;
			}, function(errObj) {
				ctrl.response = 'Unable to fetch e-bill.';
			})['finally'](function() {
				bill.processing = false;
			});
		};
		// Clean up
		$scope.$on('$destroy', function() {
			ctrl.mandate = null;
		});
	};

	// @ngInject
	exports.PaymentCtrl = function(lpEbilling, lpEbillingUtils, $scope) {

		var ctrl = this;

		ctrl.paymentParams = {};

		ctrl.init = function(bill) {
			ctrl.bill = bill;
			ctrl.minDate = new Date();
			ctrl.setSpecificAmount(bill.amount);
			// ui-bootstrap datepicker doesn't like string ISO type formats, so we wrap it in Date obj
			ctrl.paymentParams.scheduleDate = bill.scheduleDate && new Date(bill.scheduleDate);
			lpEbilling.getAccounts().then(function(accounts) {
				ctrl.accounts = accounts;
				ctrl.paymentParams.account = accounts.filter(function(item){
					return item.identifier === bill.mandate.debtor.account;
				})[0];
			});
		};

		ctrl.setSpecificAmount = function(amount) {
			if (!amount) {
				ctrl.specific = true;
				ctrl.paymentParams.amount = ctrl.specificAmount || 0;
			} else {ctrl.specific = false; ctrl.paymentParams.amount = amount; }
		};

		$scope.$watch(function(){
				return ctrl.specificAmount;
			}, function(value){
			if(ctrl.specific) {
				ctrl.paymentParams.amount = value;
			}
		});

		// Clean up stuff
		$scope.$on('$destroy', function() {

		});

	};

	/// @ngInject

	exports.BillsListCtrl = function(lpEbilling, lpEbillingDebitOrdersModel, lpEbillingUtils, lpEbillingBus, $scope, $timeout, $q, $cacheFactory) {

		var bus = lpEbillingBus;
		/*----------------------------------------------------------------*/
		/* Private
		/*----------------------------------------------------------------*/

		var ctrl = this; //self

		// Fetch with default params
		var fetchParams = {
			f: 0,
			l: 4,
			sort: '+paymentDueDate'
		};

		ctrl.hasMore = false;

		// basic check if they are more bills to show
		// not so accurate since there is no total
		// response from the server
		var checkHasMore = function(responseLength) {
			if(typeof responseLength === 'number') {
				ctrl.hasMore = responseLength >= fetchParams.l;
			}
		};

		// remove from group list and from list
		// TODO
		//var removeFromList = function(item, $index, $groupIndex) {
		//	var indexCollection = lpEbillingUtils.findIndex(ctrl.bills, {'id': item.id });
		//	var group = ctrl.groups[ $groupIndex ];
		//	if(indexCollection) {
		//		ctrl.bills.splice( indexCollection, 1);
		//	}
		//	lpEbillingUtils.log(item.index, group.bills);
		//	if(group && group.bills instanceof Array ) {
		//		group.bills.splice($index, 1);
		//		// Is empty group remove label
		//		if(group.bills.length <= 0) {
		//			ctrl.groups.splice($groupIndex, 1);
		//		}
		//	}
		//};

		var processParams = function(params) {
			var d = $q.defer();
			if(lpEbillingUtils.isUndefined(params.scheduledDate)) {
				params.scheduledDate = null;
			} else {
				params.scheduledDate = params.scheduledDate instanceof Date ? new Date(params.scheduledDate).getTime() : null;
			}
			if(lpEbillingUtils.isObject(params.accountId)) {
				params.accountId = params.accountId.id;
				d.resolve(params);
			} else {
				lpEbilling.getAccounts()
				.then(function(accounts) {
					params.accountId = accounts.filter(function(item){
						return (item.identifier === params.accountId);
					})[0].id || null;
					d.resolve(params);
				});
			}
			return d.promise;
		};

		/*----------------------------------------------------------------*/
		/* Public
		/*----------------------------------------------------------------*/
		/**
		 * Initialize method
		 */
		ctrl.init = function() {
			ctrl.fetch();
		};
		/**
		 * Use this function to refresh the list and trigger an event for other widgets (EX history )
		 * to update
		 */
		ctrl.sync = function() {
			ctrl.fetch();
			// trigger and event to other ebill widgets
			bus.publish('lp.widget.e-bill-inbox:sync', {}, true);
		};

		/**
		 * Get more data
		 */
		ctrl.loadMore = function() {
			fetchParams.f = ctrl.bills.length;
			lpEbillingDebitOrdersModel.getAll(fetchParams)
			.then(function(bills) {
				checkHasMore(bills.length);
				if( bills.length > 0 ) {
					ctrl.bills = ctrl.bills.concat( bills );
					ctrl.groups = lpEbillingUtils.groupBy(ctrl.bills, 'dueDate', 'Due', 'overdue');
				}
			});
		};

		/**
		 * Main fetch data for both new/scheduled eBills
		 */
		ctrl.fetch = function() {
			ctrl.loading = true;
			ctrl.bills = [];
			var debitOrders = lpEbillingDebitOrdersModel.getAll(fetchParams);
			var newDebitOrders = lpEbillingDebitOrdersModel.getAllNew();

			$q.all([ debitOrders, newDebitOrders ]).then(function(resultArr) {
				var bills = resultArr[0];
				var newBills = resultArr[1];
				checkHasMore(bills.length);

				if (!bills.length && !newBills.length) {
					ctrl.response = 'No results';
				} else {
					ctrl.bills = ctrl.bills.concat(bills);
					ctrl.newBills = newBills;
					ctrl.groups = lpEbillingUtils.groupBy(ctrl.bills, 'dueDate', 'Due', 'overdue');
				}
			}, function(errObj){
                // Woops
                ctrl.response = 'Unable to fetch data';
            })['finally'](function() {
                // We done
                ctrl.loading = false;
            });
		};



		/**
		 * [confirm description]
		 * @param  {[type]} options [description]
		 * @return {[type]}         [description]
		 */
		ctrl.confirm = function(options) {
			// #TODO
		};

		/**
		 * [decline description]
		 * @param  {[type]} bill   [description]
		 * @param  {[type]} $index [description]
		 * @return {[type]}        [description]
		 */
		ctrl.decline = function (bill, $index) {
			bill.opened = false;
			bill.processing = true;
			bill.actions.decline({ id: bill.id }, null).$promise
			.then(function(response) {
				bill.response = {};
				bill.response.message = 'Bill declined';
				$timeout(function() {
					ctrl.sync();
				}, 1000);
			}, function(error){
				lpEbillingUtils.error(error);
			})['finally'](function() {
				lpEbillingUtils.info('Done');
				bill.processing = false;
			});
		};

		/**
		 * [accept description]
		 * @param  {[type]} bill   [description]
		 * @param  {[type]} $index [description]
		 * @return {[type]}        [description]
		 */
		ctrl.accept = function (bill, $index) {
			bill.opened = false;
			bill.processing = true;
			bill.actions.accept({ id: bill.id }, null).$promise
			.then(function(response) {
				bill.response = {};
				bill.response.action = 'success';
				bill.response.message = 'Bill accepted';
				$timeout(function() {
					ctrl.sync();
				}, 1000);
			}, function(error){
				lpEbillingUtils.error(error);
			})['finally'](function() {
				lpEbillingUtils.info('Done');
				bill.processing = false;
			});
		};

		/**
		 * [pay description]
		 * @param  {[type]} bill        [description]
		 * @param  {[type]} params      [description]
		 * @param  {[type]} $index      [description]
		 * @param  {[type]} $groupIndex [description]
		 * @return {[type]}             [description]
		 */
		ctrl.pay = function(bill, params, $index, $groupIndex) {

			params = {
				accountId: params.account || bill.mandate.debtor.account,
				amount: params.amount || bill.amount,
				scheduledDate: params.scheduleDate || bill.scheduleDate
			};

			bill.opened = false;
			bill.processing = true;
			processParams(params)
			.then(function(parameters) {
				bill.actions.pay({ id: bill.id }, parameters).$promise
				.then(function(response) {
					bill.response = {};
					bill.response.action = 'success';
					bill.response.message = 'Payment succesfull';

					$timeout(function() {
						ctrl.sync();
					}, 8000);

				}, function(error){
					lpEbillingUtils.error(error);
				})['finally'](function(){
					lpEbillingUtils.info('Done');
					bill.processing = false;
				});
			});

		};

		ctrl.reject = function (bill, $index, $groupIndex) {
			bill.opened = false;
			bill.processing = true;
			bill.actions.reject({ id: bill.id }, null).$promise
			.then(function(response) {
				bill.response = {};
				bill.response.message = 'Bill declined';
				$timeout(function() {
					ctrl.sync();
				}, 1000);
			}, function(error){
				lpEbillingUtils.error(error);
			})['finally'](function(){
				//lpEbillingUtils.info('Done');
				bill.processing = false;
			});
		};
	};
});
