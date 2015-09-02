/**
 * Parsing methods.
 * @module parse
 */
define(function(require, exports, module) {

    'use strict';

    /**
     * Normalizes boolean values, to be real Boolean type.
     *
     * @example
     * ```
     * lpCoreUtils.parseBoolean(''); // false
     * ```
     *
     * @memberof core.utils.lpCoreUtils
     * @param    {String|Boolean|Number} val
     * @returns  {Boolean}
     */
    exports.parseBoolean = function (val) {
        return (typeof val === 'boolean' && val) ||
            (typeof val === 'string' && /\s*true\s*/i.test(val)) ||
            (typeof val === 'number' && val !== 0);
    };
});
