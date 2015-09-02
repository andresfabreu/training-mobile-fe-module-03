define(function(require, exports, module) {
    'use strict';

    module.name = 'widget-notifications';
    var base = require('base');
    var core = require('core');
    var ui = require('ui');


    var deps = [
        core.name,
        ui.name
    ];

    // @ngInject
    function run ( lpWidget ) {
        // run widget
    }

    module.exports = base.createModule(module.name, deps)
        .constant( require('./constants') )
        .controller( require('./controllers') )
        .factory( require('./factories') )
        .directive( require('./directives') )
        .run( run );
});
