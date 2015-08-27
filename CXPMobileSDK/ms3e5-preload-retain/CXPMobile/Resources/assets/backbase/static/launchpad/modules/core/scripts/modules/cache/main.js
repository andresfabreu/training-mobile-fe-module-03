/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : cache.js
 *  Description: Cache Module
 *  Generic way to cache promises and ensure all cached promises are resolved correctly.
 *  ----------------------------------------------------------------
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
        // TODO
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
