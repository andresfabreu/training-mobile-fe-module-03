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

    var utils = require('base').utils;

    /**
     * Accepts 1..n objects and the last argument must be the key. Starts
     * searching for the key in the first object and so on until it is found,
     * then return that value and deletes that property from the object.
     * @private
     * @param {...object} objects
     * @param {string} key  Last argument
     * @return {*} First value found in `objects` by the `key`.
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
     * @param  {string} url
     * @param  {object} data
     * @param  {object} params
     * @return {string}
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
     * Request/Response http interceptor
     * @param  {object} $q [Promise DI]
     * @return {object}    [description]
     */
    // @ngInject
    exports.lpCoreHttpInterceptor = function httpInterceptor($q) {

        /**
         * interceptors get called with a http config object.
         * The function is free to modify the config object or create a new one.
         * The function needs to return the config object directly,
         * or a promise containing the config or a new config object.
         * @param  {object} config original request configuration
         * @return {object} modified request configuration
         */
        function requestInterceptor(config) {
            config.data = config.data || {};
            config.params = config.params || {};

            // replaces all url parameters
            config.url = interpolateUrl(config.url, config.data, config.params);

            return config;
        }

        /**
         * interceptor gets called when a previous interceptor threw an error or resolved with a rejection.
         * @param  {object} responseErr response
         * @return {object}             modified response
         */
        function requestErrorInterceptor(responseErr) {
            // not modified
            return $q.reject(responseErr);
        }
        /**
         * interceptors get called with http response object.
         * The function is free to modify the response object or create a new one.
         * The function needs to return the response object directly,
         * or as a promise containing the response or a new response object.
         * @param  {object} response http response
         * @return {object}          modified response
         */
        function responseInterceptor(response) {
            // not modified
            return response || $q.when(response);
        }

        /**
         * interceptor gets called when a previous interceptor threw an error or resolved with a rejection.
         * @param  {object} responseErr response http error
         * @return {object}             modified response error
         */
        function responseErrorInterceptor(responseErr) {

            if( responseErr.status && responseErr.status !== 404) {
                responseErr.data = responseErr.data || {};
                responseErr.data.errors = responseErr.data.errors || [];
                // if endpoint doesn't provide any errors
                // we create it and add an unknown error message key
                var errors = responseErr.data.errors;
                if(errors.length <= 0) {
                    errors.push({code: 'UNKNOWN_ERROR', message: 'Unknown message error'});
                }
            }
            // #TODO deal with 404 or non status errors
            return $q.reject(responseErr);
        }

        return {
            request: requestInterceptor,
            requestError: requestErrorInterceptor,
            response: responseInterceptor,
            responseError: responseErrorInterceptor
        };
    };
});
