/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function(widget, AccountsList) {
        var ctrl = this;

        ctrl.accounts = AccountsList.get().accounts;

        ctrl.viewHistory = function(accountId) {
            gadgets.pubsub.publish('account-details');
        };

        // The widget needs to inform it's done loading so preloading works as expected
        gadgets.pubsub.publish('cxp.item.loaded', {
            id: widget.model.name
        });
    };
});
