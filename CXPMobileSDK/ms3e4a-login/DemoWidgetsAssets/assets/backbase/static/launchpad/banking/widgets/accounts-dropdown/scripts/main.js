define(function(require, exports, module) {
    'use strict';

    module.name = 'widgets-accounts-dropdown';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');
    var accounts = require('module-accounts');

    var deps = [
        core.name,
        ui.name,
        accounts.name
    ];

    // @ngInject
    function run(lpWidget, lpAccounts) {
        lpAccounts.setConfig({
            accountsEndpoint: lpWidget.getPreference('accountsDataSrc'),
            locale: lpWidget.getPreference('locale')
        });
    }

    module.exports = base.createModule(module.name, deps)
        .factory( require('./factories') )
        .factory( require('./model') )
        .controller( require('./controllers') )
        .run( run );
});
