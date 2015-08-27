/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function($scope, $element, $timeout, lpWidget, lpCoreUtils, lpCoreBus, lpUIResponsive, lpTransactionsCategory, lpTransactions, lpAccounts, PreferenceService) {
        var ctrl = this;

        var scopeApply = function() {
            $timeout(function() {
                $scope.$apply();
            });
        };

        var bindBusListeners = function() {
            lpCoreBus.subscribe('transactions-search:search:filter', function(filters) {
                ctrl.data.transactions.setFilters(filters);
                ctrl.data.transactions.loadTransactions(ctrl.data.accounts.selected);
            });
            lpCoreBus.subscribe('transactions-search:search:clear', function() {
                ctrl.data.transactions.clearFilters();
                ctrl.data.transactions.loadTransactions(ctrl.data.accounts.selected);
            });
            lpCoreBus.subscribe('transactions-search:search:update', function() {
                ctrl.data.transactions.updateFilters();
                ctrl.data.transactions.loadTransactions(ctrl.data.accounts.selected);
            });
            lpCoreBus.subscribe('transactions-search:sort:change', function(value) {
                ctrl.data.transactions.sort = value.sort;

                if (ctrl.data.transactions.transactions && ctrl.data.transactions.transactions.length) {
                    ctrl.data.transactions.loadTransactions(ctrl.data.accounts.selected);
                }
            });
        };

        // Store data used by the widget
        ctrl.data = {
            transactions: lpTransactions.api(),
            transactionsCategory: lpTransactionsCategory.api(),
            accounts: lpAccounts
        };

        // Load configured preferences by the widget
        lpCoreUtils.assign($scope, {
            showCategories: true,
            previewAll: false,
            showDatesAllTransactions: lpCoreUtils.parseBoolean(lpWidget.getPreference('showDatesAllTransactions')),
            hideDetailsPreference: lpCoreUtils.parseBoolean(lpWidget.getPreference('hideTransactionDetails')),
            showTransactionIcons: true
        });

        ctrl.data.transactionsCategory.getAll();

        ctrl.data.accounts.load()
        .then(function() {
            bindBusListeners();
            if(!ctrl.data.accounts.selected && ctrl.data.accounts.accounts && ctrl.data.accounts.accounts.length > 0) {
                var selectedAccount = ctrl.data.accounts.findByAccountNumber(lpWidget.getPreference('defaultAccount')) || ctrl.data.accounts.accounts[0];
                ctrl.data.accounts.selected = selectedAccount;
            }
        });

        PreferenceService.read().success(function(response) {
            if (response && !lpCoreUtils.isUndefined(response.pfmEnabled)) {
                $scope.showCategories = lpCoreUtils.parseBoolean(response.pfmEnabled);
            }
        });

        lpUIResponsive.enable($element)
            .rule({
                'max-width': 200,
                then: function() {
                    $scope.categorySmallLayout = false;
                    $scope.responsiveClass = 'lp-tile-size';
                    scopeApply();
                }
            })
            .rule({
                'min-width': 201,
                'max-width': 375,
                then: function() {
                    $scope.accountSelectSize = 'small';
                    $scope.categorySmallLayout = true;
                    $scope.responsiveClass = 'lp-small-size';
                    scopeApply();
                }
            })
            .rule({
                'min-width': 376,
                'max-width': 600,
                then: function() {
                    $scope.accountSelectSize = 'large';
                    $scope.categorySmallLayout = false;
                    $scope.responsiveClass = 'lp-medium-size';
                    scopeApply();
                }
            })
            .rule({
                'min-width': 601,
                then: function() {
                    $scope.categorySmallLayout = false;
                    $scope.responsiveClass = 'lp-large-size';
                    scopeApply();
                }
            });
    };
});
