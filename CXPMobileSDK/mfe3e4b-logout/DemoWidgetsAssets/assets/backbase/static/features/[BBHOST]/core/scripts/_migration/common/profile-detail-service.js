define(function(require, exports, module) {

    'use strict';

    var angular = require('base').ng;

    // @ngInject
    exports.ProfileDetailsService = function($http, lpCoreUtils, lpCoreI18n, lpCoreError) {

        var utils = lpCoreUtils;
        var defaults = {
            counterPartyServiceUrl: '$(servicesPath)/services/rest/v1/party-data-management/party'
        };
        var ProfileDetailService = this;
        ProfileDetailService.config = defaults;

        ProfileDetailService.setConfig = function (config){
            ProfileDetailService.config = angular.extend(defaults, config);
        };

        function doI18n(profileDetails) {
            var detailsParsed = [];
            lpCoreUtils.each(profileDetails, function (value, key) {
                detailsParsed.push({
                    key: lpCoreI18n.instant(key),
                    value: (key === 'dateOfBirth') ? lpCoreI18n.formatDate(value) : lpCoreI18n.instant(value)
                });
            });
            return detailsParsed;
        }

        // Return data in correct key, value format
        ProfileDetailService.formatResponse = function (response) {
            var data = {
                fullname: [response.firstName, response.lastName].join(' '),
                details: doI18n(response.details),
                activities: [],
                photoUrl: response.photoData
            };

            if(!data.photoUrl && response.photoUrl){
                data.photoUrl = utils.decodePhotoUrl(response.photoUrl);
            }

            // Activities
            if (response.activities) {
                if (response.activities.lastLoggedIn) {
                    data.activities.push({ key: 'Last Logged In', value: lpCoreI18n.formatDate(response.activities.lastLoggedIn, 'medium') });
                }
            }

            return data;
        };

        ProfileDetailService.getData = function () {
            var url = utils.resolvePortalPlaceholders(ProfileDetailService.config.counterPartyServiceUrl || defaults.counterPartyServiceUrl);

            return $http.get(url, null, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded;'
                }
            });
        };
    };
});
