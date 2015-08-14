define(function(require, exports, module) {
    'use strict';

    module.name = 'widget-card-overview';

    var base = require('base');
    var ui = require('ui');
    var core = require('core');
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
        .directive( require('./directives') )
        .run( run );

});
