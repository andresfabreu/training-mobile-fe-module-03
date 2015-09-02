/*global define */
define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var core = require('core');

    var regex = require('./regex');

    module.name = 'ui.smartsuggest-engine-util-dates-advanced';

    module.exports = base.createModule(module.name, [
        core.name
    ]);

    // @ngInject
    var datesAdvancedFactory = function () {
        var methods = {};
        //var DAYS_MAX = 31;
        // var MONTHS_MAX = 12;
        var DATE_PATTERN_SYMBOL = '-';
        var YEAR_MAX = new Date().getFullYear();
        // var datePatternMax = [DAYS_MAX, MONTHS_MAX, YEAR_MAX];
        var dateRegex = regex.dateRegex;

        /**
         * Entry point: returns collection of dates based on analysis
         * ----------------------------------------------------------
         *
         * @param term1
         * @param term2
         * @returns {Array}
         */
        methods.getDatesArray = function(term1, term2) {

            // check if only one input param provided
            if (term1 && !term2) {
                return methods.getDatesSingleTerm(term1);
            }

            // default response
            return [];
        };

        /**
         * Get dates object in case we get only one input parameter
         *
         * @param term
         * @returns {Array}
         */
        methods.getDatesSingleTerm = function(term) {
            var month, res = [];

            // not a pattern -- checking for month names
            if (!methods.isDatePattern(term)) {

                // check one month period (current year or previous)
                month = methods.getMonthNumber(term);

                if (month) {
                    // month for Date object starts with 0, not 1 :(
                    month -= 1;

                    // current year (only if the month is current or already passed)
                    if (month <= (new Date()).getMonth()) {
                        res.push({
                            from: new Date(YEAR_MAX, month, 1),
                            to: new Date(YEAR_MAX, month, methods.daysInMonth(month, YEAR_MAX), 23, 59)
                        });
                    }

                    // previous year
                    res.push({
                        from: new Date(YEAR_MAX - 1, month, 1),
                        to: new Date(YEAR_MAX - 1, month, methods.daysInMonth(month, YEAR_MAX - 1), 23, 59)
                    });
                }

            }
            // else {
                // TODO: handle date pattern like dd-mm-yyyy
            // }

            return res;
        };

        /**
         * Check for date patterns like dd-mm-yyyy in input string
         *
         * @param term
         * @returns {*}
         */
        methods.isDatePattern = function(term) {
            var res = term.split(DATE_PATTERN_SYMBOL);
            if (res.length < 2) {
                // no pattern found
                return false;
            } else {
                return res;
            }
        };

        /**
         * HELPER: Get Month number
         *
         * @param term
         * @returns {*}
         */
        methods.getMonthNumber = function(term) {
            var month = term.match(dateRegex.jan) ? 1 :
                        term.match(dateRegex.feb) ? 2 :
                        term.match(dateRegex.mar) ? 3 :
                        term.match(dateRegex.apr) ? 4 :
                        term.match(dateRegex.may) ? 5 :
                        term.match(dateRegex.jun) ? 6 :
                        term.match(dateRegex.jul) ? 7 :
                        term.match(dateRegex.aug) ? 8 :
                        term.match(dateRegex.sep) ? 9 :
                        term.match(dateRegex.oct) ? 10 :
                        term.match(dateRegex.nov) ? 11 :
                        term.match(dateRegex.dec) ? 12 : false;

            return month;
        };

        /**
         * HELPER: returns number of days in particular month of the specific year
         *
         * @param month
         * @param year
         * @returns {number}
         */
        methods.daysInMonth = function(month, year) {
            return 32 - new Date(year, month, 32).getDate();
        };

        return methods;
    };

    module.exports.factory('SmartSuggestEngineUtilDatesAdvanced', datesAdvancedFactory);
});
