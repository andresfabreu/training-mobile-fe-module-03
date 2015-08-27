/**
 * Missing methods in the Date native object and extensions.
 * @module date
 */
define(function(require, exports, module) {
    'use strict';

    var utils = require('base').utils;
    var pad = function(number) {
        return utils.pad(number, 2, '0');
    };

    var moment = require('moment');

    /**
     * Exposes momentjs in lpCoreUtils.date
     */
    exports.date = moment;

    /**
     * Returns a string in ISO format, YYYY-MM-DDTHH:mm:ss.sssZ , UTC format.
     *
     * @param  {Date} date The input date.
     * @return {String}    The ISO string representation.
     */
    exports.dateToISOString = function(date) {
        if (Date.prototype.toISOString) {
            return Date.prototype.toISOString.call(date);
        }

        /** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString */
        return date.getUTCFullYear() +
            '-' + pad(date.getUTCMonth() + 1) +
            '-' + pad(date.getUTCDate()) +
            'T' + pad(date.getUTCHours()) +
            ':' + pad(date.getUTCMinutes()) +
            ':' + pad(date.getUTCSeconds()) +
            '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
            'Z';
    };

    exports.dateFormat = function(date, options) {};
});
