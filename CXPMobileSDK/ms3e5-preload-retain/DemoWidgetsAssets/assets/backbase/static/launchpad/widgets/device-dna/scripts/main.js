/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description:
 *  Main File Widget Device DNA
 *  ----------------------------------------------------------------
 */

define( function (require, exports, module) {

    'use strict';

    module.name = 'widget-device-dna';

    var base = require('base');
    var core = require('core');

    var deps = [
        core.name
    ];

    // @ngInject
    function run() {
    }

    module.exports = base.createModule(module.name, deps)
        .directive( require('./directives') )
        .run( run );
});
