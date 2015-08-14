define(function(require, exports, module) {

    'use strict';
    var util = window.lp && window.lp.util || {}; // to be refactored

    // @ngInject
    exports.profileSummaryController = function($scope, lpWidget, LoginService, PreferenceService, lpCoreUtils, lpCoreBus) {
        //aliases
        var bus = lpCoreBus;
        var utils = lpCoreUtils;

        $scope.model = {
            username: 'Admin'
        };

        var getPortalUser = function() {
            var b$ = window.b$;
            return !utils.isEmpty(b$.portal.loggedInUserId) ? b$.portal.loggedInUserId : undefined;

        };
        //gets the link to the profile from a preference (if any)
        var profileLink = lpWidget.getPreference('profileLink');

        profileLink = util.replaceUrlVars(profileLink, {
            contextPath: util.getContextPath()
        });

        $scope.profileLink = profileLink || null;

        var username = getPortalUser() || 'Anonymous';

        utils.extend($scope.model, {
            username: username
        });

        PreferenceService.read()
        .success(function(response) {
            $scope.model.preferredName = response.preferredName || lpCoreUtils.capitalize($scope.model.username);
            $scope.model.photo = response.photoData || util.decodePhotoUrl(response.photoUrl);
        })
        .error(function() {
            $scope.model.preferredName = lpCoreUtils.capitalize($scope.model.username);
        });

        $scope.logout = function() {
            LoginService.doLogout();
        };

        $scope.responsiveRules = [
            { max: 100, size: 'xs' },
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
