
define(function (require, exports, module) {

    'use strict';

    module.name = 'widget-places';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');
    var places = require('module-places');

     var deps = [
        core.name,
        ui.name,
        places.name
    ];

    // @ngInject
    function run(lpWidget) {
        // Widget is Bootstrapped
    }

    module.exports = base.createModule(module.name, deps)
        .controller( require('./controllers') )
        .directive( require('./directives') )
        .run( run );

});
