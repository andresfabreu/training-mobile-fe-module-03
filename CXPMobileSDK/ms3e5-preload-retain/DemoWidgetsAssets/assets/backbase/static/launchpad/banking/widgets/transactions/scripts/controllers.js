/**
 * Transactions controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function($scope, $element, $timeout, lpWidget, lpCoreBus, i18nUtils, lpCoreUtils, lpTransactionsCategory, lpTransactions, lpAccounts, lpUIResponsive, ContactsModel, PreferenceService) {
        var scopeApply = function() {
            setTimeout(function() {
                $scope.$apply();
            });
        };

        var accountType = {
            'ACCOUNT': 'account',
            'CARD': 'card'
        };

        var checkSelectedAccount = function(type, account) {
            lpCoreUtils.forEach(lpAccounts.accounts, function(currentAccount){
                if(account[accountType[type] + 'Id'] === currentAccount.id){
                    lpAccounts.selected = currentAccount;
                }
            });

            scopeApply();
        };

        var load = function() {
            $scope.lpTransactionsCategory.getAll();
            $scope.lpContacts.loadContacts();
        };

        var initialize = function() {
            // Expose providers in the scope
            $scope.lpAccounts = lpAccounts;
            $scope.lpTransactionsCategory = lpTransactionsCategory.api();
            $scope.lpTransactions = lpTransactions.api();
            $scope.lpContacts = new ContactsModel({
                contacts: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('contactsDataSrc')),
                lazyload: true
            });

            $scope.showCharts = lpCoreUtils.parseBoolean(lpWidget.getPreference('showCharts'));
            $scope.showAccountSelect = lpCoreUtils.parseBoolean(lpWidget.getPreference('showAccountSelect'));
            $scope.accountsTopBalance = lpWidget.getPreference('preferredBalanceView') || 'current';
            $scope.showCategories = false;
            $scope.offsetTopCorrection = 0;
            //Switch to show large account select or small
            $scope.accountSelectSize = 'large';
            $scope.tabs = {
                'list': true,
                'chart': false,
                'combined': false
            };

            /**
             * Accounts
             */
            lpAccounts.load()
            .then(function() {
                if(!lpAccounts.selected && lpAccounts.accounts && lpAccounts.accounts.length > 0) {
                    var selectedAccount = lpAccounts.findByAccountNumber(lpWidget.getPreference('defaultAccount')) || lpAccounts.accounts[0];
                    lpAccounts.selected = selectedAccount;

                    //now safe to listen for select account messages
                    lpCoreBus.subscribe('launchpad-retail.accountSelected', function(account) {
                        if (!account.originType || account.originType !== 'transactions') {
                            checkSelectedAccount(accountType.ACCOUNT, account);
                        }
                    });

                    lpCoreBus.subscribe('launchpad-retail.cardSelected', function(account) {
                        if (account.cardId) {
                            checkSelectedAccount(accountType.CARD, account);
                        }
                    });
                }
            });

            load();

            lpCoreBus.subscribe('launchpad-retail.offsetTopCorrection', function(data) {
                $scope.offsetTopCorrection = data.offsetTopCorrection;
            });

            PreferenceService.read().success(function(response) {
                $scope.showCategories = lpCoreUtils.parseBoolean(response.pfmEnabled);
            });
        };

        // Handlers
        $scope.accountChanged = function() {
            lpCoreBus.publish('launchpad-retail.accountSelected', {
                accountId: lpAccounts.selected.id,
                originType: 'transactions',
                _noBehavior: true // Do not allow behavior to re-open the widget
            }, true);
        };

        $scope.selectTab = function(tab) {
            $scope.$broadcast('tabSelected', tab);
        };

        $scope.transferMoney = function() {
            lpCoreBus.publish('launchpad-retail.requestMoneyTransfer');
        };

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

        initialize();

        // data freshness initiate refresh data from server
        lpCoreBus.subscribe('lpDataFreshnessRefresh', function(status) {

            // updating accounts dropdown view
            lpAccounts.load(true)
            .then(function(){
                // show 'refresh' message
                lpCoreBus.publish('lpDataFreshnessChanged', status);
            });

            // NOTE: accounts on left navbar is being updated in 'accounts' widget

            // re-init the transactions
            load();
        });
    };
});
