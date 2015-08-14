define(function(require, exports, module) {

    'use strict';

    module.name = 'widget-ebill-history';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');
    var ebilling = require('module-ebilling');

    var deps = [
        core.name,
        ui.name,
        ebilling.name
    ];

    // @ngInject
    var run = function( lpWidget, lpEbilling, lpCoreUtils ) {
         lpEbilling.setConfig({
            // Overwrite Provider Options
            debitOrdersSrc: lpWidget.getPreference('debitOrdersSrc'),
            mandatesSrc: lpWidget.getPreference('mandatesSrc'),
            baseUrl: lpCoreUtils.getWidgetBaseUrl(lpWidget),
            locale: lpWidget.getPreference('locale'),
            templates: {
                'e-bill-list-details': '/templates/details.ng.html'
            }
        });
    };

    module.exports = base.createModule(module.name, deps )
        .controller(require('./controllers'))
        .run(run);

});
