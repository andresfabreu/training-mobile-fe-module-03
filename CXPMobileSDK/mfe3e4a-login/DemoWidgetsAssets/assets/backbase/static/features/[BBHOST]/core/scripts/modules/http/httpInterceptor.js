/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : httpInterceptor.js
 *  Description: Launchpad Http Interceptor
 *  ----------------------------------------------------------------
 */

define(function(require, exports, module) {

    'use strict';

    var $ = require('jquery');
    var base = require('base');
    var utils = base.utils;
    var queue = base.queue;
    var ignoreList = [];

    /**
     * Accepts 1..n objects and the last argument must be the key. Starts
     * searching for the key in the first object and so on until it is found,
     * then return that value and deletes that property from the object.
     * @private
     * @param   {...Object} objects
     * @param   {String}    key      Last argument
     * @returns {*} First value found in `objects` by the `key`.
     */
    var getValue = function(/*objects, key*/) {
        var objects = [].slice.call(arguments);
        var key = objects.pop();
        var value;

        for (var i = 0, len = objects.length; i < len; i++) {
            if (objects[i].hasOwnProperty(key)) {
                value = objects[i][key];
                delete objects[i][key];
                return value;
            }
        }
    };

    /**
     * Replaces `url` string ocurrences of $(property_name) with the values
     * of `property_name` in `data` and `params` objects. If it is found the
     * property is deleted from the object. It will start searching in `data`
     * and then in `params`.
     * @private
     * @param   {String} url
     * @param   {Object} data
     * @param   {Object} params
     * @returns {String}
     */
    var interpolateUrl = function(url, data, params) {
        url = utils.trim(url).replace(
            /\$\(([a-z]\w*)\)/gi,
            function($0, label) {
                return getValue(data, params, label);
            });

        return url;
    };

    /**
     * Check if current response is notifiable.
     * @private
     */
    var isNotifyable = function(response) {
        var url = response.config.url;
        return !ignoreList.some(function(pattern) {
            return pattern instanceof RegExp ? pattern.test(url) : url.indexOf(pattern) > -1;
        });
    };

    /**
     * Calculate context id from request object. Used to compare "similar" requests and group them in retry dialog.
     * @private
     * @param response
     * @return {string}
     */
    var getContextId = function(response) {
        return [
            response.config.method,
            response.config.url,
            $.param(response.config.params)
        ].join('__');
    };


    /**
     * Request/Response http interceptor
     * @memberof core.http
     * @ngFactory
     * @ngInject
     */
    exports.lpCoreHttpInterceptor = function httpInterceptor($injector, $q) {


        /**
         * Interceptors get called with a http config object.
         * The function is free to modify the config object or create a new one.
         * The function needs to return the config object directly,
         * or a promise containing the config or a new config object.
         * @alias request
         * @memberof core.http.lpCoreHttpInterceptor
         * @param config {Object} Original request configuration
         * @returns {Object} Modified request configuration
         */
        function requestInterceptor(config) {
            config.data = config.data || {};
            config.params = config.params || {};

            // replaces all url parameters
            config.url = interpolateUrl(config.url, config.data, config.params);

            return config;
        }

        /**
         * Interceptor gets called when a previous interceptor threw an error or resolved with a rejection.
         * @alias requestError
         * @memberof core.http.lpCoreHttpInterceptor
         * @param responseErr {Object} Response http error
         * @returns {Object} Modified response
         */
        function requestErrorInterceptor(responseErr) {
            // not modified
            return $q.reject(responseErr);
        }
        /**
         * Interceptors get called with http response object.
         * The function is free to modify the response object or create a new one.
         * The function needs to return the response object directly,
         * or as a promise containing the response or a new response object.
         * @alias response
         * @memberof core.http.lpCoreHttpInterceptor
         * @param response {Object} HTTP response
         * @returns {Object} Modified response
         */
        function responseInterceptor(response) {
            // not modified
            return response || $q.when(response);
        }

        /**
         * Interceptor gets called when a previous interceptor threw an error or resolved with a rejection.
         * @alias responseError
         * @memberof core.http.lpCoreHttpInterceptor
         * @param responseErr {Object} Response http error
         * @returns {Object} Modified response error
         */
        function responseErrorInterceptor(responseErr) {
            // Don't handle 404's
            if (responseErr.status && responseErr.status !== 404) {

                if (typeof responseErr.data !== 'string') {
                    responseErr.data = responseErr.data || {};
                }
                else {
                    // is string so we should not care for now
                    // should be an object
                    responseErr.data = {};
                }
                responseErr.data.errors = responseErr.data.errors || [];

                // if endpoint doesn't provide any errors
                // we create it and add the statusText if any
                // otherwise 'unknown error message' key
                var errors = responseErr.data.errors;
                if (errors.length <= 0) {
                    errors.push({
                        code: responseErr.status,
                        message: responseErr.statusText || 'Unknown error message'
                    });
                }


                // ignore 403 and 401 for being notifiable
                if((responseErr.status !== 401 && responseErr.status !== 403)) {
                    if (isNotifyable(responseErr) ) {
                        var context = {
                            contextId: getContextId(responseErr),
                            messages: responseErr.data.errors
                        };
                        queue.push(context, function retryFunction() {
                            return $injector.get('$http')(responseErr.config);
                        });
                    }
                }
            }

            return $q.reject(responseErr);
        }

        /**
         * Configuring of responseError interceptor notification behavior.
         * Widgets have ability to prevent notifications from poping up for certain endpoints.
         * @memberOf core.http.lpCoreHttpInterceptor
         * @param {Object} params - Configuration of the notifications and retry queue.
         * @param {Array} params.ignore - Array of urls or regular expression patters responseError interseptor will use to decide whether to show notification or not.
         * @example Here is the example of how widget can configure interceptor to ignore accounts and debit accounts modules service error, as well as an example of regular expression pattern:
         *
         * ```
         * lpCoreHttpInterceptor.configureNotifications({
         *     ignore: [
         *         widget.getPreference('accountsDataSrc'),
         *         '$(servicesPath)/services/rest/v1/debit-accounts',
         *         /services\/profile\/.+?/
         *     ]
         * });
         * ```
         *
         * Ignore array can contain of simple URL strings or regular expression patterns. Placeholders like `$(servicesPath)` and `$(contextRoot)` are substituted automatically.
         */
        function configureNotifications(params) {
            if (params.ignore) {
                params.ignore = params.ignore.map(function(pattern) {
                    return pattern instanceof RegExp ? pattern : utils.resolvePortalPlaceholders(pattern);
                });
                ignoreList = ignoreList.concat(params.ignore);
            }
        }

        return {
            configureNotifications: configureNotifications,
            request: requestInterceptor,
            requestError: requestErrorInterceptor,
            response: responseInterceptor,
            responseError: responseErrorInterceptor
        };
    };
});
