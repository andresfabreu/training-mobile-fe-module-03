/*global define */
define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var core = require('core');
    var datesAdvanced = require('./dates-advanced');

    var regex = require('./regex');

    module.name = 'ui.smartsuggest-engine-util';

    module.exports = base.createModule(module.name, [
        core.name,
        datesAdvanced.name
    ]);

    // @ngInject
    var utilFactory = function (lpCoreUtils, SmartSuggestEngineUtilDatesAdvanced) {
        var util = {};

        var RANGE_REGEX = regex['RANGE_REGEX'];
        var NUMBER_REGEX = regex['NUMBER_REGEX'];
        //var STRIP_ACC_FORMATTING_REGEX = regex['STRIP_ACC_FORMATTING_REGEX'];

        /***
         *
         * @param term
         * @returns {boolean}
         */
        util.isRange = function (term) {
            return RANGE_REGEX.test(term);
        };

        /**
         * Special number parser for amounts
         * @param toParse
         * @returns {null}
         */
        util.parseAmount = function (toParse) {

            var num = null;
            if(toParse) {
                var parseResult = toParse.match(NUMBER_REGEX);
                if(parseResult && parseResult.length) {
                    num = parseFloat(parseResult[0]);
                }
            }

            return !isNaN(num) ? Math.abs(num) : null;
        };

        /**
         * Return false if if the date is not a 4 digit numeric value between 1900 and 2100
         * otherwise returns the parsed year
         * @param toParse
         * @returns {*}
         */
        util.isYearDate = function (toParse) {
            var year = util.parseAmount(toParse);
            return !isNaN(year) && year > 1900 && year < 2100 ? year : false;
        };

        /**
         * Parses a date, with special rules for auto suggestions
         * @param toParse
         * @returns {*}
         */
        util.parseDate = function (toParse) {
            var parsedDate;
            var year = util.isYearDate(toParse);
            var number = parseFloat(toParse);
            if(year) {
                parsedDate = new Date(year, 0, 1);
            } else if(number <= 31) {
                parsedDate = new Date(new Date().setDate(number));
            } else {
                parsedDate = null;
            }
            return parsedDate;
        };

        /**
         * Get collection of dates based on advanced analysis
         *
         * @param term1
         * @param term2
         * @returns {Array}
         */
        util.getAdvancedDatesArray = function (term1, term2) {
            return SmartSuggestEngineUtilDatesAdvanced.getDatesArray(term1, term2);
        };

        /**
         *
         * @param term
         * @returns {*}
         */
        util.getDateTermSpecificity = function (term) {

            var specificity;
            var regexPatterns = regex.dateRegex;

            //add year
            var year = util.isYearDate(term);

            //add a month
            var month =
                !year &&
                (term.match(regexPatterns.jan) ||
                term.match(regexPatterns.feb) ||
                term.match(regexPatterns.mar) ||
                term.match(regexPatterns.apr) ||
                term.match(regexPatterns.may) ||
                term.match(regexPatterns.jun) ||
                term.match(regexPatterns.jul) ||
                term.match(regexPatterns.aug) ||
                term.match(regexPatterns.sep) ||
                term.match(regexPatterns.oct) ||
                term.match(regexPatterns.nov) ||
                term.match(regexPatterns.dec) !== null);

            if(year) {
                specificity = 'year';
            } else if(month) {
                specificity = 'month';
            } else {
                specificity = 'day';
            }

            return specificity;
        };

        /**
         * Makes a date, inclusive specific to milliseconds.
         * E.g. Thursday will be converted to 1 millisecond before midnight Friday
         * @param term
         * @param date
         * @returns {*}
         */
        util.makeToDateInclusive = function (term, date) {

            var dateSpecificity = util.getDateTermSpecificity(term);

            var timeToAdd;
            if(dateSpecificity === 'year') {
                timeToAdd = { years: 1 };
            } else if(dateSpecificity === 'month') {
                timeToAdd = { months: 1 };
            } else {
                timeToAdd = { days: 1 };
            }
            // migrate to momentjs
            var inclusiveDate = lpCoreUtils.date(date).clone().add(timeToAdd).subtract(1, 'ms');

            return inclusiveDate.toDate();
        };

        /**
         * Util for suggesting a to amount if a user types a single amount
         * @param from
         * @returns {number}
         */
        util.predictToDate = function (term, from) {

            var dateSpecificity = util.getDateTermSpecificity(term);

            var timeToAdd;
            if(dateSpecificity === 'year') {
                timeToAdd = { years: 1 };
            } else if(dateSpecificity === 'month') {
                timeToAdd = { months: 1 };
            } else {
                timeToAdd = { weeks: 1 };
            }

            var predictedDate = lpCoreUtils.date(from).clone().add(timeToAdd).subtract(1, 'ms');

            return predictedDate.toDate();
        };

        /**
         * Util for creating a fuzzy range search from a single amount
         * @param from
         * @returns {{from: number, to: number}}
         */
        util.makeNumberFuzzy = function (from) {

            var deviation = (from / 10) / 2;
            var fuzzy = {
                from: Math.floor(from - deviation),
                to: Math.ceil(from + deviation)
            };

            return fuzzy;
        };

        /**
         * Util for suggesting a to amount if a user types a single amount
         * @param from
         * @returns {number}
         */
        util.predictToAmount = function (from) {
            var to = Math.ceil(from + (from / 2));
            return to;
        };

        /**
         * Get the name of type-dependent formatter function
         *
         * @param type
         * @returns {*}
         */
        util.getFormatterFnName = function (type) {
            return lpCoreUtils.camelCase('--format-' + (type || 'general'));
        };

        return util;
    };

    module.exports.factory('SmartSuggestEngineUtil', utilFactory);
});
