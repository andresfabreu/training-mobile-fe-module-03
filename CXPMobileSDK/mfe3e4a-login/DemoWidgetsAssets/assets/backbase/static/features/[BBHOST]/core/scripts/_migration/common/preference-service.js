define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.PreferenceService = function($http, $filter, lpCoreUtils, lpWidget, lpCoreConfiguration) {

        var preferenceEndpoint = lpWidget.getPreference('preferenceService');
        var url = lpCoreUtils.resolvePortalPlaceholders(preferenceEndpoint);
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        };

        this.read = this.get = function() {
            return $http.get(url, {
                headers: headers
            });
        };

        this.save = function(field, value) {
            var data = {};
            data[field] = value;

            return $http.put(url, lpCoreUtils.buildQueryString(data), {
                headers: headers
            });
        };
        this.put = function(field, value) {
            var data = {};
            data[field] = value;

            return $http.put(url + '/' + field, $filter('json')(data), {
                headers: headers
            });
        };
    };
});
