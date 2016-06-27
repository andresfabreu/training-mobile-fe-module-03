/**
 * String helper methods.
 * @module utils
 */
define(function(require, exports, module) {

    'use strict';

    var utils = require('base').utils;

    /**
     * Removes all the html tags from `str`.
     * @memberof core.utils.lpCoreUtils
     * @param   {String} str  Input string
     * @returns {String}
     */
    exports.stripHtml = function (str) {
        if (!utils.isString(str)) {
            // TODO: use custom log object when implemented
            console.log(str + ' is not a String');
            return '';
        }

        return str.replace(/<\/?[^>]+>/g, '');
    };
});
