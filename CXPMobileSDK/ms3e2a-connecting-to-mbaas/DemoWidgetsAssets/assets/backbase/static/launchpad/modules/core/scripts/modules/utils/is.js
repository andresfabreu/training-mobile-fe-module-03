/**
 * Testing methods.
 * @module is
 */
define(function(require, exports, module) {

    'use strict';

    /**
     * Check if input is valid email address.
     * @param email {string}
     * @returns {boolean}
     */
    exports.isValidEmail = function (email) {
        var regularExpressions = /^\w+([\.\-]?\w+)*@\w+([\.\-]?\w+)*(\.\w+)+$/;
        return regularExpressions.test(email);
    };
});
