define(function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.AccountsDropdownUtils = function (lpCoreUtils) {
        var allAccountsId = '000-000-000';

        var allAccountsItem = {
            id: allAccountsId,
            ids: '',
            hideAmounts: true,
            currency: '',
            alias: 'All Finances',
            availableBalance: '',
            bookedBalance: '',
            accountIdentification: [],
            identifier: ''
        };

        // Get a list of accounts as a single string
        var getListAccountNames = function (list, separator, propName) {
            return lpCoreUtils.pluck(list, propName || 'alias').join((separator || ',') + ' ');
        };

        // check if the 'All accounts' item is already in accounts list
        var isAllAccountsItemInList = function (list) {
            return lpCoreUtils.some(list, function(item) {
                return item.id === allAccountsId;
            });
        };

        // check if we have the same currency in accounts list
        var isSameCurrencyAllAccounts = function (list) {
            var curr = lpCoreUtils.chain(list).pluck('currency').uniq().value();
            return curr.length === 1 ? curr[0] : false;
        };

        // get total amount for balances provided in accounts data
        var aggregateBalance = function (list, type) {
            var values = lpCoreUtils.pluck(list, type);
            var total = 0.0;

            if (lpCoreUtils.isArray(values)) {
                lpCoreUtils.forEach(values, function (val) {
                    var balance = parseFloat(val) || 0.0;
                    total += balance;
                });
            }

            return total;
        };

        // get an object with account ID as a key and its alias as a value
        var getNamesCollection = function (list) {
            var keys, values, res = {};

            if (!list || !lpCoreUtils.isArray(list)) {
                return res;
            }

            keys = lpCoreUtils.pluck(list, 'id');
            values = lpCoreUtils.pluck(list, 'alias');

            keys.forEach(function (key, index) {
                res[key] = values[index] || 'No Data';
            });

            return res;
        };

        // get list of all 'real' accounts we know about
        var getAccountsIds = function (list) {
            return lpCoreUtils.pluck(list, 'id').join(',');
        };

        // API
        return {
            addAllAccountsItem: function (list) {
                if (!isAllAccountsItemInList(list)) {
                    allAccountsItem.accountsNames = getNamesCollection(list);
                    allAccountsItem.ids = getAccountsIds(list);
                    allAccountsItem.identifier = getListAccountNames(list);

                    // add aggregated balances
                    if (isSameCurrencyAllAccounts(list) !== false) {
                        allAccountsItem.availableBalance = aggregateBalance(list, 'availableBalance');
                        allAccountsItem.bookedBalance = aggregateBalance(list, 'bookedBalance');
                        allAccountsItem.currency = isSameCurrencyAllAccounts(list);
                        allAccountsItem.hideAmounts = false;
                    }

                    list.unshift(allAccountsItem);
                }
                return list;
            },

            getAllAccountsId: function () {
                return allAccountsId;
            }
        };
    };
});
