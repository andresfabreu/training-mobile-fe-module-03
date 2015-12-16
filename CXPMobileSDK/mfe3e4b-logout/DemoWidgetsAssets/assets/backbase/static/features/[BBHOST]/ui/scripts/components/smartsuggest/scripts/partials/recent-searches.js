/*global define */
define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var core = require('core');

    module.name = 'ui.smartsuggest-engine-recent-searches';

    module.exports = base.createModule(module.name, [
        core.name
    ]);

    // var KEY_PREFIX = 'lp-smartsuggest-recent-search-';

    /**
     * Check if localStorage is supported
     *
     * @returns {boolean}
     */
    // var localStorageSupported = function () {
    //     try {
    //         return 'localStorage' in window && window['localStorage'] !== null;
    //     } catch(e) {
    //         return false;
    //     }
    // };

    /**
     * Create a specific keys to be used for 'recent searches' task
     *
     * @param rawKey
     * @returns {*}
     */
    // var makeKeyPrefixed = function(rawKey) {
    //     return rawKey && typeof rawKey === 'string' ? KEY_PREFIX + rawKey : false;
    // };

    /**
     * Set item to local storage
     *
     * @param key
     * @param value
     * @returns {boolean}
     */
    // var setStorageItem = function(key, value) {
    //     var result = false;

    //     if (localStorageSupported() && key && typeof key === 'string' && value) {
    //         localStorage.setItem(makeKeyPrefixed(key), value);
    //         result = true;
    //     }

    //     return result;
    // };

    /**
     * Get item from local storage
     *
     * @param key
     * @returns {boolean}
     */
    // var getStorageItem = function(key) {
    //     var result = false;

    //     if (localStorageSupported() && key && typeof key === 'string') {
    //         result = localStorage.getItem(makeKeyPrefixed(key)) || false;
    //     }

    //     return result;
    // };

    // @ngInject
    var recentSearchesFactory = function (lpCoreBus) {
        var methods = {};

        return methods;
    };

    module.exports.factory('SmartSuggestEngineRecentSearches', recentSearchesFactory);

});
