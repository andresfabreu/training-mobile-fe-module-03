define(function(require, exports, module) {
    'use strict';

    var paymentDateBoxTemplate =
        '<form name="PaymentDateBoxForm" class="lp-payment-date-box">' +
            '<div class="e-bill-info-wrapper">' +
                '<ul tabset="tabset" class="tabset">' +
                    '<li tab="tab" select="onetimeTransfer()">' +
                        '<span tab-heading="tab-heading" class="tab-heading" lp-i18n="One Time"></span>' +
                        '<div lp-onetime-transfer payment-order="paymentOrder" ' +
                            'estimated-delivery-date="paymentOrder.estDeliveryDate" ' +
                            'show-urgent-transfer="showUrgentTransfer()">' +
                        '</div>' +
                    '</li>' +
                    '<li tab="tab" select="scheduledTransfer()">' +
                        '<span tab-heading="tab-heading" class="tab-heading" lp-i18n="Recurring"></span>' +
                        '<div lp-scheduled-transfer="lp-scheduled-transfer" ng-model="paymentOrder.scheduledTransfer">' +
                        '</div>' +
                    '</li>' +
                '</ul>' +
            '</div>' +
        '</form>';

    exports.lpPaymentDateBox = function() {
        var link = function(scope, element, attrs) {

            scope.onetimeTransfer = function() {
                scope.paymentOrder.isScheduledTransfer = false;
            };

            scope.scheduledTransfer = function() {
                scope.paymentOrder.isScheduledTransfer = true;
            };

        };
        return {
            restrict: 'A',
            replace: true,
            scope: {
                paymentOrder: '=',
                showUrgentTransfer: '&?',
                frequencies: '=?scheduledTransferFrequencies',
                endOptions: '=?scheduledTransferEndOptions'
            },
            template: paymentDateBoxTemplate,
            link: link
        };
    };

});
