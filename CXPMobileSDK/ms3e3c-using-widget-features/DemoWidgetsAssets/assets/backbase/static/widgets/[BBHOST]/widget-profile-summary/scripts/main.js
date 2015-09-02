define(function(require, exports, module) {

    'use strict';

    module.name = 'widget-profile-summary';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');
    var users = require('module-users');
    var lastLogin = require('./components/last-login/main');

    var deps = [
        core.name,
        ui.name,
        users.name,
        lastLogin.name
    ];

    // @ngInject
    function run(lpCoreBus) {
        // triggering event that widget was loaded after signing in
        lpCoreBus.publish('launchpad-retail.behaviour', {tag: 'signedin'});
    }

    module.exports = base.createModule(module.name, deps)
        .controller(require('./controllers'))
        .run(run);

});
