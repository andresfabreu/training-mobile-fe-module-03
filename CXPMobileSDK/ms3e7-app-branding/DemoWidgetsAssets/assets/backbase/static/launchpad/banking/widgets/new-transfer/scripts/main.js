define(function(require, exports, module) {
    'use strict';

    module.name = 'widgets-new-transfer';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');
    var accounts = require('module-accounts');
    var contacts = require('module-contacts');
    var payments = require('module-payments');
    var transactions = require('module-transactions');

    var deps = [
        core.name,
        ui.name,
        accounts.name,
        payments.name,
        transactions.name,
        contacts.name
    ];

    // @ngInject
    function run(lpWidget, lpPayments) {
        lpPayments.setConfig({
            'paymentsEndpoint': lpWidget.getPreference('paymentOrdersDataSrc')
        });
    }

    module.exports = base.createModule(module.name, deps)
        .controller( require('./controllers') )
        .directive( require('./directives') )
        .run( run );
});
