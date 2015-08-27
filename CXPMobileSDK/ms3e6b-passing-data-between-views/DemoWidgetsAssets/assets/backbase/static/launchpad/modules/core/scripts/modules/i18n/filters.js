define(function (require, exports) {
    'use strict';

    // @ngInject
    exports.currencySymbol = function (lpCoreI18nUtils) {
        return function (currency) {
            return lpCoreI18nUtils.CURRENCY_MAP[currency] || '';
        };
    };

});
