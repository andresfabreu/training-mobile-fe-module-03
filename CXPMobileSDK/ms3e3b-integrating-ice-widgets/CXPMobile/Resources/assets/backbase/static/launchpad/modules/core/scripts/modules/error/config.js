/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : config.js
 *  Description:
 *  #TODO filter exceptions
 *  #TODO use lpCoreBus to emit some specific errors events
 *  #TODO add method to use custom handler
 *  ----------------------------------------------------------------
 */
define(function(require, exports, module) {
    'use strict';

    // @ngInject
    module.exports = function($provide) {

        // module configuration
        // Decorate the NG exceptionHandler
        $provide.decorator('$exceptionHandler', function($delegate, $injector){
            return function(e, opts) {
                // Handle the exception by name and call the propper service
                //var $log = $injector.get('$log');
                //$log.debug('Default exception handler:', e.name);
                $delegate(e, opts);
            };
        });
    };

});
