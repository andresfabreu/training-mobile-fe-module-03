/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: module for communication with portal client
 * ----------------------------------------------------------------
 */

define(function (require, exports, module) {
    'use strict';

    module.name = 'core.portal';

    var base = require('base');

    var deps = [
    ];

    // @ngInject
    function run() {

    }

    module.exports = base.createModule(module.name, deps)
        .constant(require('./portal')) // lpPortal
        .run(run);
});
