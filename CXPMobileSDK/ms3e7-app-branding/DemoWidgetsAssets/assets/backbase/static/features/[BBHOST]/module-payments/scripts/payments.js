define( function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpPayments = function () {

        // @ngInject
        this.$get = function($q, $resource, lpCoreUtils) {

            var config = {
                paymentsEndpoint: '/mock/v1/payments'
            };

            function API() {

                var Rest = $resource(config.paymentsEndpoint, {}, {
                    getUnsubmitted: {
                        method: 'GET',
                        url: config.paymentsEndpoint + '/:ids/unsubmitted',
                        isArray: true
                    },
                    create: {
                        method: 'PUT'
                    },
                    del: {
                        method: 'DELETE',
                        url: config.paymentsEndpoint + '/:paymentId'
                    },
                    submit: {
                        method: 'POST',
                        url: config.paymentsEndpoint + '/:paymentId/submit'
                    }
                });

                /**
                 * Creates or updates payment order
                 *
                 * @param order
                 * @returns {promise}
                 */
                Rest.prototype.createOrder = function (order) {
                    var deferred = $q.defer();

                    Rest.create({paymentId: order.id}, order, function(response) {
                        deferred.resolve(response);
                    }, function(error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                /**
                 * Send payment orders to execution
                 *
                 * @param param
                 * @param authorization
                 * @returns {promise}
                 */
                Rest.prototype.send = function (param, authorization) {
                    var deferred = $q.defer();

                    Rest.submit(param, authorization || {}, function (response) {
                        deferred.resolve(response);
                    }, function(error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                /**
                 * Remove pending order.
                 *
                 * @param uuid
                 * @returns {promise}
                 */
                Rest.prototype.remove = function (orderId) {
                    var deferred = $q.defer();

                    Rest.del({paymentId: orderId}, {}, function (response) {
                        deferred.resolve(response);
                    }, function(error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };


                Rest.prototype.createModel = function() {
                    return new Rest({
                        id: lpCoreUtils.generateUUID() // to be refactored
                    });
                };

                Rest.prototype.load = function(accounts) {

                    // This is to not use default paging from payments Rest
                    var params = {
                        f: 0,   // paging: from
                        l: 100, // paging: size
                        ids: accounts.join()
                    };

                    return Rest.getUnsubmitted(params).$promise.then(function (resp) {
                        this.pendingOrdersGroups = this.preprocessPendingOrdersGroups(resp);
                        return this.pendingOrdersGroups;
                    }.bind(this));
                };

                Rest.prototype.preprocessPendingOrdersGroups = function(data) {
                    var paymentOrderGroups = [];
                    var paymentOrder;

                    var checkGroupExistance = function(accountId) {
                        var result = false;
                        for (var i = 0; i < paymentOrderGroups.length; i++) {
                            if (paymentOrderGroups[i]['@id'] === accountId) {
                                result = true;
                            }
                        }
                        return result;
                    };

                    var createGroup = function(id) {
                        paymentOrderGroups.push({
                            '@id': id,
                            'paymentOrders': []
                        });
                    };

                    var addPaymentOrderToGroup = function(paymentOrderDetail) {
                        if (!checkGroupExistance(paymentOrderDetail.accountId)) {
                            createGroup(paymentOrderDetail.accountId);
                        }

                        for (var i = 0; i < paymentOrderGroups.length; i++) {
                            if (paymentOrderGroups[i]['@id'] === paymentOrderDetail.accountId) {
                                paymentOrderGroups[i].paymentOrders.push(paymentOrderDetail);
                            }
                        }
                    };

                    for (var y = 0; y < data.length; y++) {
                        paymentOrder = data[y];

                        if(paymentOrder.counterpartyIban && paymentOrder.counterpartyIban.length > 0) {
                            paymentOrder.accountDetails = paymentOrder.counterpartyIban;
                        } else if(paymentOrder.counterpartyAccount && paymentOrder.counterpartyAccount.length > 0) {
                            paymentOrder.accountDetails = paymentOrder.counterpartyAccount;
                        } else if(paymentOrder.counterpartyEmail && paymentOrder.counterpartyEmail.length > 0) {
                            paymentOrder.accountDetails = paymentOrder.counterpartyEmail;
                        }

                        addPaymentOrderToGroup(paymentOrder);
                    }

                    return paymentOrderGroups;
                };

                /**
                 * Making form object to edit order in "New Transfer" widget
                 *
                 * @param order
                 */
                Rest.prototype.makeFormObject = function(order) {
                    var form = {
                        update: true, // here we notify it is UPDATE
                        uuid: order.id,
                        accountId: order.accountId,
                        isScheduledTransfer: order.scheduledTransfer.every ? true : false,
                        scheduleDate: order.onDate ? new Date(order.onDate) : new Date(),
                        scheduledTransfer: {
                            frequency: order.scheduledTransfer.frequency,
                            every: order.scheduledTransfer.every,
                            intervals: order.scheduledTransfer.intervals ? [order.schedule.intervals] : [],
                            timesToRepeat: order.scheduledTransfer.timesToRepeat || 1, // not in API
                            customOrder: order.scheduledTransfer.customOrder || true, // not in API
                            startDate: order.scheduledTransfer.startDate ? new Date(order.scheduledTransfer.startDate) : new Date()
                        },
                        selectedCounter: {
                            name: order.counterpartyName,
                            account: order.counterpartyIban || order.counterpartyEmail
                        },
                        instructedCurrency: order.instructedCurrency,
                        counterpartyName: order.counterpartyName,
                        counterpartyAccount: order.counterpartyAccount,
                        counterpartyIban: order.counterpartyIban || '',
                        counterpartyEmail: order.counterpartyEmail,
                        instructedAmount: order.instructedAmount.toFixed(2),
                        paymentReference: order.paymentReference || '', // not in API
                        paymentDescription: order.paymentDescription || '', // not in API
                        counterpartyAddress: order.counterpartyAddress || '', // not in API
                        isOpenDate: order.isOpenDate || false, // not in API
                        urgentTransfer: order.urgentTransfer || false, // not in API
                        type: order.type
                    };

                    return form;
                };


                return new Rest();
            }
            return {
                setConfig: function(options) {
                    config = lpCoreUtils(options).chain()
                        .mapValues(lpCoreUtils.resolvePortalPlaceholders)
                        .defaults(config)
                        .value();
                    return this;
                },

                getConfig: function(prop) {
                    if (prop && lpCoreUtils.isString(prop)) {
                        return config[prop];
                    } else {
                        return config;
                    }
                },

                api: API
            };

        };
    };

    // keep alias
    // #TODO deprecate PaymentOrderModel
    exports.PaymentOrderModel = exports.lpPayments;
});
