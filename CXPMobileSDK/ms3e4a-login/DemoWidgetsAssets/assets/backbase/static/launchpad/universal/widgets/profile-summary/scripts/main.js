/*global b$, gadgets */
define(function(require, exports, module) {

    'use strict';

    module.name = 'widget-profile-summary';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');
    var users = require('module-users');

    var deps = [
        core.name,
        ui.name,
        users.name
    ];

    // @ngInject
    function run( lpWidget ) {

        // triggering event that widget was loaded after signing in
        gadgets.pubsub.publish('launchpad-retail.behavior', {tag: "signedin"})
    }

    module.exports = base.createModule(module.name, deps)
        .controller( require('./controllers') )
        .run(run);

});
