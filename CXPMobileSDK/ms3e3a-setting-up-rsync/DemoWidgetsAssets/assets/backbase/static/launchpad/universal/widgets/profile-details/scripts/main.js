define(function(require, exports, module) {
    'use strict';

    module.name = 'widgets.profile-details';

    var base = require('base');
    var ui = require('ui');
    var core = require('core');


    var deps = [
        core.name,
        ui.name
    ];

    // @ngInject
    function run(lpWidget) {

    }

    module.exports = base.createModule(module.name, deps)
        .controller( require('./controllers') )
        .run( run );
});
