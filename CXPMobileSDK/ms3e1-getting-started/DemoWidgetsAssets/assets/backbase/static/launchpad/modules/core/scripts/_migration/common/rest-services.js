define(function(require, exports, module) {

    'use strict';

    var util = window.lp && window.lp.util; // to be refactored
    var angular = require('base').ng;
    var $ = window.jQuery;

    // @ngInject
    exports.httpService = function($http, $q, $timeout, httpServicesConfig) {
        /**
         * Creates a new Service instance
         * @param config
         * @constructor
         */
        var HttpService = function(config) {
            angular.extend(this, httpServicesConfig.defaultConfig, config);
        };

        /**
         * Read operation for this service,
         * Will send an asynchronous GET request to this service's endpoint
         * @param {Object} params Add get parameters
         * @param {Boolean} force bypass cache
         * @returns {Object} an xhr promise
         */
        HttpService.prototype.read = function(params, force) {

            var self = this;

            var cacheId = getCacheKey(this.endpoint, params),
                promise;

            if (!force) {
                promise = getCacheItem(cacheId);
            }

            if (!promise) {
                promise = makeXhrRequest(this.endpoint, 'GET', {}, this.contentType, params)
                .success(function(response) {
                    setCacheItem(cacheId, response, self.cacheTimeout);
                });
            }

            return promise;
        };

        /**
         *
         * @returns {string}
         * @private
         */
        var getCacheKey = function(url, params) {
            params = params ? "." + JSON.stringify(params) : "";
            return "launchpad.services/" + url + params;
        };

        /**
         *
         * @returns {null}
         * @private
         */
        var getCacheItem = function(cacheId) {
            var cacheData = util.localStorageSupported() ? sessionStorage.getItem(cacheId) : null;
            var promise = null;

            if (cacheData) {
                try {
                    cacheData = JSON.parse(cacheData);
                    if (cacheData.expires && cacheData.expires > new Date().getTime()) {
                        // Cache hit: Expires in the future, resolve the promise.
                        promise = resolvePromise(cacheData.data);
                    }
                    else {
                        // Cache miss: remove stale item.
                        clearCacheItem(cacheId);
                    }
                }
                catch (e) {
                    // Silently ignore errors - will return null.
                }
            }

            return promise;
        };

        /**
         *
         * @param string cacheId
         * @param mixed data
         * @param int timeout
         * @private
         */
        var setCacheItem = function(cacheId, data, timeout) {

            if(util.localStorageSupported()) {
                try {
                    sessionStorage.setItem(cacheId, JSON.stringify({
                        expires: new Date().getTime() + timeout,
                        data: data
                    }));
                }
                catch (error) {
                }
            }
        };

        /**
         *
         * @returns {string}
         * @private
         */
        var clearCacheItem = function(cacheId) {
            sessionStorage.removeItem(cacheId);
        };

        /**
         * Create operation for this service
         * Will send a POST request to this service's endpoint
         * @param conf
         * @returns {*}
         */
        HttpService.prototype.create = function(config) {
            config = angular.extend({}, { method: 'POST' },  config);
            var contentType = config.contentType || this.contentType;

            return makeXhrRequest(this.endpoint, config.method, config.data, contentType);
        };

        /**
         * Update operation for this service
         * Will send a PUT request to this service's endpoint
         * @param conf
         * @returns {*}
         */
        HttpService.prototype.update = function(config) {
            config = angular.extend({}, { method: 'PUT' },  config);
            var contentType = config.contentType || this.contentType;

            return makeXhrRequest(this.endpoint, config.method, config.data, contentType);
        };

        /**
         * Delete operation for this service
         * Will send a DELETE request to this service's endpoint
         * @param conf
         * @returns {*}
         */
        HttpService.prototype.del = function(config) {
            config = angular.extend({}, { method: 'DELETE' },  config);
            return makeXhrRequest(this.endpoint, config.method, config.data, this.contentType);
        };

        /**
         *
         * @param conf
         * @returns {*}
         * @private
         */
         // Known issue with null: https://github.com/angular/angular.js/issues/2191
        var makeXhrRequest = function(url, method, data, contentType, params, timeout) {

            function isTesting() {
                return window.location.protocol === "file:" || typeof window.__karma__ !== "undefined";
            }

            // Prevent GET caching. (small hack for url regex matching in unit tests)
            if (method === 'GET' && !isTesting()) {
                params = angular.extend(params || {}, { '_': new Date().getTime() });
            }

            contentType = contentType || 'application/x-www-form-urlencoded;';
            if (contentType === 'application/x-www-form-urlencoded;') {
                data = $.param(data || {});
            }

            var config = {
                method: method,
                url: url,
                params: params,
                data: data,
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': contentType
                },
                timeout: timeout
            };

            var promise = $http(config);
            return promise;
        };

        var resolvePromise = function(data) {
            var deferred = $q.defer(),
                promise = deferred.promise;

            // Defining `success` and `always` method for callbacks.
            // `error` should never be called since the promise is resolved
            promise.success = function(fn){
                promise.then(function(response){
                    fn(response);
                }, null);
                return promise;
            };

            promise.error = function(fn){
               promise.then(null, function(response){
                    fn(response);
               });
               return promise;
            };

            promise.always = function(fn){
               promise.then(null, null, function(response){
                    fn(response);
               });
               return promise;
            };

            $timeout(function() {
                deferred.resolve(data);
            });

            return promise;
        };

        // Service pool
        var services = {};

        var getServiceInstance = function(config) {
            // Validate
            if(!config.endpoint || typeof config.endpoint !== "string") {
                throw new Error("You must specify an endpoint in your service config");
            }

            if (!services[config.endpoint]) {
                // Fix paramaterized context path (and backwards compatible with contextRoot)
                // Update variables in endpoint url [ /transactions/$(transactiondId) ]
                config.urlVars = config.urlVars || {};
                config.urlVars.contextRoot = config.urlVars.contextRoot || util.getContextPath();
                config.urlVars.contextPath = config.urlVars.contextPath || util.getServicesPath();
                config.urlVars.servicesPath = config.urlVars.servicesPath || util.getServicesPath();
                config.endpoint = util.replaceUrlVars(config.endpoint, config.urlVars);

                services[config.endpoint] = new HttpService(config);
            }

            return services[config.endpoint];
        };

        return {
            getInstance: getServiceInstance,
            resolvePromise: resolvePromise
        };
    };
});
