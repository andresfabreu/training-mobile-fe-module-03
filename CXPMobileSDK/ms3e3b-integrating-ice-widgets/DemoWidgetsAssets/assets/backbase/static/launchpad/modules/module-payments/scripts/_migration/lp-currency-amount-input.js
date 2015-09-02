define(function(require, exports, module) {
    'use strict';


    // @ngInject
    var ctrlFn = function($scope) {
        var initialize = function() {
            $scope.wholeAmount = "";
            $scope.decimalAmount = "";
            $scope.amountInDomesticCurrency = "0.00";
            $scope.fieldLength = 6;
        };

        initialize();
    };

    // @ngInject
    exports.lpCurrencyAmountInput = function($templateCache) {
        $templateCache.put("$currencyAmountTemplate.html",
                '<div class="lp-currency-amount-input">' +
                    '<div class="clearfix">' +
                        '<div class="select-area pull-left">' +
                            '<div class="currency-select" ng-hide="lpDisableCurrencySelection" dropdown-select="dropdown-select" empty-placeholder-text="EUR" ng-model="lpCurrencyList.selected" ng-options="val as val.currency_code group by val.group for val in lpCurrencyList.orderedCurrencies" ng-hide="lpCurrencyList.error" aria-required="true" aria-label="currency"></div>' +
                            // Below line should be uncommented once we have a default currency service running
                            //'<div class="default-currency" ng-show="lpDisableCurrencySelection">{{lpCurrencyList.defaultCurrency.currency_code}}</div>'+
                        '</div>' +
                        '<div class="amount-area pull-left"">' +
                            '<input name="wholeAmountInput" type="number" lp-number-input="lp-number-input" lp-max-length="fieldLength" min="0" step="1" class="form-control whole-amount-input pull-left" ng-model="wholeAmount" placeholder="Amount" aria-required="true" aria-label="amount" />' +
                            '<div  class="pull-left decimal"><span class="decimal-point">.</span></div>' +
                            '<input type="text" pattern="[0-9]" lp-number-input="lp-number-input" lp-max-length="2" min="0" step="1" class="form-control pull-left decimal-amount-input" ng-model="decimalAmount" placeholder="00"  aria-required="true" aria-label="decimal amount" />' +
                        '</div>' +
                    '</div>' +
                    '<div class="info">' +
                        '<div ng-hide="lpDisableCurrencySelection || lpCurrencyList.error || lpCurrencyList.selected === lpCurrencyList.defaultCurrency" class="info-message"><span class="text-muted">This transfer is {{amountInDomesticCurrency}} in {{lpCurrencyList.defaultCurrency.currency_code}}<i class="lp-icon lp-icon-xxl lp-icon-info-sign open-popup" ng-click="toggleExchangeRateModal()"></i></span></div>' +
                    '</div>' +
                '</div>');

        return {
            restrict : "EA",
            scope: {
                "amount": "=ngModel",
                "lpCurrencyList": "=",
                "lpPaymentOrder": "=",
                "lpDisableCurrencySelection": "=",
                "toggleExchangeRateModal": "=modal"
            },
            require: "ngModel",
            replace: true,
            controller: ctrlFn,
            template: $templateCache.get("$currencyAmountTemplate.html"),
            link: function (scope, element, attrs, ctrl) {

                var $decimalInput = element.find(".decimal-amount-input");

                //cater for changes in model from outside of directive
                ctrl.$formatters.push(function(value) {

                    var valueToCheck = formatAmount();

                    if(value !== "0.00" && value !== '' && value !== valueToCheck) {
                        var tempAmountArray = value.split(".");
                        scope.wholeAmount = parseInt(tempAmountArray[0], 10);

                        if(tempAmountArray[1] !== "00") {
                            scope.decimalAmount = tempAmountArray[1];
                        }
                    }
                    return value;
                });

                //Updates the current amount entered in domestic currency
                var updateAmountInDomesticCurrency = function() {
                    var amount = scope.amount;

                    amount = amount / scope.lpCurrencyList.selected.exchange_rate;
                    amount = fixFloatDecimal(amount);

                    scope.amountInDomesticCurrency = amount;
                };

                //Parses values in text fields and sets the paymentOrder.instructedAmount
                var updatePaymentOrderModelAmount = function() {

                    var amount = formatAmount();

                    var instructedAmount = parseInt(scope.wholeAmount, 10);

                    if (scope.fieldLength && instructedAmount.toString().length > scope.fieldLength) {
                        ctrl.$setValidity("lpCurrencyMaxLength", false);
                    } else {
                        ctrl.$setValidity("lpCurrencyMaxLength", true);
                    }

                    if(amount === "0.00") {
                        ctrl.$setValidity("lpAmountRequired", false);
                    } else if(amount.length > 0){
                        ctrl.$setValidity("lpAmountRequired", true);
                    }

                    scope.amount = amount;

                    //if the currencyService loaded succesfully
                    if(scope.lpCurrencyList.orderedCurrencies.length > 0) {
                        updateAmountInDomesticCurrency();
                    }
                };

                var formatAmount = function() {

                    var decimal = scope.decimalAmount;
                    var instructedAmount = parseInt(scope.wholeAmount, 10);
                    var leadingZero = /^0[0-9].*$/
                    instructedAmount = isNaN(instructedAmount) ? 0 : instructedAmount;

                    //assign the correct decimal value to a decimal lower than 10
		    if(decimal < 10 && !leadingZero.test(decimal)) {
                        decimal = "0" + decimal;
                    }

                    decimal = parseFloat("0." + decimal);

                    var amount = decimal === 0 ? instructedAmount  : instructedAmount + decimal;
                    amount = fixFloatDecimal(amount);
                    return amount;
                };

                var fixFloatDecimal = function(value) {

                    return value.toFixed(2);
                };

                //Sets the instructedCurrency
                var setCurrency = function() {
                    scope.lpPaymentOrder.instructedCurrency = scope.lpCurrencyList.selected.currency_code;
                    handleFieldLengthUpdate();
                };

                //updates amount field length, instructedAmount and amountInDomestic based on exchange rate of selected currency
                var handleFieldLengthUpdate = function() {

                    var oldFieldLength = scope.fieldLength;
                    scope.fieldLength = scope.lpCurrencyList.selected.exchange_rate > 2.0 ? 8 : 6;

                    //if the field length has shrunk, make sure the instructedAmount and amountInDomestic updates
                    if(oldFieldLength > scope.fieldLength && scope.wholeAmount.toString().length > 6) {
                        scope.wholeAmount = parseInt(scope.wholeAmount.toString().substring(0, 6), 10);
                        updatePaymentOrderModelAmount();
                    } else if(scope.wholeAmount !== "" || scope.decimalAmount !== "") { //if not blank, just update amountInDomestic
                        updateAmountInDomesticCurrency();
                    }
                };

                //Apply updated instructedAmount to lpPaymentOrder
                scope.$watchCollection('[wholeAmount, decimalAmount]', function(newValue) {
                    if(newValue[0]) {
                        //if the change contains a decimal, focus on decimal input
                        if (newValue[0].toString().indexOf(".") > -1) {
                            scope.wholeAmount = parseInt(scope.wholeAmount.toString().replace(".", ""), 10);
                            $decimalInput.focus();
                        }
                    }

                    updatePaymentOrderModelAmount();
                });

                //update currency
                scope.$watch("lpCurrencyList.selected", function() {
                    //prevent unneccessary setting of Currency
                    if(scope.lpCurrencyList.selected && scope.lpCurrencyList.orderedCurrencies.length > 1) {
                        setCurrency();
                    }
                });

                //listen for succesful form submission and reset values to default
                scope.$on("reset", function() {
                    scope.wholeAmount = "";
                    scope.decimalAmount = "";
                    scope.amountInDomesticCurrency = "0.00";
                    scope.fieldLength = 6;
                });
            }
        };
    };
});
