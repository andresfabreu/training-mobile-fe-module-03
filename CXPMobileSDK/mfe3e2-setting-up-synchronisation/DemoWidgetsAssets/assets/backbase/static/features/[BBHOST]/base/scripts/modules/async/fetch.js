/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - Launchpad
 *  Filename : fetch.js
 *  Description:
 *  ----------------------------------------------------------------
 */
define(function(require, exports, module) {
    'use strict';

    require('angular'); // angular from window, it doesn't export
    var angular = window.angular;
    /**
     * Use Angular $http Service
     */
    module.exports = (function(http) {
        return function(url, options) {
            options = typeof url === 'object' ? url : options;
            return http(angular.extend({
                url: url,
                method: 'get',
                responseHeaders: {
                    'cache-control': 'no-cache' // for old IE
                }
            }, options));
        };
    })(angular.injector(['ng']).get('$http'));
});
