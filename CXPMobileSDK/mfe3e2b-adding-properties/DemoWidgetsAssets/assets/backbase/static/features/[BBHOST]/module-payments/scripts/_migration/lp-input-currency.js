define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpInputCurrency = function(currencyMaxLength) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, $element, $attrs, ctrl) {
                var regex = /^\d+((\.|\,)\d+)?$/;


                var setValidity = function(isValidFormat, isNonZero, isMaxLength) {
                    ctrl.$setValidity('lpCurrencyFormat', isValidFormat);

                    if (!isValidFormat) {
                        // If format is not valid then more rules don't mean anything
                        isNonZero = true;
                        isMaxLength = true;
                    }

                    ctrl.$setValidity('lpCurrencyNonZero', isNonZero);
                    ctrl.$setValidity('lpCurrencyMaxLength', isMaxLength);
                };

                ctrl.$parsers.unshift(function(value) {
                    if (value) {
                        value = value.replace(",", ".");
                        setValidity(regex.test(value), parseFloat(value) !== 0, value.length < currencyMaxLength);
                    } else {
                        // Don't make any currency validation for empty value
                        setValidity(true, true, true);
                    }
                    return value;
                });
            }
        };
    };
});
