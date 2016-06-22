define(function(require, exports, module) {
    'use strict';

    var utils = require('base').utils;

    // @ngInject
    exports.lpEnrollmentUtil = function() {
        /**
         * Identify mobile devices
         */
        var isMobileDevice = utils.isMobileDevice;

        /**
         * Factory which returns a function, which masks a string with symbols.
         * For e-mails it can mask only string before @ symbol
         *
         * @param type
         * @param numberLeaveUnmaskedAtEnd
         * @param maskWithSymbol
         * @returns {Function}
         */
        var maskStringMaker = function (type, numberLeaveUnmaskedAtEnd, maskWithSymbol) {
            var regexp = new RegExp('.(?=.{' + (numberLeaveUnmaskedAtEnd || 3) + '})', 'g');
            var symbol = maskWithSymbol || '*';

            return type === 'email' ? function (s) {
                if (!s) { return 'No email provided!'; }
                var email = s.split('@');
                return [email[0].replace(regexp, symbol), email[1]].join('@');
            } : function (s) {
                if (!s) { return 'No string provided!'; }
                return s.replace(regexp, symbol);
            };
        };

        /**
         * Returns ISO short date yyyy-mm-dd made of differently formatted date string
         *
         * @param {string} dateString
         * @param {string} pattern
         * @returns {string}
         */
        var getISODate = function(dateString, pattern) {

            function getDelimiter(patternToAnalyze) {
                var res;

                utils.forEach(['.', '-', '/'], function(c) {
                    if (utils.indexOf(patternToAnalyze, c) !== -1) {
                        res = c;
                    }
                });

                return res;
            }

            function parsePattern(patternToParse) {
                patternToParse = patternToParse.toLowerCase();
                var parsed = patternToParse.split(getDelimiter(patternToParse));
                return {
                    mm: utils.indexOf(parsed, 'mm'),
                    dd: utils.indexOf(parsed, 'dd'),
                    yyyy: utils.indexOf(parsed, 'yyyy')
                };
            }

            function parseDate(dateStringToParse) {
                return dateString.split(getDelimiter(dateStringToParse));
            }

            function pad(number) {
                var num = parseInt(number, 10);
                if (num < 10) {
                    return '0' + num;
                }
                return num;
            }

            var patternParsed = parsePattern(pattern);
            var parsedDate = parseDate(dateString);
            return parsedDate[patternParsed.yyyy] +
                '-' + pad(parsedDate[patternParsed.mm]) +
                '-' + pad(parsedDate[patternParsed.dd]);
        };

        /**
         * Get field object for collection item which 'name' is name
         *
         * @param name
         * @param list
         * @returns {*}
         */
        var getByName = function (name, list) {
            if (utils.isArray(list[0])) {
                list = utils.flatten(list);
            }
            var field = utils.find(list, { name: name});
            return field;
        };

        /**
         * Get values for specified list of names
         *
         * @param fields
         * @param listOfNames
         * @returns {Object}
         */
        var getSpecifiedValues = function (fields, listOfNames) {
            var result = {};

            if (!fields || !utils.isPlainObject(fields) || !listOfNames || !utils.isArray(listOfNames)) {
                return result;
            }

            var normalizedFields = utils.flatten(utils.values(fields), true);

            utils.forEach(normalizedFields, function (item) {
                if (utils.indexOf(listOfNames, item.name) !== -1) {
                    if (item.date) {
                        result[item.name] = getISODate(item.value, item.date);
                    } else {
                        result[item.name] = item.value;
                    }
                }
            });

            return result;
        };

        return {
            isMobileDevice: isMobileDevice,
            getISODate: getISODate,
            getByName: getByName,
            getSpecifiedValues: getSpecifiedValues,
            maskStringMaker: maskStringMaker
        };
    };
});
