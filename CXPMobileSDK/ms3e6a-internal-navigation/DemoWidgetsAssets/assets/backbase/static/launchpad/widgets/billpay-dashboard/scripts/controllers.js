 /* globals define */

/**
 * Controllers
 * @module controllers
 */
define(function(require, exports) {

    'use strict';

    var _ = require('base').utils;

    /**
     * MainCtrl description.
     */

    // @ngInject
    exports.MainCtrl = function() {

    };

    // @ngInject
    exports.PayeeListCtrl = function(PayeeModel, PayeeService, CalendarService) {

        var ctrl = this;

        // Prepares payee list for UI representation
        var filterPayees = function(payees) {
            ctrl.ebillPayees = {};
            ctrl.othPayees = [];

            _.forEach(payees, function(value, key) {
                if (value.eBillsStatus === 'ACTIVE') {
                    var dueDate = CalendarService.formatDate(value.eBill.dueDate, 'MMM dd');
                    if (ctrl.ebillPayees[dueDate]) {
                        ctrl.ebillPayees[dueDate].push(value);
                    } else {
                        ctrl.ebillPayees[dueDate] = [value];
                    }
                } else {
                    ctrl.othPayees.push(value);
                }
            });
        };

        ctrl.fetchPayees = function() {
            ctrl.isLoading = true;
            PayeeService.fetchPayees().then(function(response) {
                ctrl.payees = response.data.payees;
                filterPayees(ctrl.payees);
                ctrl.isLoading = false;
            });
        };

        ctrl.fetchAccounts = function() {
            PayeeService.fetchAccounts().then(function(results) {
                PayeeModel.accounts = results;
            });
        };

        ctrl.fetchFrequencies = function() {
            PayeeService.fetchFrequencies().then(function(results) {
                PayeeModel.frequencies = results;
            });
        };
        /**
         * Initialize method
         */
        ctrl.init = function() {
            ctrl.payees = [];
            ctrl.fetchPayees();
            ctrl.fetchAccounts();
            ctrl.fetchFrequencies();
        };

    };
});
