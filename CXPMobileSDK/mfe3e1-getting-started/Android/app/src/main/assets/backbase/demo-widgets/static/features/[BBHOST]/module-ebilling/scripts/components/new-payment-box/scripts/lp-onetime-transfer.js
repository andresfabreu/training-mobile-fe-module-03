define(function(require, exports, module) {

    'use strict';

    var onetimeTransferTemplate =
        '<div class="lp-onetime-transfer">' +
            '<div modal-dialog="" show="urgentTransferModalShown" closable="false">' +
                '<div class="modal-header">' +
                    '<h2><i class="lp-icon lp-icon-xxl lp-icon-info-sign"></i> <span lp-i18n="Urgent Transfer"></span></h2>' +
                '</div>' +
                '<div class="modal-body" lp-i18n="If you need to send money fast and cannot wait for the usual bank time of approx. 1-2 days then Urgent Transfer allows you to pass the money across in a 5 minute window instead. However, it does come with a 5$ charge and this will appear as a separate transaction in your activity view.">' +
                '</div>' +
                '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-primary" ng-click="toggleUrgentTransferModal()" lp-i18n="Close"></button>' +
                '</div>' +
            '</div>' +
            '<div class="one-time clearfix">' +

                '<div class="lp-st-section clearfix">' +
                    '<div class="pull-left lp-st-caption" lp-i18n="Sending date"></div>' +
                    '<div class="pull-left lp-st-control calendar">' +
                        '<input ng-click="isOpenDate = !isOpenDate" readonly required="required" type="text" name="scheduleDate"' +
                            'ng-model="paymentOrder.scheduleDate" datepicker-popup="dd-MMM-yyyy"' +
                            'min-date="todaysDate" is-open="isOpenDate" class="form-control" lp-future-time=""' +
                            'datepicker-options="dateOptions" show-button-bar="false" tabindex="0" placeholder="select date"' +
                            'aria-label="select date" />' +
                        '<span ng-click="isOpenDate = !isOpenDate" class="lp-icon lp-icon-calendar calendar-icon"></span>' +
                    '</div>' +
                '</div>' +

                '<div if="estimatedDeliveryDate" class="lp-st-section clearfix">' +
                    '<div class="pull-left lp-st-caption" lp-i18n="Delivery date"></div>' +
                    '<div class="pull-left lp-st-caption">' +
                        '<div>{{estimatedDeliveryDate}}</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="urgent-transfer clearfix" ng-show="showUrgentTransfer()">' +
                '<div class="urgent-checkbox pull-left">' +
                    '<input aria-label="urgent transfer" ng-model="paymentOrder.urgentTransfer" type="checkbox" />' +
                '</div>' +
                '<div class="urgent-message pull-left">' +
                    '<span class="text-muted">' +
                        '<span lp-i18n="Make transfer urgent"></span>' +
                    '</span>' +
                '</div>' +
            '</div>' +
            '<p ng-show="paymentOrder.urgentTransfer" class="urgent-transfer-message"><span lp-i18n="Making an urgent transfer will incur an extra cost. This will appear on your transactions as a separate transaction."></span></p>' +
        '</div>';

    exports.lpOnetimeTransfer = function() {
        var link = function(scope, element, attrs) {

        };

        return {
            restrict: 'A',
            scope: {
                paymentOrder: '=',
                estimatedDeliveryDate: '=?',
                showUrgentTransfer: '&'
            },
            link: link,
            replace: true,
            template: onetimeTransferTemplate
        };
    };

});
