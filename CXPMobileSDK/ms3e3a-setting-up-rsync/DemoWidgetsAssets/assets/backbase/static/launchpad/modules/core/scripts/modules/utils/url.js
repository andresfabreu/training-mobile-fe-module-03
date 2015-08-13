/**
 * Parses / stringifies query string
 * @module url
 */
define(function(require, exports, module) {
    'use strict';

    var utils = require('base').utils;

    /**
     * Given a `string` returns the json `object` equivalent.
     *
     * @param  {String} string The query string.
     * @returns {Object} Returns a json object.
     */
    exports.parseQuerystring = function parseQuerystring(str) {
        if (!utils.isString(str)) {
            return {};
        }

        str = utils.trim(str);

        if (!str) {
            return {};
        }

        return utils.reduce(str.split('&'), function(obj, param) {
            var parts = param.split('=');
            var key = decodeURIComponent(parts[0]);
            var val = parts[1];

            val = utils.isUndefined(val) ? null : decodeURIComponent(val);

            if (obj.hasOwnProperty(key)) {
                if (!utils.isArray(obj[key])) {
                    obj[key] = [obj[key]];
                }
                obj[key].push(val);
            } else {
                obj[key] = val;
            }

            return obj;
        }, {});
    };

    /**
     * Given an `object` returns its query string equivalent.
     *
     * @param  {Object} object A json compliant objet.
     * @return {String} Returns the query string.
     */
    exports.buildQueryString = function buildQueryString(obj) {
        if (!utils.isObject(obj)) {
            return '';
        }

        return utils.map(utils.keys(obj), function(key) {
            var val = obj[key];

            if (utils.isArray(val)) {
                return utils.map(val, function (val2) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
                }).join('&');
            }

            return encodeURIComponent(key) + '=' + encodeURIComponent(val);
        }).join('&');
    };
});
