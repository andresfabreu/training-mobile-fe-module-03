/**
 * Transactions Search controller
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function($scope, lpWidget, lpCoreBus, lpCoreUtils, $q, lpAccounts, ContactsModel, lpTransactionsCategory, lpTagsUtils) {
        lpCoreUtils.assign($scope, {
            accounts: lpAccounts,
            transactionsCategory: lpTransactionsCategory.api(),
            contacts: new ContactsModel({
                contacts: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('contactsDataSrc')),
                lazyload: true
            })
        });

        $q.all([
            $scope.accounts.getAll(),
            $scope.transactionsCategory.getAll(),
            $scope.contacts.loadContacts()
        ]).then(function() {
            if(!lpAccounts.selected && lpAccounts.accounts.length) {
                lpAccounts.selected = lpAccounts.accounts[0];
            }
        });

        $scope.onPerformSearch = function(filters) {
            lpTagsUtils.setFilter(filters);
            lpCoreBus.publish('transactions-search:search:filter', filters);
        };

        $scope.onClearSearch = function() {
            lpTagsUtils.clearFilters();
            lpCoreBus.publish('transactions-search:search:clear');
        };

        $scope.onUpdateSearch = function() {
            lpCoreBus.publish('transactions-search:search:update');
        };

        $scope.onChangeSort = function(value) {
            lpCoreBus.publish('transactions-search:sort:change', value);
        };
    };
});
