/**
 * Cookie helper methods.
 * @module utils
 */
define(function(require, exports, module) {

    'use strict';

    /**
     * Returns cookie by name
     *
     * @memberof core.utils.lpCoreUtils
     * @param   {String} name Name of a cookie
     * @returns {String}
     */
    exports.getCookie = function(name) {
        var value = '; ' + document.cookie,
            parts = '';

        if (typeof name === 'string') {
            parts = value.split('; ' + name + '=');
            if (parts.length === 2) {
                return parts.pop().split(';').shift();
            }
        }
    };
});
