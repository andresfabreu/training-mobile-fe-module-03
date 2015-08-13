/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Filename : main.js
 *  Description: Simple currency converter
 *  ----------------------------------------------------------------
 */
define( function (require, exports, module) {

    'use strict';

    module.name = 'performance';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');

    var deps = [
        core.name,
        ui.name
    ];

    /**
    * @ngInject
    */
    function run(lpCoreBus, lpWidget, WIDGET_NAME) {
        
        // Widget is Bootstrapped
        lpCoreBus.publish(WIDGET_NAME + ':ready');
         gadgets.pubsub.publish ('cxp.item.loaded', WIDGET_NAME);
    }

    module.exports = base.createModule(module.name, deps)
        .constant( 'WIDGET_NAME', module.name )
        .controller( require('./controllers') )
        .run( run );
       
});

