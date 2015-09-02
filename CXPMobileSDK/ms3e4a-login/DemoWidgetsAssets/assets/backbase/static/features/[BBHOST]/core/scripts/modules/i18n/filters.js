define(function (require, exports, module) {
    'use strict';

    /**
     * Renders proper currency symbol.
     *
     * @example
     * ```
     * <span>{{'JPY'|currencySymbol}}</span>
     * <span>¥</span>
     * ```
     *
     * @memberof core.i18n
     * @ngFilter
     * @ngInject
     */
    exports.currencySymbol = function (lpCoreI18nUtils) {
        return function (currency) {
            return lpCoreI18nUtils.CURRENCY_MAP[currency] || '';
        };
    };
});
