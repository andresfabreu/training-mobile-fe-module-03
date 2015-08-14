/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: ${widget.description}
 *  ----------------------------------------------------------------
 */

define(function (require, exports, module) {
console.time('fuuu')
    'use strict';

    module.name = 'widget-accounts';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');

    var accounts = require('module-accounts');
    var transactions = require('module-transactions');

    var deps = [
        core.name,
        ui.name,
        accounts.name,
        transactions.name
    ];

    // @ngInject
    function run(widget) {
        console.timeEnd('fuuu')
        gadgets.pubsub.publish('cxp.item.loaded', {
            id: widget.model.name
        });
    }

    module.exports = base.createModule(module.name, deps)
        .controller(require('./controllers'))
        .run(run);
});
