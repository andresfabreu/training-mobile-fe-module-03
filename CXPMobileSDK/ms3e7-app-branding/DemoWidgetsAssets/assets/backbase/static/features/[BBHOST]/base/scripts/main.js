/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: Base library for creating Launchpad components/widgets/modules
 *  ----------------------------------------------------------------
 */
define(function(require, exports, module) {

    'use strict';

    var config = require('./config'); /// Launchpad configuration
    var NS = config.NS;
    var global = window;

    exports.NS = global[NS] = global[NS] || {};

    /*----------------------------------------------------------------*/
    /* 3rd parties
    /*----------------------------------------------------------------*/
    require('angular');// angular from window, it doesn't export
    // export angular
    exports.ng = window.angular;
    // @todo export $.noConflict();
    exports.$ = require('jquery');

    /*----------------------------------------------------------------*/
    /* Modules
    /*----------------------------------------------------------------*/
    exports.utils = require('./modules/utils/main'); // lodash + custom utils;
    exports.bus = require('./modules/bus/bus');
    exports.Promise = require('./modules/async/Promise');
    exports.fetch = require('./modules/async/fetch');
    exports.log = require('./modules/log/loglevel');
    exports.error = require('./modules/error/handler');

   /*----------------------------------------------------------------*/
   /* Extensions
   /*----------------------------------------------------------------*/
    require('./modules/b$-extension/backbase-widget'); // b$ Extensions, it doesn't export
    exports.widget = require('./modules/widget/widget');
    exports.portal = require('./modules/portal/portal');

    /*----------------------------------------------------------------*/
    /* Public utility libraries
    /*----------------------------------------------------------------*/
    exports.startPortal = require('./libs/start-portal');
    exports.getWidgetsInfo = require('./libs/get-widgets-info');
    exports.createModule = require('./libs/create-module');

    /*----------------------------------------------------------------*/
    /* Helpers
    /*----------------------------------------------------------------*/

    exports.requireWidget = global.requireWidget || require('./require-widget');

     /**
     * Angular Boostrap alias
     * @param  {HTMLElement} el   DOM element
     * @param  {Array} deps angular dependencies
     * @return {object}
     */
    exports.bootstrap = function(el, deps) {
        return exports.ng.bootstrap(el, deps);
    };
    /**
     * Angular DI helper
     * @param  {string} lib    Recuired library
     * @param  {string} moduleName Module name default is ng
     * @example
     * <pre>
     *    var utils = base.inject('lpCoreUtils', require('core').name);
     *    var fetch = base.inject('$http');
     * </pre>
     * @return {object}        Recuired library
     */
    exports.inject = function(lib, moduleName) {
        var deps = ['ng'];
        if(!exports.utils.isEmpty(moduleName)){
            // get angular default module
            deps.push(moduleName);
        }
        return exports.ng.injector(deps).get(lib);
    };
});
