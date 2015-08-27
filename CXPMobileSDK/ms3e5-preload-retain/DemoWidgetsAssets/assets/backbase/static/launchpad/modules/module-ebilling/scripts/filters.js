define( function( require, exports, module) {

    'use strict';

    // @ngInject
    exports.eBillCurrency = function($filter, lpEbilling) {
        var orgCurrencyFilterFn = $filter('currency');
        var eBillOptions = lpEbilling.getConfig();
        var showCurrencySym = eBillOptions.showCurrencySym;
        return function (amount, currencySym) {
            currencySym = (showCurrencySym ? currencySym : '');
            return orgCurrencyFilterFn(amount, currencySym );
        };
    };

});
