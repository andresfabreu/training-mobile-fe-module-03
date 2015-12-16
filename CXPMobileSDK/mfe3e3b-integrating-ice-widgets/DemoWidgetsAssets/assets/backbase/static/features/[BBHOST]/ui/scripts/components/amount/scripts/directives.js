define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.lpAmount = function(lpCoreI18n) {

        var CLASS_AMOUNT_NEGATIVE = 'lp-amount-negative';
        var CLASS_AMOUNT_POSITIVE = 'lp-amount-positive';

        function templateFn() {
            return '<span class="{{signClass}}">{{formattedAmount}}</span>';
        }

        function linkFn(scope, element, attrs) {
            function formatAmount() {
                var amount = parseFloat(scope.amount);
                scope.signClass = amount < 0 ? CLASS_AMOUNT_NEGATIVE : CLASS_AMOUNT_POSITIVE;
                scope.formattedAmount = lpCoreI18n.formatCurrency(amount, scope.currency);
            }

            scope.$watch('amount', formatAmount);
            scope.$watch('currency', formatAmount);

            scope.$on('$localeChangeSuccess', formatAmount);
        }

        return {
            restrict: 'EA',
            //replace: false, DO NOT USE REPLACE  ([DEPRECATED!], will be removed in next major release)
            template: templateFn,
            link: linkFn,
            // bindToController: true 1.3
            scope: {
                'amount': '=lpAmount',
                'currency': '=lpAmountCurrency'
            }
        };
    };
});
