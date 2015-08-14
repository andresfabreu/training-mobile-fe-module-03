define(function(require, exports, module) {

    'use strict';

    module.name = 'widget-p2p-preferences';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');
    var accounts = require('module-accounts');


    var deps = [
        core.name,
        ui.name,
        accounts.name
    ];

    // @ngInject
    function run() {

    }


    module.exports = base.createModule(module.name, deps)
        .controller( require('./controllers') )
        .run( run );

});
