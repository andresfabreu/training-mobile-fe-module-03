/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: Offer users single location to manage and interact with their (finance related) contacts.
 *  ----------------------------------------------------------------
 */
define(function(require, exports, module){

    'use strict';

    module.name = 'widget-addressbook';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');

    //#TODO Move to UI
    //require('launchpad/support/jquery/placeholder');

    var contacts = require('module-contacts');
    var payments = require('module-payments');
    var transactions = require('module-transactions');
    var accounts = require('module-accounts');

    var deps = [
        core.name,
        ui.name,
        contacts.name,
        payments.name,
        accounts.name,
        transactions.name
    ];

    // @ngInject
    function run(lpWidget, lpPayments) {
        lpPayments.setConfig({
            'paymentsEndpoint': lpWidget.getPreference('paymentOrdersDataSrc')
        });
    }

    module.exports = base.createModule(module.name, deps)
        .controller(require('./controllers'))
        .run(run);
});
