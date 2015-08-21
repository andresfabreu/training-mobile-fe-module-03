define(function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.AccountsDropdownModel = function (lpWidget, $q, lpCoreUtils, lpAccounts, AccountsDropdownUtils, lpCoreError) {

        var initialAccountId = lpWidget.getPreference('initialAccountId') || '';
        var showAllAccountsItem = lpWidget.getPreference('showAllAccountsItem') || false;

        var model = {
            accounts: [],
            selected: {}
        };

        var findAccountById = function (id) {
            return model.accounts.filter(function (account) { return account.id === id; })[0] || null;
        };

        // loading accounts list and isolate it from sharing
        var loadAccounts = function () {
            var deferred = $q.defer();

            lpAccounts.load().then(function (data) {
                model.accounts = AccountsDropdownUtils.addAllAccountsItem(lpCoreUtils.clone(data));

                // select initial account (from preference - if any)
                if (initialAccountId) {
                    model.selected = findAccountById(initialAccountId);
                } else if (showAllAccountsItem) {
                    model.selected = findAccountById(AccountsDropdownUtils.getAllAccountsId());
                }

                deferred.resolve(model);

            }, function (err) {
                deferred.reject(err);
            });

            // Provide backward compatibility
            deferred.promise.success = deferred.promise.then;
            deferred.promise.error = deferred.promise['catch'];

            return deferred.promise;
        };

        // API
        return {
            loadAccounts: loadAccounts
        };
    };
});

