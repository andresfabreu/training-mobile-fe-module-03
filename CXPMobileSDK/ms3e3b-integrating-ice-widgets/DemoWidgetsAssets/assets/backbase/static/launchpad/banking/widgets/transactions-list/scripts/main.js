/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: Widget Transactions List
 *  ----------------------------------------------------------------
 */

define( function (require, exports, module) {

    'use strict';

    module.name = 'transactions-list';

    var base = require('base');
    var core = require('core');
    var transactions = require('module-transactions-2');
    var accounts = require('module-accounts');

    var deps = [
        core.name,
        transactions.name,
        accounts.name
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
