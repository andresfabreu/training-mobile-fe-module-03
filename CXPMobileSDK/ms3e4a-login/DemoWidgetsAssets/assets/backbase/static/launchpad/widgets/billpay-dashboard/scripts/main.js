/**
* TODO add description
*/
define( function (require, exports, module) {

    'use strict';

    module.name = 'billpay-dashboard';

    /**
     * Dependencies
     */
    var base = require('base');
    var core = require('core');
    var ui = require('ui');
    var ebilling = require('module-ebilling');

    var deps = [
        core.name,
        ui.name,
        ebilling.name
    ];

    // @ngInject
    function run() {
    }


    module.exports = base.createModule(module.name, deps)
        .controller(require('./controllers'))
        // .config(require('./config'))
        .service(require('./models'))
        .directive(require('./directives'))
        .run(run);
});
