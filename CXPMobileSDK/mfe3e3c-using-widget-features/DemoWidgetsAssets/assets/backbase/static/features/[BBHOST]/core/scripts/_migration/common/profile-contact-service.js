define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.ProfileContactService = function($http, lpWidget, lpCoreUtils) {

        var url = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('saveUrl'));

        this.read = function() {
            return $http.get(url);
        };

        this.save = function(field, value) {
            var data = {};
            data[field] = value;

            return $http.put(url, $.param(data), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;'
                }
            });
        };
    };
});
