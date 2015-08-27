define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.AccountsDropdownController = function ($scope, lpCoreUtils, lpCoreError, lpCoreBus, AccountsDropdownModel, AccountsDropdownUtils) {
        var ctrl = this;

        var initialize = function() {

            // Load accounts and let know it is happened (or failed)
            AccountsDropdownModel.loadAccounts().then(function (model) {
                ctrl.model = model;
                lpCoreBus.publish('lpAccounts.loaded', ctrl.model.accounts);
            }, function (err) {
                lpCoreError.captureException(err);
            });

            // let know outer space about selected account
            $scope.$watch('ctrl.model.selected', function(value) {
                if (value) {
                    lpCoreBus.publish('launchpad-retail.accountSelected', {
                        accountId: ctrl.model.selected.id,
                        allAccounts: AccountsDropdownUtils.getAllAccountsId() === ctrl.model.selected.id ? true : false,
                        _noBehavior: true // Do not allow behavior to re-open the widget
                    }, true);
                }
            });
        };

        initialize();
    };
});
