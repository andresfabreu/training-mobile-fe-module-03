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

    module.name = 'module-transactions';

    var base = require('base');
    var core = require('core');
    var tags = require('module-tags');

    var deps = [
        core.name,
        tags.name
    ];

    module.exports = base.createModule(module.name, deps)
        .factory(require('./_migration/transactions-model'))
        .factory(require('./_migration/transactions-chart-model'))
        .directive(require('./_migration/balance-update'))
        .factory(require('./_migration/currency-model'))
        .directive(require('./_migration/category-display'))
        .filter(require('./_migration/category-select'))
        .directive(require('./_migration/category-select-directives'))
        .factory(require('./_migration/category-model'))
        .factory(require('./_migration/p2p-transactions-model'));
});
