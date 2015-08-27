/**
 * @module ebill-connect
 * @version 1.0.0
 * @file ebill-connect description
 * @copyright Backbase Amsterdam
 * @requires module:lp/main
 * @requires module:lp/modules/core
 * @requires interact
 *
 * @example Require Widget
 * // add this in the index.html
 * window.requireWidget( __WIDGET__ ,'widgets/ebill-connect');
 */

define( function (require, exports, module) {

    'use strict';

    module.name = 'widget-ebill-add';

    /**
     * Dependencies
     */
    var base = require('base');
    var core = require('core');
    var ui = require('ui');

    var payments = require('module-payments');
    var accounts = require('module-accounts');
    var ebilling = require('module-ebilling');

    var deps = [
        core.name,
        ui.name,
        payments.name,
        accounts.name,
        ebilling.name
    ];

    // @ngInject
    function run() {
    }

    module.exports = base.createModule(module.name, deps)
        .controller(require('./controllers'))
        .service(require('./models'))
        .directive(require('./directives'))
        .run(run);
});
