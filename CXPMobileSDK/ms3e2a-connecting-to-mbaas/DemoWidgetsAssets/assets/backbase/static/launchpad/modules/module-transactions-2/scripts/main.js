/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description:
 *  Main File Module Transactions
 *  ----------------------------------------------------------------
 */

define(function (require, exports, module) {

    'use strict';

    module.name = 'module-transactions-3';

    var base = require('base');
    var core = require('core');
    var tags = require('module-tags');

    // Custom components
    var categories = require('./components/transactions-categories/scripts/main');
    var p2p = require('./components/transactions-p2p/scripts/main');
    var currency = require('./components/transactions-currency/scripts/main');

    var deps = [
        core.name,
        tags.name,
        categories.name,
        p2p.name,
        currency.name
    ];

    module.exports = base.createModule(module.name, deps)
        .provider( require('./providers') )
        .directive( require('./directives') );
});
