/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function(widget, AccountsList) {
        var ctrl = this;

        ctrl.user = AccountsList.get();
        ctrl.accounts = ctrl.user.accounts;

        ctrl.viewHistory = function(accountId) {
            gadgets.pubsub.publish('account-details', {accountId: accountId, user: ctrl.user});
        };

        // The widget needs to inform it's done loading so preloading works as expected
        gadgets.pubsub.publish('cxp.item.loaded', {
            id: widget.id
        });
    };
});
