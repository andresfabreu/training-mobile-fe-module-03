define(function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpUserDetails = function($http, lpCoreUtils, lpCoreI18n) {

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

        function normalize(response) {

            response.photoUrl = response.photoData || (response.PhotoUrl ? decodeURIComponent(response.photoUrl) : null);
            response.details = doI18n(response.details);

            var ra = response.activities;
            if (ra) {
                if (ra.lastLoggedIn) {
                    ra.lastLoggedIn = lpCoreI18n.formatDate(ra.lastLoggedIn, 'medium');
                } else {
                    ra.lastLoggedIn = '';
                }
            } else {
                response.activities = {lastLoggedIn: ''};
            }

            return response;
        }

        return {
            get: function(url) {
                return $http.get(url).then(function(response) {
                    return normalize(response.data);
                });
            },
            put: function(url, data){
                // TODO move to https://docs.angularjs.org/api/ng/service/$httpParamSerializerJQLike since 1.4.x
                return $http({
                    method: 'put',
                    url: url,
                    transformRequest: lpCoreUtils.buildQueryString,
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;'
                    }
                });
            }
        };
    };
});
