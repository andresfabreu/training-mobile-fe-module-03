
define(function(require, exports, module) {
    'use strict';

    module.name = 'widget-profile-portfolio';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');

    var deps = [
        core.name,
        ui.name
    ];

    // @ngInject
    function run (lpWidget) {

    }

    module.exports = base.createModule(module.name, deps)
        .service( require('./services') )
        .controller( require('./controllers') )
        .run( run );

});
