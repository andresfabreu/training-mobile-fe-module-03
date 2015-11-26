/**
 * Provides generic cache system. Use this module to cache async calls.
 *
 * @copyright Backbase B.V.
 * @author Backbase R&D - Amsterdam - New York
 *
 * @name cache
 * @memberof core
 * @ngModule
 */

define(function(require, exports, module) {
    'use strict';

    module.name = 'core.cache';
    var base = require('base');
    var deps = [];

    var cache;
    var promiseCache;

    // @ngInject
    function lpCoreCachePromise($cacheFactory, $q, lpCoreUtils) {
        cache = cache || $cacheFactory('lp');

        /**
         * Returns cached promise for the key if it exists.
         * Otherwise calls the function returning promise, and return it.
         *
         * @name lpCoreCachePromise
         * @memberof core.cache
         * @param   {Object}  options  Object containing:
         *   {String} key        Cache key
         *   {Function} promise  Function returning promise
         * @returns {Promise}
         * @ngFactory
         */
        function cachePromise(options) {
            var promise = options.promise;
            var key = options.key;
            promiseCache = cache.get(key);
            if(!promiseCache) {
                promiseCache = promise.call();
                cache.put(key, promiseCache);
            }
            return promiseCache;
        }

        return cachePromise;
    }

    module.exports = base.createModule(module.name, deps)
        .factory('lpCoreCachePromise', lpCoreCachePromise);
});
