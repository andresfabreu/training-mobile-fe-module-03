/**
 * Testing methods.
 * @module is
 */
define(function(require, exports, module) {

    'use strict';

    /**
     * Check if input is valid email address.
     *
     * @memberof core.utils.lpCoreUtils
     * @param   {String}  email  Email address
     * @returns {Boolean}
     */
    exports.isValidEmail = function (email) {
        var regularExpressions = /^\w+([\.\-]?\w+)*@\w+([\.\-]?\w+)*(\.\w+)+$/;
        return regularExpressions.test(email);
    };

    /**
     * Check if string is valid UUID
     *
     * @memberof core.utils.lpCoreUtils
     * @param   {String}  string
     * @returns {Boolean}
     */
    exports.isValidUUID = function (string) {
        var regularExpressions = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regularExpressions.test(string);
    };

    /**
     * Validate the payment detail checksum based on ISO 7064
     * http://en.wikipedia.org/wiki/International_Bank_Account_Number#Validating_the_IBAN
     * @param  {String} input the input to be validated
     */
    exports.isValidISO7064Checksum = function(input) {
        /**
        * Replace letters from the IBAN with numbers
        * @param  {String} str [description]
        */
        var replaceLetters = function(str) {
            var strArray = str.split('');
            for (var i = 0; i < strArray.length; i++) {
                if (/[A-Z]/.test(strArray[i])) {
                    strArray[i] = strArray[i].charCodeAt(0) - 55;
                }
            }
            return strArray.join('');
        };

        /**
         * Performs a basic mod-97 operation for IBAN validation (as described in ISO 7064)
         * @param  {String} str Max 9 character string respresenting part of the IBAN
         */
        var mod97 = function(str) {
            var result = parseInt(str, 10) % 97;
            result = result.toString();

            return result.length === 1 ? '0' + result : result;
        };

        if(input) {
            input = input.substr(4) + input.substr(0, 4);
            input = replaceLetters(input);
            //bypasses javascript INT32 restriction
            while (input.length > 2 && !isNaN(input)) {
                input = mod97(input.substr(0, 9)) + input.substr(9);
            }
            if (parseInt(input, 10) === 1) {
                return true;
            }
        }

        return false;
    };

});
