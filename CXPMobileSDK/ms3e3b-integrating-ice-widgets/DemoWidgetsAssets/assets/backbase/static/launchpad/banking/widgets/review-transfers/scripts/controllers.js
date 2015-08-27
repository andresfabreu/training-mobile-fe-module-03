/**
 * Controllers
 * @module controllers
 */
define(function(require, exports) {

    'use strict';

    var _ = require('base').utils;
    var profile = require('./profile-image');

    /**
     * MainCtrl description.
     */
    // @ngInject
    exports.MainCtrl = function ($templateCache, lpAlerts, $translate, $modal, $log, $timeout, lpPayments, lpAccounts, transferTypes, lpCoreBus, lpCoreUpdate, P2PService, reviewTransfersConfig) {
        var ctrl = this;
        var p2pTransferMade = false, bankTransferMade = false;
        ctrl.review = {};

        lpPayments = lpPayments.api();
        $templateCache.put('templates/verify-p2p-details.ng.html',
            '<div class="modal-header">' +
            '    <h2><i class="lp-icon lp-icon-xxl lp-icon-info-sign"></i> <span lp-i18n="Verify your contact details"></span></h2>' +
            '</div>' +
            '<form role="form" ng-submit="handleP2PVerification()">' +
            '    <div class="modal-body">' +
            '       <p>' +
            '           <span lp-i18n="We have sent a message containing a verification code to {{p2pUser.email}}."></span>' +
            '           <br />' +
            '           <span lp-i18n="Please check your email and enter the code"></span>' +
            '       </p>' +
            '       <p lp-i18n="The code will expire in 20 minutes"></p>' +
            '       <div ng-class="{\'has-error\': verify.validationError && verify.verificationCode.length > 0, \'has-feedback\': true, \'form-group\': true}">' +
            '           <label class="control-label"><strong lp-i18n="Verification Code:"></strong></label>' +
            '           <input type="input" ng-model="verify.verificationCode" class="form-control" tabindex="0" aria-label="Verification code" maxlength="4" placeholder="enter the 4 digits" />' +
            '       </div>' +
            '    </div>' +
            '    <div class="modal-footer text-right">' +
            '       <button name="closeModal" class="btn btn-link" ng-click="cancel()" type="button" lp-i18n="Cancel"></button>' +
            '       <button name="resendCode" class="btn btn-link" type="button" lp-i18n="Resend Code"></button>' +
            '       <button type="submit" class="btn btn-primary" ng-disabled="!verify.verificationCode" lp-i18n="Submit"></button>' +
            '    </div>' +
            '</form>');

        $templateCache.put('templates/authorize.ng.html',
            '<div class="modal-header">' +
            '    <h2>' +
            '        <i class="lp-icon lp-icon-xxl lp-icon-info-sign"></i>' +
            '        <span lp-i18n="Verify your payment(s)"></span>' +
            '    </h2>' +
            '</div>' +
            '<form role="form" ng-submit="authorize()">' +
            '    <div class="modal-body">' +
            '        <div ng-show="err.modalError">' +
            '            <div alert="alert" type="danger">{{ err.modalError | translate }}</div>' +
            '        </div>' +
            '        <p>Because your transaction to <b>{{currentOrder.counterpartyName}}</b> is over <span lp-amount="1000" lp-amount-currency="currentOrder.instructedCurrency" locale="locale"></span>(<i><span lp-amount="currentOrder.instructedAmount" lp-amount-currency="currentOrder.instructedCurrency" locale="locale"></span></i>), you need to verify it.</p>' +
            '        <div class="form-group has-feedback">' +
            '            <label class="control-label"><strong lp-i18n="Please enter authentication code:"></strong></label>' +
            '            <input type="password" ng-model="review.auth_password" class="form-control " placeholder="Password" />' +
            '        </div>' +
            '    </div>' +
            '    <div class="modal-footer text-right" >' +
            '        <button name="closeModal" class="btn btn-link" ng-click="cancel()" type="button" lp-i18n="Cancel"></button>' +
            '        <button type="submit" class="btn btn-primary" ng-disabled="!review.auth_password" lp-i18n="Verify"></button>' +
            '    </div>' +
            '</form>');

        $templateCache.put('templates/remove-confirmation.ng.html',
            '<div class="modal-header">' +
            '    <h2><i class="lp-icon lp-icon-xxl lp-icon-info-sign"></i> <span lp-i18n="Please confirm"></span></h2>' +
            '</div>' +
            '<form role="form" ng-submit="remove()">' +
            '    <div class="modal-body">' +
            '        <div ng-show="review.modalError">' +
            '        <div alert="alert" type="danger">{{ review.modalError | translate }}</div>' +
            '        </div>' +
            '        <p>' +
            '            <b lp-i18n="Are you sure you want to remove this payment?"></b>' +
            '        </p>' +
            '        <div class="row">' +
            '            <div class="col-xs-8">' +
            '            <small class="text-muted" lp-i18n="messages.TRANSFER_TO"></small><span class="h4" itemprop="counterpartyName"> {{paymentOrder.counterpartyName}}</span>' +
            '        </div>' +
            '        <div class="col-xs-4 text-right">' +
            '            <span class="h4" lp-amount="paymentOrder.instructedAmount" lp-amount-currency="paymentOrder.instructedCurrency" itemprop="instructedAmount"></span>' +
            '        </div>' +
            '    </div>' +
            '    <div class="row">' +
            '        <div class="col-xs-8">' +
            '            <small class="text-muted">' +
            '                {{ paymentOrder.accountDetails }}' +
            '            </small>' +
            '            </div>' +
            '            <div class="col-xs-4 text-right">' +
            '                <small class="text-muted" translate>{{ paymentOrder.onDate | date:\'longDate\' }}</small>' +
            '            </div>' +
            '        </div>' +
            '    </div>' +
            '    <div class="modal-footer text-right" >' +
            '        <div ng-show="error.isError" class="bg-warning text-danger pull-left" lp-i18n="Server error!"></div>' +
            '        <button name="closeModal" class="btn btn-link" ng-click="cancel()" type="button" lp-i18n="Cancel"></button>' +
            '        <button type="submit" class="btn btn-danger" lp-i18n="Remove"></button>' +
            '    </div>' +
            '</form>');

        $templateCache.put('templates/currency.not.same.html',
            '<div class="modal-header">' +
            '   <h2><i class="lp-icon lp-icon-xxl lp-icon-info-sign"></i> <span lp-i18n="Total amount"></span></h2>' +
            '</div>' +
            '<form role="form">' +
            '    <div class="modal-body">' +
            '       <p lp-i18n="Please note that in case of multi-currency usage the transfers cannot be calculated.' +
            '       Total amount is shown only for the same currency."></p>' +
            '   </div>' +
            '   <div class="modal-footer text-right" >' +
            '       <button class="btn btn-primary" ng-click="cancel()" type="button" lp-i18n="Ok"></button>' +
            '   </div>' +
            '</form>'
        );

        ctrl.decodePhotoUrl = function(photo) {
            return profile.getDefaultProfileImage(photo, 50, 50);
        };

        /**
         * Update model of the widget
         */
        var updateModel = function () {

            ctrl.loading = true;

            return lpAccounts.load().then(function (accounts) {

                var identifiers = accounts.map(function (account) {
                    return account.id;
                });

                //store unsent P2P payments here so widget doesn't think all po's are sent
                ctrl.p2pPaymentOrders = ctrl.p2pPaymentOrders || [];

                return lpPayments.load(identifiers).then(function () {
                    return P2PService.getUserEnrollmentDetails();
                })
                .then(function (data) {
                    ctrl.p2pUser = {
                        accountNumber: data.accountNumber,
                        email: data.email,
                        emailVerified: data.emailVerified
                    };
                })
                ['catch'](function () {
                    ctrl.p2pUser = {
                        emailVerified: false
                    };
                })
                ['finally'](function() {
                    ctrl.loading = false;
                });

            });
        };

        var initialize = function () {

            ctrl.alerts = lpAlerts;
            ctrl.accountsModel = lpAccounts;
            ctrl.ordersModel = lpPayments;
            ctrl.ordersModel.pendingOrdersGroups = [];

            updateModel()['finally'](function() {
                // Flush possible previous events before subscribing to prevent double updateModel call
                lpCoreBus.flush('launchpad-retail.paymentOrderInitiated');
                lpCoreBus.subscribe('launchpad-retail.paymentOrderInitiated', updateModel);
            });
        };

        /**
         * Returns transfers total information
         * TODO: Once API supports, this data should be pulled from PaymentsAPI
         */
        ctrl.pendingOrdersTotals = function() {
            var groups = ctrl.ordersModel.pendingOrdersGroups;
            var amount = 0;
            var count = 0;
            var currency;

            if (!groups || !groups.length) {
                return false;
            }

            currency = groups[0].paymentOrders[0].instructedCurrency;

            for (var i = 0, len = groups.length; i < len; i++) {
                for(var j = 0; j < groups[i].paymentOrders.length; j++) {
                    amount += groups[i].paymentOrders[j].instructedAmount;
                    if (currency && currency !== groups[i].paymentOrders[j].instructedCurrency) {
                        currency = false;
                    }
                    count++;
                }
            }

            return {
                count: count,
                amount: amount,
                currency: currency
            };
        };

        ctrl.changeLanguage = function (key) {
            $translate.use(key);
        };

        /**
         * EDIT ORDER
         *
         * @param order
         */
        ctrl.editOrder = function (order) {
            ctrl.makePayment();
            lpCoreBus.publish('lpMoneyTransfer.update', ctrl.ordersModel.makeFormObject(order));
        };

        ctrl.makePayment = function(){
            ctrl.alerts.close();
            lpCoreBus.publish('launchpad-retail.requestMoneyTransfer');
            // gadgets.pubsub.Publish('launchpad-retail.requestMoneyTransfer');
        };

        /**
         * Publish pub sub messages to instruct other widgets to refresh transaction lists
         */
        var refreshTransactionWidgets = function() {
            if (bankTransferMade) {
                lpCoreBus.publish('launchpad-retail.transactions.newTransferSubmitted');
                // gadgets.pubsub.publish('launchpad-retail.transactions.newTransferSubmitted');
            }

            if (p2pTransferMade) {
                lpCoreBus.publish('launchpad-retail.p2pTransactions.newTransferSubmitted');
                // gadgets.pubsub.publish('launchpad-retail.p2pTransactions.newTransferSubmitted');
            }

            //reset flags for next group of transfers
            bankTransferMade = false;
            p2pTransferMade = false;
        };

        /*
         * Submit pending orders sequentially
         * Processes items in ctrl.pendingOrders
         */
        var processOrdersSeq = function() {
            if (ctrl.pendingOrders.length === 0 && ctrl.p2pPaymentOrders.length === 0) {
                ctrl.alerts.push('alerts.SUBMITTED', 'success');
                ctrl.loading = false;
                refreshTransactionWidgets();
                return;
            }

            // Get the first order
            var order = ctrl.pendingOrders.pop();

            if (order) {
                //if p2p po, add to list and reset verification status
                if (order.type === transferTypes.p2pEmail) {
                    order.verificationFailure = false;
                    ctrl.p2pPaymentOrders.push(order);
                }
                ctrl.submitPayment(order);
            } else {
                //pending orders list is empty, reset p2p validation and array
                ctrl.p2pPaymentOrders = [];
                ctrl.p2pVerificationFailed = false;
            }
        };

        // Submit all pending payments
        ctrl.submitPayments = function(paymentsGroups) {
            ctrl.loading = true;
            var pendingOrders = [];

            _.forEach(ctrl.ordersModel.pendingOrdersGroups, function(group) {
                pendingOrders = pendingOrders.concat(group.paymentOrders);
            });

            ctrl.pendingOrders = pendingOrders;
            processOrdersSeq();
        };

        ctrl.authorizePayment = function(order, authorization) {
            ctrl.submitPayment(order, authorization);
        };

        // Submit a specific pending payment
        ctrl.submitPayment = function(order, authorization) {

            $log.info('Processing ' + order.id + ' payment order');
            if (order.verificationFailure) {
                processOrdersSeq();
                return;
            }

            //if the user's P2P details need to verified
            if (order.type === transferTypes.p2pEmail && !ctrl.p2pUser.emailVerified) {
                ctrl.verifyP2PDetails(order);
                return;
            }

            var groups = ctrl.ordersModel.pendingOrdersGroups,
                group = null;

            // Find the group containing this order
            for (var i = 0, n = groups.length; i < n; i++) {
                if (groups[i]['@id'] === order.accountId) {
                    group = groups[i];
                    break;
                }
            }

            if ( !group ) {
                $log.error('Error: Order ' + order.id + ' does not belong to any group.');
                return;
            }

            order.send({paymentId: order.id}, authorization).then(function(response) {

                // check authorization
                if (response.status === reviewTransfersConfig.statusAuthorization) {
                    ctrl.authorize(order);
                    return;
                }

                //refresh transactions?
                if (order.type === transferTypes.bank) {
                    bankTransferMade = true;
                } else if (order.type === transferTypes.p2pEmail) {
                    p2pTransferMade = true;
                }

                var orders = group.paymentOrders;
                order.submitted = true;

                $timeout(function(){
                    // Remove orders
                    orders.splice(orders.indexOf(order), 1);
                    // Remove groups
                    if (orders.length === 0) {
                        groups.splice(groups.indexOf(group), 1);
                    }
                    // Remove p2p orders
                    if (ctrl.p2pPaymentOrders.indexOf(order) > -1) {
                        ctrl.p2pPaymentOrders.splice(ctrl.p2pPaymentOrders.indexOf(order), 1);
                    }
                    // Successfuly executed order. Keep processing...
                    processOrdersSeq();
                }, 1000);

            }, function(error) {
                if (error.status === 401) {
                    ctrl.authorize(order);
                } else if (error.status === 403) {
                    ctrl.authorize(order);
                    ctrl.review.modalError = 'Authorization error.';
                    $timeout(function() { ctrl.review.modalError = ''; }, 7000);
                } else {
                    $log.error('Error: Order ' + order.id + ' didn\'t succeed.');
                    ctrl.alerts.push('alerts.FAILURE', 'danger');
                    ctrl.loading = false;
                }
            });
        };

        /**
         * Delete order action
         *
         * @param group
         * @param order
         */
        ctrl.removeOrder = function(group, order) {
            var modalInstance = $modal.open({
                template: $templateCache.get('templates/remove-confirmation.ng.html'),
                controller: 'RemoveConfirmationCtrl',
                resolve: {
                    paymentOrder: function() {
                        return order;
                    }
                }
            });

            modalInstance.result.then(function (response) {
                var orderIndex = group.paymentOrders.indexOf(order);
                group.paymentOrders.splice(orderIndex, 1);
                if (group.paymentOrders.length === 0) {
                    var groupIndex = ctrl.ordersModel.pendingOrdersGroups.indexOf(group);
                    ctrl.ordersModel.pendingOrdersGroups.splice(groupIndex, 1);
                }
            }, function (err) {
                //TODO: Add Error handling
                console.log(err);
            });
        };

        ctrl.authorize = function (order) {
            var modalInstance = $modal.open({
                template: $templateCache.get('templates/authorize.ng.html'),
                controller: 'AuthenticationCtrl',
                // size: size,
                resolve: {
                    currentOrder: function() {
                        return order;
                    },
                    modalError: function() {
                        return ctrl.review.modalError;
                    }
                }
            });

            modalInstance.result.then(function (authorization) {
                ctrl.loading = false;
                ctrl.authorizePayment(order, authorization);
            }, function () {
                ctrl.loading = false;
                //TODO: Add Error handling
            });
        };

        ctrl.verifyP2PDetails = function (order) {
            var modalInstance = $modal.open({
                template: $templateCache.get('templates/verify-p2p-details.ng.html'),
                controller: 'VerificationCtrl',
                resolve: {
                    currentOrder: function() {
                        return order;
                    },
                    P2PUser: function() {
                        return ctrl.p2pUser;
                    }
                }
            });

            modalInstance.result.then(
                function (success) {
                    ctrl.loading = false;
                    order.verificationFailure = !success;
                    if (success === true) {
                        ctrl.p2pUser.emailVerified = true;
                        ctrl.submitPayment(order);
                    }
                }, function (error) {
                    ctrl.loading = false;
                    //TODO: Add error handler
                }
            );
        };

        ctrl.sameCurrency = function () {
            ctrl.loading = true;
            var modalInstance = $modal.open({
                template: $templateCache.get('templates/currency.not.same.html'),
                controller: 'SameCurrencyCtrl'
            });

            modalInstance.result.then(function () {
                ctrl.loading = false;
            }, function () {
                ctrl.loading = false;
                //TODO: Add Error handling
            });
        };

        initialize();
    };

    // @ngInject
    exports.RemoveConfirmationCtrl = function($scope, $timeout, $modalInstance, paymentOrder, lpPayments) {
        $scope.error = { isError: false, message: ''};
        $scope.paymentOrder = paymentOrder;
        lpPayments = lpPayments.api();

        $scope.remove = function() {
            var delPromise = lpPayments.remove($scope.paymentOrder.id);
            delPromise.then(function(res) {
                $modalInstance.close(res);
            }, function(error) {
                // show error
                $scope.error.isError = true;
                $scope.error.message = error.statusText;
                $timeout(function() { $scope.error.isError = false; }, 4000);
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    // @ngInject
    exports.AuthenticationCtrl = function($scope, $modalInstance, currentOrder, modalError) {
        $scope.err = { modalError: modalError };
        $scope.review = { 'auth_password': '' };
        $scope.currentOrder = currentOrder;

        $scope.authorize = function() {
            $modalInstance.close($scope.review);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    // @ngInject
    exports.VerificationCtrl = function($scope, $modalInstance, currentOrder, P2PUser, P2PService) {
        $scope.verify = {};
        $scope.currentOrder = currentOrder;
        $scope.p2pUser = P2PUser;

        $scope.handleP2PVerification = function () {
            P2PService.verifyCode($scope.p2pUser.email, $scope.verify.verificationCode).then(function(response) {
                if(response.status === 200) {
                    $modalInstance.close(true);
                }
            }, function(response) {
                if(response.status === 400) {
                    $modalInstance.close(false);
                }
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    // @ngInject
    exports.SameCurrencyCtrl = function($scope, $modalInstance) {
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

});
