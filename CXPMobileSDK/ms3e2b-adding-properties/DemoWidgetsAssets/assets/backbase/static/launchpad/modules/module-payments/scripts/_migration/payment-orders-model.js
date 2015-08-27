// // ALREADY MIGRATED.

// define("launchpad/lib/payments/payment-orders-model", [
// 	"jquery",
//     "angular",
//     "launchpad/lib/common/util",
//     "launchpad/lib/payments/payments-module"], function($, angular, util, paymentsModule) {

//     "use strict";

//     	paymentsModule.factory('PaymentOrderModel', ['$resource', 'widget', function($resource, widget) {
// //    		var endpoint = _utils.resolvePath(widget.getPreference('paymentSrc'));
//             var endpoint = '/portalserver/services/rest/v1/payment-orders/:accountIds/:paymentId/:action';
//     		var PaymentOrderModel = $resource(endpoint, {}, {
//     				getUnsubmitted: {method: 'GET',  params: {action: 'unsubmitted'}, isArray: true},
//     				create: {method: 'PUT',  params: {action: 'create', paymentId: '@id'}},
//     				submit: {method: 'POST', params: {action: 'submit', paymentId: '@id'}}
//     		});

//     		PaymentOrderModel.createModel = function() {
//     			return new PaymentOrderModel({
//     				id: util.generateUUID(),
//     			});
//     		};

//     		PaymentOrderModel.prototype.load = function(accounts) {
//     		    var self = this;
//     		    var data =[];
//     		    PaymentOrderModel.getUnsubmitted({accountIds: accounts}, function(resp) {
//     		        data = resp;
//     		        self.pendingOrdersGroups = self.preprocessPendingOrdersGroups(data);
//     		    }, function(error) {
//     		    });
//     		};

//             PaymentOrderModel.prototype.preprocessPendingOrdersGroups = function(data) {
//                 var paymentOrderGroups = [];
//                 var paymentOrder;

//                 var checkGroupExistance = function(accountId) {
//                     var result = false;
//                     for (var i = 0; i < paymentOrderGroups.length; i++) {
//                         if (paymentOrderGroups[i]['@id'] === accountId) {
//                             result = true;
//                         }
//                     }

//                     return result;
//                 };

//                 var createGroup = function(id) {
//                     paymentOrderGroups.push({
//                         '@id': id,
//                         'paymentOrders': []
//                     });
//                 };

//                 var addPaymentOrderToGroup = function(paymentOrder) {
//                     if (!checkGroupExistance(paymentOrder.accountId)) {
//                         createGroup(paymentOrder.accountId);
//                     }

//                     for (var i = 0; i < paymentOrderGroups.length; i++) {
//                         if (paymentOrderGroups[i]['@id'] === paymentOrder.accountId) {
//                             paymentOrderGroups[i].paymentOrders.push(paymentOrder);
//                         }
//                     }
//                 };

//                 for (var i = 0; i < data.length; i++) {
//                     paymentOrder = data[i];

//                     if(paymentOrder.counterpartyIban && paymentOrder.counterpartyIban.length > 0) {
//                         paymentOrder.accountDetails = paymentOrder.counterpartyIban;
//                     } else if(paymentOrder.counterpartyAccount && paymentOrder.counterpartyAccount.length > 0) {
//                         paymentOrder.accountDetails = paymentOrder.counterpartyAccount;
//                     } else if(paymentOrder.counterpartyEmail && paymentOrder.counterpartyEmail.length > 0) {
//                         paymentOrder.accountDetails = paymentOrder.counterpartyEmail;
//                     }

//                     addPaymentOrderToGroup(paymentOrder);
//                 }

//                 return paymentOrderGroups;
//             };

//     		return PaymentOrderModel;
//     	}]);
// });
