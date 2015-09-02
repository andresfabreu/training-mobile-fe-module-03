define(function(require, exports, module) {

    'use strict';

    var util = window.lp && window.lp.util; // to be refactored
    var angular = require('base').ng;
    var $ = window.jQuery;

    // @ngInject
    exports.ProfileContactService = function($http, lpWidget) {

        var url = util.replaceUrlVars(lpWidget.getPreference('saveUrl'), {
            servicesPath: util.getServicesPath()
        });

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
