define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.ProfileDetailsCtrl = function($scope, lpUserDetails, lpPortal, $http, lpWidget, lpCoreUtils, lpCoreI18n) {

        function parse(data) {
            data.fullname = [data.firstName, data.lastName].join(' ');

            data.activities.lastLoggedIn = {
                key: 'Last Logged In',
                value: data.activities.lastLoggedIn
            };

            // capitalize first letter of the keys
            lpCoreUtils.map(data.details, function(v) {
                v.key = lpCoreUtils.startCase(v.key);
            });

            return data;
        }

        function initialize() {
            $scope.title = lpWidget.getPreference('title');
            var endpoint = lpWidget.getResolvedPreference('detailsEndpoint') || (lpPortal.root + '/services/rest/v1/party-data-management/party');
            lpUserDetails.get(endpoint).then(function(data) {
                $scope.profile = parse(data);
            });
        }

        lpWidget.addEventListener('preferencesSaved', function () {
            lpWidget.refreshHTML();
            $scope.$apply(function() {
                initialize();
            });
        });

        initialize();
    };
});
