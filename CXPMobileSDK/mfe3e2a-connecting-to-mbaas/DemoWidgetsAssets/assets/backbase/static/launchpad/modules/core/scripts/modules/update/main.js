/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: Update widgets' models depending on outer actions
 * ----------------------------------------------------------------
 */
define(function (require, exports, module) {
    'use strict';

    module.name = 'core.update';

    var base = require('base');
    // core modules
    var utils = require('../utils/main');

    var deps = [
        utils.name
    ];

    module.exports = base.createModule(module.name, deps)
        .provider(require('./providers'));
});
