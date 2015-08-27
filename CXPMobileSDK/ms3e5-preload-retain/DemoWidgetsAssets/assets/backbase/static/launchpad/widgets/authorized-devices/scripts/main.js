define(function(require, exports, module) {

    'use strict';

    module.name = 'widgets.widget-authorized-devices';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');
    var moduleDevices = require('module-devices');

    var deps = [
        core.name,
        ui.name,
        moduleDevices.name
    ];

    // @ngInject
    function run(lpWidget, lpDevices) {
        lpDevices.setConfig({
            'devicesEndpoint': lpWidget.getPreference('devicesEndpoint'),
            'revokeEndpoint': lpWidget.getPreference('revokeEndpoint')
        });
    }

    module.exports = base.createModule(module.name, deps)
        .controller(require('./controllers'))
        .run(run);

});
