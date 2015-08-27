/* globals define */

define( function (require, exports, module) {
    'use strict';

    // var _ = require('base').utils;

    /**
     * Ebilling list item directive
     * @type {Array} angular js directive
     */
     //@ngInject
    exports.payeeListItem = function ($timeout, $compile, lpCoreUtils, lpWidget, PayeeModel, PayeeService, CalendarService) {

        var linkFn = function (scope, $element, $attrs, modelCtrl) {
            scope.payee.opened = false;
            scope.payeeModel = PayeeModel;

            if (scope.payee.accountMask) {
                scope.payee.accountMask = '******** ' + scope.payee.accountMask;
            }

            scope.onClick = function($event) {
                scope.payee.opened = !scope.payee.opened;
            };
        };
        var templatesDir = lpCoreUtils.getWidgetBaseUrl(lpWidget) + '/templates';
        return {
            restrict: 'EA',
            require: '?ngModel',
            link: linkFn,
            templateUrl: templatesDir + '/list-item.ng.html',
            scope: {
                payee: '=ngModel'
            }
        };
    };

    //@ngInject
    exports.payeeContent = function ($timeout, $compile, lpCoreUtils, lpWidget, PayeeModel, PayeeService, CalendarService) {
        var templatesDir = lpCoreUtils.getWidgetBaseUrl(lpWidget) + '/templates';

        var linkFn = function (scope, $element, $attrs, modelCtrl) {
            scope.payeeModel = PayeeModel;

            var updateDeliveryDate = function(startDate) {
                if (startDate) {
                    var daysToDeliver = scope.payment.urgentTransfer ? 1 : scope.payee.businessDaysToDeliver;
                    CalendarService.getBusinessDay(startDate, daysToDeliver)
                        .then(function(result) {
                            scope.payment.estDeliveryDate = result;
                        });
                }
            };

            scope.$watch('payment.urgentTransfer', function() {
                updateDeliveryDate(scope.payment.scheduleDate);
            });

            scope.$watch('payment.scheduleDate', function(startDate) {
                updateDeliveryDate(startDate);
            });

            var createAPayment = function() {
                if (scope.payee.payment) {
                    scope.payment = scope.payee.payment;
                } else {
                    scope.payment = {
                        amount: 0,
                        scheduleDate: new Date(),
                        account: PayeeModel.defaultAccount,
                        currencySym: '$',
                        isScheduledTransfer: false,
                        scheduledTransfer: {
                            startDate: new Date(),
                            intervals: [],
                            timesToRepeat: 1
                        }
                    };
                    scope.payee.payment = scope.payment;
                }
            };

            var isValidPayment = function(payment) {
                scope.payee.warnings = [];
                if (!payment.account) { scope.payee.warnings.push({ code: 'ERROR_SELECT_ACCOUNT' }); }
                if (!payment.scheduleDate) { scope.payee.warnings.push({ code: 'ERROR_ENTER_PROCESSING_DATE' }); }
                if (!payment.amount) { scope.payee.warnings.push({ code: 'ERROR_ENTER_AMOUNT' }); }

                if (payment.isScheduledTransfer) {
                    if (!payment.scheduledTransfer.frequency) { scope.payee.warnings.push({ code: 'ERROR_SELECT_FREQUENCY' }); }
                    if (payment.scheduledTransfer.endOn === 'after' && !payment.scheduledTransfer.timesToRepeat) { scope.payee.warnings.push({ code: 'ERROR_ENTER_TIMES_TO_REPEAT' }); }
                }

                if (scope.payee.warnings.length > 0) { return false; }
                return true;
            };

            scope.pay = function() {
                if (isValidPayment(scope.payment)) {
                    scope.payee.processing = true;
                    scope.payee.opened = false;

                    PayeeService.submitPayment(scope.payee, scope.payment)
                        .then(function(response) {
                            scope.payee.response = {};
                            scope.payee.response.action = 'success';
                            scope.payee.response.message = 'ALERT_PAYMENT_SUBMITTED';

                            $timeout(function() {
                                delete scope.payee.response;
                            }, 3000);
                        }, function(response){
                            scope.payee.opened = true;
                            scope.payee.errors = response.data.errors;
                        })['finally'](function() {
                            scope.payee.processing = false;
                        });
                }
            };

            scope.showUrgentTransfer = function() {
                return scope.payee.canExpeditePayments && scope.payee.paymentMethod === PayeeModel.paymentMethods.CHECK;
            };

            createAPayment();
        };

        return {
            restrict: 'EA',
            link: linkFn,
            templateUrl: templatesDir + '/list-item-content.ng.html',
            scope: {
                payee: '='
            }
        };
    };

});
