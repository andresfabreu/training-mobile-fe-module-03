define(function(require, exports, module) {

    'use strict';

    var util = window.lp && window.lp.util; // to be refactored
    var angular = require('base').ng;
    var $ = window.jQuery;

    // @ngInject
    exports.ProfileDetailsService = function($http, LoginService, dateFilter) {
        // Get stored data
        this.restoreUsername = function () {
            var storedData = LoginService.getStoredData(),
                data = JSON.parse(storedData || '{}');
            return data.username;
        };

        // Return data in correct key, value format
        this.formatResponse = function (response, messages) {
            var data = {
                fullname: [response.firstName, response.lastName].join(' '),
                details: [],
                activities: []
            };


            data.photoUrl = response.photoData || util.decodePhotoUrl(response.photoUrl);

            // Details
            if (response.dateOfBirth) {
                data.details.push({ key: 'Birth date', value: dateFilter(response.dateOfBirth) });
            }
            if (response.gender) {
                data.details.push({ key: 'Gender', value: messages && messages[response.gender] ? messages[response.gender] : response.gender });
            }

            angular.forEach(response.details, function (value, key) {
                var label = messages && messages[key] ? messages[key] : key;

                if (key === 'dateOfBirth') {
                    value = dateFilter(value);
                } else {
                    value = messages && messages[value] ? messages[value] : value;
                }
                data.details.push({ key: label, value: value });
            });

            // Activities
            if (response.activities) {
                if (response.activities.lastLoggedIn) {
                    data.activities.push({ key: 'Last Logged In', value: dateFilter(response.activities.lastLoggedIn, 'medium') });
                }
            }

            return data;
        };

        this.getData = function () {
            var username = this.restoreUsername();
            var url = util.getServicesPath() + '/services/rest/v1/party-data-management/party';

            return $http.get(url, null, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;'
                }
            });
        };
    };
});
