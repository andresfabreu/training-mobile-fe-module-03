/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: Error Handler main Module
 *  ----------------------------------------------------------------
 */
define(function (require, exports, module) {

    'use strict';

    module.name = 'error';

    var base = require('base');

    var deps = [
        // no dependencies
    ];

    /*----------------------------------------------------------------*/
    /* Export
    /*----------------------------------------------------------------*/
    module.exports = base.createModule(module.name, deps)
        .config(require('./config'))
        .factory(require('./handler'));
});
