/**
 * Parsing methods.
 * @module parse
 */
define(function(require, exports, module) {

    'use strict';

    /**
     * Normalizes boolean values, to be real Boolear type.
     * @param val {string|boolean|number}
     * @returns {boolean}
     */
    exports.parseBoolean = function (val) {
        return (typeof val === 'boolean' && val) ||
            (typeof val === 'string' && /\s*true\s*/i.test(val)) ||
            (typeof val === 'number' && val !== 0);
    };
});
