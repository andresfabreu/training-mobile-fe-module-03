/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: Bus module
 *  ----------------------------------------------------------------
 */

define(function(require, exports, module) {
    'use strict';

    module.name = 'bus';
    var base = require('base');
    var deps = [];

    /*----------------------------------------------------------------*/
    /* Export
    /*----------------------------------------------------------------*/
    module.exports = base.createModule(module.name, deps)
        .provider(require('./provider'));
});
