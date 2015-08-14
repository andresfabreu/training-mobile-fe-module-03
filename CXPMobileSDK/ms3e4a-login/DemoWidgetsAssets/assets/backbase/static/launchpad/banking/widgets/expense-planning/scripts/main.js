define(function (require, exports, module) {

    'use strict';

    module.name = 'widget-expense-planning';

    var base = require('base');
    var ui = require('ui');
    var core = require('core');
    var expenses = require('module-expenses');

    var deps = [
        core.name,
        ui.name,
        expenses.name
    ];

    // @ngInject
    function run() {
        // Widget is Bootstrapped
    }

    module.exports = base.createModule(module.name, deps)
        .directive( require('./directives') ) // todo: componentize
        .controller( require('./controllers') )
        .run( run );
});

