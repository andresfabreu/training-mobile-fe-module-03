define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.ProfileDetailsCtrl = function($scope, lpWidget, ProfileDetailsService) {

        var initialize = function() {
            $scope.title = lpWidget.getPreference('title');
            ProfileDetailsService.getData().success(function(response) {
                $scope.profile = ProfileDetailsService.formatResponse(response);
            });
        };

        lpWidget.addEventListener('preferencesSaved', function () {
            lpWidget.refreshHTML();
            $scope.$apply(function() {
                initialize();
            });
        });

        initialize();
    };
});
