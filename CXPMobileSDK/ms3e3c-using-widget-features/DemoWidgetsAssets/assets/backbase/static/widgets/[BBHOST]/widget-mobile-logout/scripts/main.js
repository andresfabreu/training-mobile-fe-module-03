define(function(require, exports, module) {
    'use strict';

    module.name = 'widgets-logout';

    var base = require('base');
    var ui = require('ui');
    var core = require('core');

    var deps = [
        core.name,
        ui.name
    ];

    function run() {

    }

    module.exports = base.createModule(module.name, deps)
        .controller( require('./controllers') )
        .run( run );
});