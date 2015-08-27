define(function(require, exports, module) {
    'use strict';

    module.name = 'widget-p2p-tab';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');

    var deps = [
        core.name,
        ui.name
    ];

    // @njInject
    function run() {

    }

    module.exports = base.createModule(module.name, deps)
        .controller( require('./controllers') )
        .run( run );

});
