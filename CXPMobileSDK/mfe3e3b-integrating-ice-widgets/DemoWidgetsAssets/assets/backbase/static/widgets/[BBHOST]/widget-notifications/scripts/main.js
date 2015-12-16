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
    function run(lpCoreBus, lpWidget) {

        // Let CXP know that widget is done loading
        if (lpWidget.model && lpWidget.model.name) {
            lpCoreBus.publish('cxp.item.loaded', {id: lpWidget.model.name});
        }

        // Start listening to system notification
        base.notification.network();
    }

    module.exports = base.createModule(module.name, deps)
        .constant( require('./constants') )
        .controller( require('./controllers') )
        .factory( require('./factories') )
        .directive( require('./directives') )
        .run( run );
});
