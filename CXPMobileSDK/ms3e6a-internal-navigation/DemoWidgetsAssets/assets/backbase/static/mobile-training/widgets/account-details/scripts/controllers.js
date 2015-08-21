/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function(widget) {
        var ctrl = this; //self this controller

        // The widget needs to inform it's done loading so preloading works as expected
        gadgets.pubsub.publish('cxp.item.loaded', {
            id: widget.model.name
        });
    };
});
