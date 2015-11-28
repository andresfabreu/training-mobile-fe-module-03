define(function(require, exports, module) {
    'use strict';

    // base utility library (lodash + base);
    var utils = require('base').utils;
    var API = {};
    var AssertionError;

    /**
     * lpCoreError API
     *
     * #####Correctly throwing an error
     *
     * 1. Errors should be thrown in the low-level parts of the application (**base, core, modules**)
     * 2. Always throw an instance of `Error` class, never throw a string or an object. Getting stack trace
     *    is only possible via Error object, for example.
     * 3. Throwing an error stops code execution. If the error is not serious enough, throw it asynchronously
     *
     * #####Capture inside the widget
     * @example
     * ```
     * var transaction = lpTransaction.api();
     *
     * // Widget level
     * transaction.save()
     *   .catch(lpCoreError.captureException) // basic handling
     *   .then(showSuccessMethod)
     *   .finally(doneLoading);
     * ```
     *
     * #####Custom Error types in LP
     *
     * 1. API modules Error types LP{API}Error
     *
     * ```
     * var TransactionError = lpCoreError.createException('LPTransactionError');
     * var AccountError = lpCoreError.createException('LPAccountError');
     * ```
     *
     * 2. Core Error types `LPCoreHttp`, `LPCoreI18n`, `LPCoreStore`, `LPCoreBus`, etc.
     *
     * #####Error types
     *
     * Besides the generic Error constructor, there are other core error constructors in JavaScript.
     * For client-side exceptions, see Exception Handling Statements.
     *
     * - `EvalError` occurs regarding the global function eval().
     * - `InternalError` occurs when an internal error in the JavaScript engine is thrown. E.g. "too much recursion".
     * - `RangeError` occurs when a numeric variable or parameter is outside of its valid range.
     * - `ReferenceError` occurs when de-referencing an invalid reference.
     * - `SyntaxError` occurs while parsing code in eval().
     * - `TypeError` occurs when a variable or parameter is not of a valid type.
     * - `URIError` occurs when encodeURI() or decodeURI() are called
     *
     * #####Events / lpCoreBus
     *
     * ```
     * // will publish a notification error event
     * lpCoreBus.publish('lp:notify:error', error);
     * ```
     *
     * #####Resources
     * - <a target="_blank" href="http://www.slideshare.net/nzakas/enterprise-javascript-error-handling-presentation">
     *      http://www.slideshare.net/nzakas/enterprise-javascript-error-handling-presentation</a>
     * - <a target="_blank" href="http://eloquentjavascript.net/1st_edition/chapter5.html">
     *      http://eloquentjavascript.net/1st_edition/chapter5.html</a>
     * - <a target="_blank" href="https://docs.angularjs.org/api/ng/service/$exceptionHandler">
     *      https://docs.angularjs.org/api/ng/service/$exceptionHandler</a>
     * - <a target="_blank" href="http://blog.loadimpact.com/2014/06/03/exception-handling-in-an-angularjs-web-application-tutorial/">
     *      http://blog.loadimpact.com/2014/06/03/exception-handling-in-an-angularjs-web-application-tutorial/</a>
     * - <a target="_blank" href="https://technology.amis.nl/2014/10/06/automatic-error-handling-in-angularjs/">
     *      https://technology.amis.nl/2014/10/06/automatic-error-handling-in-angularjs/</a>
     * - <a target="_blank" href="http://odetocode.com/blogs/scott/archive/2014/04/21/better-error-handling-in-angularjs.aspx">
     *      http://odetocode.com/blogs/scott/archive/2014/04/21/better-error-handling-in-angularjs.aspx</a>
     * - <a target="_blank" href="http://bahmutov.calepin.co/catch-all-errors-in-angular-app.html">
     *      http://bahmutov.calepin.co/catch-all-errors-in-angular-app.html</a>
     * - <a target="_blank" href="http://www.nczonline.net/blog/2009/03/03/the-art-of-throwing-javascript-errors/">
     *      http://www.nczonline.net/blog/2009/03/03/the-art-of-throwing-javascript-errors/</a>
     *
     * @memberof core.error
     * @ngFactory
     * @ngInject
     */
    exports.lpCoreError = function($exceptionHandler, $q) {
        /**
         * Creates a custom Error Exception
         * @param   {String} name  Exception name
         * @returns {Object}       ErrorCustomException constructor
         */
        API.createException = function(name) {
            function ErrorException(message) {
                this.name = name || 'Error';
                this.message = message || 'Unknown Message';
            }

            ErrorException.prototype = new Error();
            ErrorException.prototype.constructor = ErrorException;

            return ErrorException;
        };

        /**
         * Captures the exception and pass it to Angular exceptionHandler.
         *
         * @example
         * Used in a `try-catch` block:
         *
         * ```
         * try {
         *   someUnpredictableMethod();
         * } catch(error) {
         *   lpCoreError.captureException(error);
         * }
         * ```
         *
         * @example
         * Used in a `Promise`:
         *
         * ```
         * someAsyncThing()
         *   .then(someOtherAsyncThing)
         *   .catch(function (error) {
         *     lpCoreError.captureException(error);
         *   });
         * ```
         *
         * @example
         * Also you can pass extra data:
         *
         * ```
         * lpCoreError.captureException(error, {
         *   some: 'option'
         * });
         * ```
         *
         * @memberof core.error.lpCoreError
         * @param   {Error}  error  Exception
         * @param   {Object} opts   Optional cause/options/context
         * @returns {Object} Angular Error Object
         */
        API.captureException = function (error, opts) {
            return $exceptionHandler(error, opts);
        };

        /**
         * Throws the error.
         *
         * @example
         * Throwing normal Error object (not recommended):
         *
         * ```
         * exports.MainCtrl = function(lpCoreError) {
         *   if (somethingWrong) {
         *     lpCoreError.throwException('Normal Error');
         *   }
         * }
         * ```
         *
         * This will throw an exception.name of type Error
         * which will be caught by the **$exceptionHandler**
         *
         * @example
         * Throwing your own exceptions (recommended, categorized exceptions):
         *
         * ```
         * // Create a custom exception Error with Widgets.SampleWidget as name
         * var WidgetErrorException = lpCoreError.createException('WidgetError');
         *
         * exports.MainCtrl = function(lpCoreError) {
         *   if (somethingWrong) {
         *     lpCoreError.throwException(new WidgetErrorException('Something wrong'));
         *   }
         * }
         * ```
         *
         * This will throw an exception.name of type **WidgetError**
         *
         * @example
         * Throwing errors in promises:
         *
         * ```
         * var someOtherAsyncThing = function() {
         *   return new Promise(function(resolve, reject) {
         *     lpCoreError.throwException(new WidgetErrorException('Something wrong'));
         *   });
         * };
         * ```
         *
         * You don't need to use reject method.
         *
         * @memberof core.error.lpCoreError
         * @param error {Error|String} Error message or exception instance
         * @returns {Undefined}
         */
        API.throwException = function (error) {
            if (!(error instanceof Error)) {
                error = new Error(error);
            }
            throw error;
        };

        /**
         * Throws Error asynchronously.
         * Throwing an error stops code execution.
         * If the error is not serious enough, throw it asynchronously
         *
         * @memberof core.error.lpCoreError
         * @param   {Error}     error  Error message or exception instance
         * @param   {Number}    delay  Execution delay
         * @param   {Object}    args   Arguments for the delay method
         * @returns {Undefined}
         */
        API.throwExceptionAsync = function (error, delay, args) {
            if (!(error instanceof Error)) {
               error = new Error(error);
            }
            utils.defer( function () { throw error; }, (delay || 100), args );
        };

        /**
         * Throws an AssertionError if condition is not satisfied.
         * Supposed to be a standardized way for programs to test invariants.
         *
         * @example
         * ```
         * lpCoreError.assert(x === 12); // throws an AssertionError if false, with a default error message
         * lpCoreError.assert(x === 12, 'I think it should be twelve') // throws an AssertionError if false, with the given error message
         * ```
         *
         * @memberof core.error.lpCoreError
         * @param   {Boolean}   condition  Evaluate condition
         * @param   {String}    message    Error message
         * @returns {Undefined}
         */
        API.assert = function (condition, message) {
            AssertionError = AssertionError || API.createException('AssertionError');
            if ( !condition ) {
                API.throwException( new AssertionError(message || 'Assertion fails!') );
            }
        };

        return API;
    };

});
