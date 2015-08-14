define(function (require, exports, module) {

    'use strict';

    // Helper function
    function applyScope($scope) {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    /**
     * Angular Module & Controller
     */

    // @ngInject
    exports.AccountsController = function ($scope, $rootElement, lpWidget, AssetsModel, i18nUtils, lpUIResponsive, lpCoreUtils, lpCoreBus) {
        var bus = lpCoreBus;
        var widget = lpWidget;
        // Initialize
        var initialize = function () {

            // TODO: add locale support
            $scope.locale = 'en';

            $scope.iconClassList = [
                'text-primary',
                'text-success',
                'text-info',
                'text-warning',
                'text-danger'
            ];

            $scope.showGroups = lpCoreUtils.parseBoolean(widget.getPreference('showGroups'));
            $scope.showTotals = lpCoreUtils.parseBoolean(widget.getPreference('showGroupTotals'));
            $scope.showAccountHolderName = lpCoreUtils.parseBoolean(widget.getPreference('showAccountHolderName'));
            $scope.showAccountType = lpCoreUtils.parseBoolean(widget.getPreference('showAccountType'));
            $scope.showAccountHolderCategory = lpCoreUtils.parseBoolean(widget.getPreference('showAccountHolderCategory'));

            $scope.assets = AssetsModel.getInstance({
                assetsEndpoint: widget.getPreference('accountsDataSrc'),
                groupsEndpoint: lpCoreUtils.resolvePortalPlaceholders(widget.getPreference('groupsDataSrc'))
            });

            $scope.assets.load().then(function() {
                $scope.assets.loadingNow = false;
                if (!$scope.assets.accounts || (
                    !($scope.assets.accounts['current-account'] && $scope.assets.accounts['current-account'].length) &&
                    !($scope.assets.accounts.card && $scope.assets.accounts.card.length) &&
                    !($scope.assets.accounts['current-portfolio'] && $scope.assets.accounts['current-portfolio'].length)
                    )
                ) {
                    $scope.assets.noAccountsAvailable = true;
                }
            });

            $scope.assets.loadingNow = true;
            $scope.assets.noAccountsAvailable = false;

            $scope.defaultBalance = widget.getPreferenceFromParents('preferredBalanceView') || 'current';

            $scope.title = widget.getPreference('title');

            bus.subscribe('launchpad-retail.accountSelected', function(params) {
                $scope.assets.selected = params.accountId;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        };

        // Events
        widget.addEventListener('preferencesSaved', function () {
            widget.refreshHTML();
            initialize();
        });

        // refresh accounts if 'data freshness' flag changes from 'updating' to 'actual'
        bus.subscribe('lpDataFreshnessRefresh', function () {
            initialize();
            applyScope($scope);
        });

        $scope.selectAccount = function (account, groupCode) {
            $scope.assets.selected = account.id;

            if (account.type === 'portfolio') {
                bus.publish('launchpad-retail.portfolioSelected', account);
            } else if (groupCode && groupCode === 'card') {
                bus.publish('launchpad-retail.openCardManagement');
                bus.publish('launchpad-retail.cardSelected', {
                    account: account
                });
            } else {
                bus.publish('launchpad-retail.accountSelected', {
                    accountId: account.id,
                    originType: 'accounts'
                }, true);
            }
        };

        $scope.accountKeydown = function (evt, accountId) {
            if (evt.which === 13 || evt.which === 32) {
                evt.preventDefault();
                evt.stopPropagation();
                $scope.selectAccount(accountId);
            }
        };

        $scope.payForAccount = function ($event, id) {
            $event.stopPropagation();
            bus.publish('launchpad-retail.requestMoneyTransfer', {
                accountId: id
            });
        };

        $scope.toggleGroup = function (group) {
            group.isCollapsed = !group.isCollapsed;
        };

        // Responsive
        lpUIResponsive.enable($rootElement)
            .rule({
                'max-width': 200,
                then: function () {
                    $scope.responsiveClass = 'lp-tile-size';
                    applyScope($scope);
                }
            })
            .rule({
                'min-width': 201,
                'max-width': 350,
                then: function () {
                    $scope.responsiveClass = 'lp-small-size';
                    applyScope($scope);
                }
            }).rule({
                'min-width': 351,
                'max-width': 600,
                then: function () {
                    $scope.responsiveClass = 'lp-normal-size';
                    applyScope($scope);
                }
            }).rule({
                'min-width': 601,
                then: function () {
                    $scope.responsiveClass = 'lp-large-size';
                    applyScope($scope);
                }
            });

        initialize();
    };

});
