define(function(require, exports, module) {

    'use strict';

    var paymentBoxTemplate =
        '<div class="lp-new-payment-box">' +

            '<div class="form-group" ng-if="eBill">' +

                '<div class="clearfix">' +
                    '<div class="radio col-xs-7">' +
                        '<label class="control-label">' +
                            '<input type="radio" name="statementBalanceAmount" ng-click="setEBillAmount(eBill.outstandingBalance)" ' +
                                'ng-model="paymentAmountSelection" value="statement" />' +
                            '<span>Statement Balance</span>' +
                        '</label>' +
                    '</div>' +
                     '<div class="col-xs-5 col-sm-2 text-right">' +
                         '<span class="radio h5">{{eBill.outstandingBalance}}</span>' +
                    '</div>' +
                '</div>' +

                '<div class="clearfix">' +
                    '<div class="radio col-xs-7">' +
                        '<label class="control-label">' +
                            '<input type="radio" name="minimumAmount" ng-click="setEBillAmount(eBill.amountDue)" ' +
                                'ng-model="paymentAmountSelection" value="minimum"  />' +
                            '<span>Minimum Amount</span>' +
                        '</label>' +
                    '</div>' +
                    '<div class="col-xs-5 col-sm-2 text-right">' +
                         '<span class="radio h5">{{eBill.amountDue}}</span>' +
                    '</div>' +
                '</div>' +

                '<div class="form-group clearfix">' +
                    '<div class="radio col-xs-7">' +
                        '<label class="control-label">' +
                            '<input type="radio" name="SpecificAmount" ng-click="setEBillAmount(0)" ' +
                                'ng-model="paymentAmountSelection" value="specific" />' +
                            '<span>Specified Amount</span>' +
                      '</label>' +
                    '</div>' +
                    '<div class="col-xs-5 lp-currency-amount-input" ng-show="isSpecificPaymentSelected()"">' +
                        '<div class="amount-area" name="amount" ng-model="paymentOrder.amount"' +
                           'e-bill-amount-input="{currencySym: bill.currencySym }"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div class="form-group clearfix" ng-if="!eBill">' +
                '<label class="col-xs-12 col-sm-12 control-label">Amount to pay</label>' +
                '<div class="col-xs-12 col-sm-12 col-md-7 lp-currency-amount-input">' +
                    '<div class="amount-area" name="amount" ng-model="paymentOrder.amount"' +
                    'e-bill-amount-input="{ currencySym: paymentOrder.currencySym }" required="required"></div>' +
                '</div>' +
            '</div>' +

            '<div class="form-group clearfix">' +
                '<label class="col-xs-12 col-sm-12 control-label">Pay with</label>' +
                '<div class="col-xs-12 col-sm-12">' +
                    '<div name="accountId" class="lp-accounts-header" ng-change=""' +
                        'lp-accounts-select="lp-accounts-select"' +
                        'ng-model="paymentOrder.account"' +
                        'lp-accounts="accounts" required="required">' +
                    '</div>' +
                '</div>' +
            '</div>' +

            '<div lp-payment-date-box ' +
                'payment-order="paymentOrder" ' +
                'show-urgent-transfer="showUrgentTransfer()"' +
                'scheduled-transfer-frequencies="scheduledTransferFrequencies"' +
                'scheduled-transfer-end-options="scheduledTransferEndOptions">' +
            '</div>' +

            '<div class="memo">' +
                '<textarea aria-label="payment description" class="form-control memo-area"' +
                    'placeholder="Description (optional) Maximum number of characters is 140"' +
                    'maxlength="140"' +
                    'ng-model="paymentOrder.memo">' +
                '</textarea>' +
            '</div>' +
        '</div>';

    exports.lpNewPaymentBox = function() {

        var link = function(scope, element, attrs) {
            scope.paymentAmountSelection = 'statement';

            scope.setEBillAmount = function(amount) {
                scope.paymentOrder.amount = amount;
            };

            scope.isSpecificPaymentSelected = function() {
                return this.paymentAmountSelection === 'specific';
            };
        };
        return {
            restrict: 'A',
            scope: {
                paymentOrder: '=payment',
                accounts: '=accounts',
                eBill: '=?', // e.g. { amountDue: 98.65, outstandingBalance: 986.5, dueDate: "2015-03-31" } */
                showUrgentTransfer: '&',
                scheduledTransferFrequencies: '=?',
                scheduledTransferEndOptions: '=?'
            },
            replace: true,
            link: link,
            template: paymentBoxTemplate
        };
    };

});
