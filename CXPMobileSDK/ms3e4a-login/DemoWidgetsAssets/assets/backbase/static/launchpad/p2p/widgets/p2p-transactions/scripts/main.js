define(function(require, exports, module) {
    'use strict';

    module.name = 'widget-p2p-transactions';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');
    var contacts = require('module-contacts');
    var transactions = require('module-transactions');

    var deps = [
        core.name,
        ui.name,
        contacts.name,
        transactions.name
    ];

    // @ngInject
    function run() {

    }

    module.exports = base.createModule(module.name, deps)
        .controller( require('./controllers') )
        .run( run );
});
