/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : handler.js
 *  Description: lpCoreError API
 *
 *  ----------------------------------------------------------------
 */
define(function(require, exports, module) {
    'use strict';

    // base utility library (lodash + base);
    var utils = require('base').utils;

    // @ngInject
    exports.lpCoreError = function($exceptionHandler, $q) {

        /**
         * Create a custom Error Exception
         * @param  {string} name ExceptionName
         * @return {object}      ErrorCustomException constructor
         */
        exports.createException = function(name) {
            function ErrorException(message) {
                this.name = name || 'Error';
                this.message = message || 'Unkown Message';
            }
            ErrorException.prototype = new Error();
            ErrorException.prototype.constructor = ErrorException;

            return ErrorException;
        };
        /**
         * Capture the exception and pass it to Angular exceptionHandler
         * @param  {object} error Error Exception
         * @param  {object} opts  optional cause / options / context
         * @return {object}       Angular Error Object
         */
        exports.captureException = function (error, opts) {
            return $exceptionHandler(error, opts);
        };

        /**
         * Throwing Error
         * @param  {exception} error Error message or Exception object
         * @return {undefined}       Throws the error
         */
        exports.throwException = function (error) {
            if (!(error instanceof Error)) {
                error = new Error(error);
            }
            throw error;
        };

        /**
         * Throwing Error async
         * Throwing an error stops code execution.
         * If the error is not serious enough, throw it asynchronously
         * @param  {exception} error  Error message or Exception object
         * @param  {number} delay Execution delay
         * @param  {object} args  Arguments for the delay method
         * @return {undefined}   Throws the error
         */
        exports.throwExceptionAsync = function (error, delay, args) {
            if (!(error instanceof Error)) {
               error = new Error(error);
            }
            utils.defer( function () { throw error; }, (delay || 100), args );
        };

        /**
         * Return the API factory
         */
        return exports;
    };

});
