define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.PreferenceService = function($http, lpCoreUtils, lpWidget, lpCoreConfiguration) {

        var preferenceEndpoint = lpWidget.getPreference('preferenceService');
        var url = lpCoreUtils.resolvePortalPlaceholders(preferenceEndpoint);
        var headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;'
        };

        this.read = function() {
            //prevents caching behavior in IE8
            var rand = Math.random() + '';
            var num = rand * 1000000000000000000;

            return $http.get(url + '?qi=' + num, null, {
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
    };
});
