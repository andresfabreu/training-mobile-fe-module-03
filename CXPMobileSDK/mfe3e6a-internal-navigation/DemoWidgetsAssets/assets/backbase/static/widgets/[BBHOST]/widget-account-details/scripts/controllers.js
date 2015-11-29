/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function(widget, TransactionHistory, $scope) {
        var ctrl = this; //self this controller

        ctrl.currentUser = null;
        ctrl.currentAccount = null;
        ctrl.transactions = null;

        gadgets.pubsub.subscribe('account-details', function(data) {
            // console.log('ACCOUNT INFO', data);
            ctrl.currentUser = data.user || {};

            ctrl.currentUser.accounts.forEach(function(acc) {
                if(acc.accountId === data.accountId) {
                    ctrl.currentAccount = acc;
                }
            });

            if(ctrl.currentAccount.accountId) {
                ctrl.transactions = TransactionHistory.get(ctrl.currentAccount.accountId);
            }

            $scope.$apply();
        });

        // The widget needs to inform it's done loading so preloading works as expected
        gadgets.pubsub.publish('cxp.item.loaded', {
            id: widget.id
        });
    };
});
