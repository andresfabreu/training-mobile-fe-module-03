define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.profileSummaryController = function($scope, lpWidget, lpPortal, lpUsersAuthentication, PreferenceService, lpCoreUtils, lpCoreBus) {
        //aliases
        var bus = lpCoreBus;
        var utils = lpCoreUtils;

        $scope.model = {
            username: 'Admin'
        };

        // Expose widget preferences
        $scope.lastLoginDateTimeShow = utils.parseBoolean(lpWidget.getResolvedPreference('lastLoginDateTimeShow'));
        $scope.lastLoginDateTimeHideAfter = lpWidget.getResolvedPreference('lastLoginDateTimeHideAfter');

        //gets the link to the profile from a preference (if any)
        var profileLink = lpWidget.getResolvedPreference('profileLink');

        $scope.profileLink = profileLink || null;

        var username = lpPortal.userId || 'Anonymous';

        utils.extend($scope.model, {
            username: username
        });

        PreferenceService.get()
        .then(function(response) {
            var preferences = response.data;

            $scope.model.preferredName = preferences.preferredName || utils.capitalize($scope.model.username);
            $scope.model.photo = preferences.photoData || (preferences.photoUrl ? decodeURIComponent(preferences.photoUrl) : null);
            $scope.model.lastLoginDateTime = preferences.lastLoginDateTime;
        })
        ['catch'](function() {
            $scope.model.preferredName = utils.capitalize($scope.model.username);
        });

        $scope.logout = function() {
            lpUsersAuthentication.logOut();
        };

        $scope.responsiveRules = [
            { min: 0, max: 110, size: 'xs' },
            { min: 101, size: 'small' },
            { min: 201, size: 'medium' }
        ];

        $scope.onSizeChange = function(size) {
            $scope.responsive = size;
        };

        $scope.viewProfile = function () {
            bus.publish('launchpad-retail.viewProfile', {
                originType: 'profileSummary'
            }, true);
        };
    };

});
