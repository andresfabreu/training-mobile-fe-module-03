/**
 * Retrieves a list of expenses from the server and maintains their state
 * @author Eric.Lin
 * @copyright Backbase B.V, 2013
 * @module expenses-model
 * @exports ExpensesModel
 */
define( function (require, exports, module) {
    'use strict';

    var ng = require('base').ng;
    var utils = require('base').utils;

    // @ngInject
    exports.ExpensesModel = function(httpService) {
        var frequenciesEnum = {
            START_OF_THE_MONTH: 'First of the month',
            END_OF_THE_MONTH: 'End of the month',
            LAST_FRIDAY_OF_THE_MONTH: 'Last Friday of the month',
            WEEKLY: 'Weekly',
            MONTHLY: 'Monthly',
            YEARLY: 'Yearly'
        };

        var weeklyEnum = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        var monthlyEnum = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        /**
         * Expenses service constructor
         * @param config
         * @alias ExpensesModel
         * @constructor
         */
        var ExpensesModel = function(config) {

            this.expensesEndpoint = config.expensesEndpoint;
            this.expensesDetailsEndpoint = config.expensesDetailsEndpoint;
            this.expenses = {};
            this.expenseDetails = {};
        };

        /**
         * Customize getISOString to yyyy-mm-dd formate
         *
         */
        var getISOStringCus = function(date) {
            var d = ng.copy(date);
            d.setHours(0, -d.getTimezoneOffset(), 0, 0);
            return d.toISOString().split('T')[0];
        };

        /**
         * Loads a new set of expenses
         */
        ExpensesModel.prototype.loadExpenses = function(startDate, endDate) {
            var endpoint = this.expensesEndpoint + '?startDate=' + getISOStringCus(startDate) + '&endDate=' + getISOStringCus(endDate);
            var expensesListService = httpService.getInstance({
                    endpoint: endpoint
                });

            var self = this;
            var xhr = expensesListService.read();
            self.loading = true;

            xhr.then(function(response) {
                if (response && response.data !== 'null') {
                    self.preprocessExpenses(response.data);
                }

            },
            function(response) {
                self.error = {
                    code: response.status,
                    message: response.statusText
                };
            })['finally'](function() {
                self.loading = false;
            });

            return xhr;
        };

        /**
         * Enriches data with presentation logic
         * @param expenses
         * @returns {*}
         */
        ExpensesModel.prototype.preprocessExpenses = function(expenses) {
            if(expenses.length < 1) {
                return;
            }
            for (var i = expenses.length - 1; i >= 0; i--) {
                var payment = expenses[i];
                if (!this.expenses[payment.date]) {
                    this.expenses[payment.date] = {
                        'currency': '',
                        'payments': [],
                        'total': 0
                    };
                }
                this.expenses[payment.date].payments.push(payment);
                this.expenses[payment.date].total += payment.amount;
                this.expenses[payment.date].currency = payment.currency;
            }
        };

        /**
         * Find payment by date
         * @param date
         * @returns {Array}
         */
        ExpensesModel.prototype.findByDate = function(obj) {
            var expensesList = {}, key, self = this,
                day, date,
                process = function(d) {
                    key = getISOStringCus(d);
                    if (self.expenses[key]) {
                        expensesList[key] = self.expenses[key];
                    }
                };
            if (obj instanceof Array) {
                for (var i = obj.length - 1; i >= 0; i--) {
                    day = obj[i];
                    date = new Date(day.year, day.month - 1, day.date);
                    process(date);
                }
            } else {
                process(obj);
            }

            return JSON.stringify(expensesList) === '{}' ? null : expensesList;
        };

        /**
         * Enriches data with presentation logic
         * @param expenses
         * @returns {*}
         */
        ExpensesModel.prototype.loadExpensesDetails = function(payment) {
            if(!payment.details || utils.isEmpty(payment.details)) {
                var expensesDetailsService = httpService.getInstance({
                    endpoint: this.expensesDetailsEndpoint + '/' + payment.paymentOrderId
                });

                var self = this;
                var xhr = expensesDetailsService.read();
                self.loading = true;

                xhr.then(function(response) {
                    if (response && response.data !== 'null') {
                        self.preprocessExpensesDetails(response.data, payment);
                    }
                }, function(response) {
                    payment.errorCode = response.status || 500;
                })['finally'](function() {
                    self.loading = false;
                    payment.displayDetails = payment.displayDetails ? false : true;
                });

                return xhr;
            }
            payment.displayDetails = payment.displayDetails ? false : true;
        };

        /**
         * Enriches/updates data ready for view rendering
         * @param expenses
         * @returns {*}
         */
        ExpensesModel.prototype.preprocessExpensesDetails = function(details, payment) {
            var newDetail = {};
            if(details) {
                newDetail = ng.copy(details);
                if(details.schedule){
                    var frequency = details.schedule.frequency;
                    newDetail.schedule.frequency = frequenciesEnum[frequency];
                    if(details.schedule.intervals && details.schedule.intervals.length > 0) {
                        var intervals = details.schedule.intervals.split(',');
                        if(frequency === 'WEEKLY' || frequency === 'YEARLY') {
                            var mapping = frequency === 'WEEKLY' ? weeklyEnum : monthlyEnum;
                            newDetail.schedule.intervals = '';
                            for (var i = 0; i < intervals.length; i++) {
                                var lable = mapping[parseInt(intervals[i], 10) - 1] + ', ';
                                newDetail.schedule.intervals = newDetail.schedule.intervals + lable;
                            }
                            if(newDetail.schedule.intervals) {
                                newDetail.schedule.intervals = newDetail.schedule.intervals.substring(0, newDetail.schedule.intervals.length - 2);
                            }
                        }
                    } else {
                        newDetail.schedule.intervals = null;
                    }
                }
            }
            payment.details = newDetail;
        };

        return {
            getInstance: function(config) {
                return new ExpensesModel(config);
            }
        };
    };
});
