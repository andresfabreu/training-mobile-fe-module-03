define(function (require, exports, module) {
    'use strict';

    module.name = 'widget-portfolio-minimap';

    var base = require('base');
    var ui = require('ui');
    var wealth = require('module-wealth');

    var deps = [
        ui.name,
        wealth.name
    ];

    // @ngInject
    function run(lpWidget, lpWealth) {
        lpWealth.setConfig({
            portfolioEndPoint: lpWidget.getPreference('dataSrc')
        });
    }

    module.exports = base.createModule(module.name, deps)
        .controller(require('./controllers'))
        .directive(require('./directives'))
        .run(run);
});
