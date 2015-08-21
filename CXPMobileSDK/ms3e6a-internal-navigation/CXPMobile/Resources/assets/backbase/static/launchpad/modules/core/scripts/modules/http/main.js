/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: Main lpCoreHttp module
 *  ----------------------------------------------------------------
 */

define(function(require, exports, module) {
    'use strict';

    module.name = 'http';

    var base = require('base');
    // 3rd Party
    // Add angular ressources after base
    require('angular-resource');

    // module dependencies
    var deps = [
        'ngResource'
    ];

    /*----------------------------------------------------------------*/
    /* Export
    /*----------------------------------------------------------------*/
    module.exports = base.createModule(module.name, deps)
        .config(require('./config'))
        .factory(require('./httpInterceptor'));
});
