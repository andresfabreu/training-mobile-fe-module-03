/*global bd*/

/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: Copy of out of the box navigation, with a few tweaks
 *  ----------------------------------------------------------------
 */

define( function (require, exports, module) {

    'use strict';

    module.name = 'widget-navfooter';

    var base = require('base');
    var core = require('core');
    var NavFooter = require('./navfooter');


    var deps = [
        core.name
    ];

    // @ngInject
    function run(lpWidget) {
        var widgetWrapper = new NavFooter(lpWidget);
        return widgetWrapper.init();
    }

    module.exports = base.createModule(module.name, deps)
        .run( run );

});
