/* eslint-disable */

/**
 * @deprecated will be removed in LP v0.13.x
 * Please use factories/scheduled-date-calculator instead
 */
define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.ScheduledDateCalculator = function(lpCoreUtils) {

        /**
         * Scheduled Date Calculator Constructor
         * @constructor
         */
        var ScheduledDateCalculator = function(config) {
            var self = this;

            self.frequencies = config.frequencies;
        };

        /**
         * Add number of weeks to a specified date
         * @param date
         * @param noOfWeeks
         * @returns {Date}
         */
        ScheduledDateCalculator.prototype.addWeeksToDate = function(date, noOfWeeks) {
            return lpCoreUtils.date(date).add(noOfWeeks, 'weeks').toDate();
        };

        /**
         * Add number of months to a specified date
         * @param date
         * @param noOfMonths
         * @returns {Date}
         */
        ScheduledDateCalculator.prototype.addMonthsToDate = function(date, noOfMonths) {
            return lpCoreUtils.date(date).add(noOfMonths, 'months').toDate();
        };

        /**
         * Add number of years to a specified date
         * @param date
         * @param noOfYears
         * @returns {Date}
         */
        ScheduledDateCalculator.prototype.addYearsToDate = function(date, noOfYears) {
            return lpCoreUtils.date(date).add(noOfYears, 'years').toDate();
        };

        /**
         * Returns a date set at the last day of the month
         * @returns Date
         */
        ScheduledDateCalculator.prototype.getLastDayOfMonth = function() {
            return lpCoreUtils.date().endOf('month').toDate();
        };

        /**
         * Returns a date set to today, if it is the first, or the next first day of a month
         * @returns {Date}
         */
        ScheduledDateCalculator.prototype.getFirstDayOfMonth = function() {
            var date = lpCoreUtils.date();

            //is is the first day of the month?
            if(date.date() !== 1) {
                date.add(1, 'month').startOf('month');
            }

            return date.toDate();
        };

        /**
         * Returns a date set to the next last friday of the month (if the last friday of this month has passed, it will go to the next)
         * @returns {Date}
         */
        ScheduledDateCalculator.prototype.getLastFridayOfMonth = function() {
            var lastDay = lpCoreUtils.date().endOf('month');

            if (lastDay.day() >= 5) {
                lastDay.subtract(lastDay.day() - 5, 'days');
            }
            else {
                lastDay.subtract(lastDay.day() + 2, 'days');
            }

            return lastDay.toDate();
        };

        /**
         * returns provided date with extra months as specified
         * @param date
         * @param monthsToAdd
         * @returns {Date}
         */
        ScheduledDateCalculator.prototype.getLastDayOfMonthPlusTime = function(date, monthsToAdd) {
            return lpCoreUtils.date(date).add(monthsToAdd - 1, 'month').endOf('month').toDate();
        };

        /**
         * Get's the first day of the month
         * @param date
         * @param monthsToAdd
         * @returns {Date}
         */
        ScheduledDateCalculator.prototype.getFirstDayOfMonthPlusTime = function(date, monthsToAdd) {
            var dateCopy = lpCoreUtils.date(date).clone();

            //if start date is first of month (default start date, zero based)
            if(dateCopy.day() === 0) {
                dateCopy.add(monthsToAdd - 1, 'months').startOf('month');
                if(dateCopy.isBefore(date)) {
                    date = dateCopy.add(1, 'months');
                } else {
                    date = dateCopy;
                }
            } else {
                date = lpCoreUtils.date(date).add(monthsToAdd, 'months').startOf('month');
            }

            return date.toDate();
        };


        /**
         * Calculates the next last friday of a month based on the specified number of Months to add
         * @param date
         * @param monthsToAdd
         * @returns {Date}
         */
        ScheduledDateCalculator.prototype.getLastFridayOfMonthPlusTime = function(date, monthsToAdd) {
            var dateCopy = lpCoreUtils.date(date).clone();
            var lastWeekFriday = function(d) {
                return d.subtract(1, 'week').endOf('week').subtract(1, 'days');
            };

            //this month?
            if(dateCopy.endOf('month').day() !== 5) {
                lastWeekFriday(dateCopy);

                if(dateCopy.isBefore(date)) {
                    dateCopy.add(monthsToAdd, 'months');
                } else {
                    dateCopy.add(monthsToAdd - 1, 'months');
                }

                if(dateCopy.endOf('month').day() !== 5) {
                    lastWeekFriday(dateCopy);
                }
            } else {
                dateCopy.add(monthsToAdd - 1, 'months').endOf('month');

                if(dateCopy.day() !== 5) {
                    lastWeekFriday(dateCopy);
                }
            }

            date = dateCopy.toDate();
            return date = dateCopy.toDate();
        };

        /**
         * Calculates the minimum end date
         * @param frequency
         * @param repeatEvery
         * @param date
         * @returns {Date}
         */
        ScheduledDateCalculator.prototype.calculateMinimumEndDate = function(frequency, repeatEvery, date) {
            switch(frequency) {
                case this.frequencies.WEEKLY:
                    date = lpCoreUtils.date(date).add(1 * repeatEvery, 'weeks').toDate();
                    break;
                case this.frequencies.MONTHLY:
                    date = lpCoreUtils.date(date).add(1 * repeatEvery, 'months').toDate();
                    break;
                case this.frequencies.YEARLY:
                    date = lpCoreUtils.date(date).add(1 * repeatEvery, 'years').toDate();
                    break;
                case this.frequencies.LAST_FRIDAY_OF_THE_MONTH:
                    date = this.getLastFridayOfMonthPlusTime(date, 1);
                    break;
                case this.frequencies.START_OF_THE_MONTH:
                    date = this.getFirstDayOfMonthPlusTime(date, 1);
                    break;
                case this.frequencies.END_OF_THE_MONTH:
                    date = this.getLastDayOfMonthPlusTime(date, 1);
                    break;
                default:
                    break;
            }

            return date;
        };

        return {
            getInstance: function(config) {
                return new ScheduledDateCalculator(config);
            }
        };
    }
});
