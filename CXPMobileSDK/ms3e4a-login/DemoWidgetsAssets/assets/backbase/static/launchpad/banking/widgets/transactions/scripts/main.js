define(function(require, exports, module) {
    'use strict';

    module.name = 'widgets-transactions-3';

    var base = require('base');
    var ui = require('ui');
    var core = require('core');

    var accounts = require('module-accounts');
    var transactions = require('module-transactions-2');
    var contacts = require('module-contacts');
    var freshness = require('module-freshness');

    var deps = [
        core.name,
        ui.name,
        accounts.name,
        transactions.name,
        contacts.name,
        freshness.name
    ];

    // @ngInject
    function run(lpWidget, lpTransactionsCategory, lpAccounts, lpTransactions) {
        lpTransactionsCategory.setConfig({
            'endpoint': lpWidget.getPreference('categoryDataSrc')
        });

        lpAccounts.setConfig({
            'accountsEndpoint': lpWidget.getPreference('accountsDataSrc')
        });

        lpTransactions.setConfig({
            'transactionsEndpoint': lpWidget.getPreference('transactionsDataSrc'),
            'transactionDetailsEndpoint': lpWidget.getPreference('transactionDetailsDataSrc'),
            'pageSize': parseInt(lpWidget.getPreference('transactionsPageSize'), 10) || undefined
        });
    }

    module.exports = base.createModule(module.name, deps)
        .controller( require('./controllers') )
        .run( run );
});
