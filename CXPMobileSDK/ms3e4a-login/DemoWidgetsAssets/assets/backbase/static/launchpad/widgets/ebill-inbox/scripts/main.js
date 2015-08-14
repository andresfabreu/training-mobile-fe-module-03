
define(function(require, exports, module) {

    'use strict';

    module.name = 'widget-ebill-inbox';

    // main
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


        var params = {
            // Overwrite Provider Options
            debitOrdersSrc: lpWidget.getPreference('debitOrdersSrc'),
            mandatesSrc: lpWidget.getPreference('mandatesSrc'),
            accountsEndPoint: lpWidget.getPreference('accountsDataSrc'),
            baseUrl: lpCoreUtils.getWidgetBaseUrl( lpWidget ),
            templates: {
                'e-bill-list-details': '/templates/details.ng.html',
                'e-bill-list-newbills-details': '/templates/newbills-details.ng.html',
                'e-bill-list-payment': '/templates/payment.ng.html'
            }
        };
        lpEbilling.setConfig(params);
    };

    module.exports = base.createModule(module.name, deps )
        .controller(require('./controllers'))
        .run(run);

});
