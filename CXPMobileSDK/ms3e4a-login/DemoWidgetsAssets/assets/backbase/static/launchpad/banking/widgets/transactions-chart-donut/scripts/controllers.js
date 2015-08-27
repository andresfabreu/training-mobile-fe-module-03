/**
 * Transactions Donut Chart controller
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function(lpCoreBus, lpWidget, $scope, lpAccounts) {

        var ctrl = this;

        var initialize = function() {
             lpAccounts.load()
             .then(function() {
                 if(!lpAccounts.selected && lpAccounts.accounts && lpAccounts.accounts.length > 0) {
                     var selectedAccount = lpAccounts.findByAccountNumber(lpWidget.getPreference('defaultAccount')) || lpAccounts.accounts[0];
                     lpAccounts.selected = selectedAccount;
                 }

                 // now safe to listen for select account messages
                 // lpCoreBus.publish('launchpad-retail.accountSelected', {
                 //     accountId: lpAccounts.selected.id
                 // });

                 // now safe to listen for select account messages
                 lpCoreBus.publish('lpAccounts.loaded', lpAccounts.accounts);
             });
        };

        initialize();

        ctrl.donut = {
            options: {
                animation: lpWidget.getPreference('animation'),
                animationDirection: lpWidget.getPreference('animation-direction')
            }
        };

        // TransactionsChartModel.getData().then(...);
    };
});
