define(function (require, exports) {
    'use strict';

    // @ngInject
    exports.LoginController = function($scope, i18nUtils, lpCoreUtils, lpWidget, LoginService) {
        var widget = lpWidget;
        var utils = lpCoreUtils;
        var stored = LoginService.getStoredData();

        i18nUtils.loadMessages(widget).success(function(bundle) {
            $scope.messages = bundle.messages;
        });

		$scope.user = {};

        if (!utils.isNull(stored)) {
            utils.extend($scope.user, {
                id: stored,
                remember: true
            });
        }

        $scope.allowSubmit = function() {
            return $scope.user.id;
        };

        $scope.doLogin = function() {
            $scope.$broadcast('autofill:update');

            LoginService.doLogin($scope.user.id, $scope.user.password, $scope.user.remember).then(function(data) {
                // Always assign error from service to our scope, so it can be visible
                if (LoginService.error) {
                    $scope.error = $scope.messages[LoginService.error] || LoginService.error;
                }
            });
        };

        widget.addEventListener('preferencesSaved', function () {
            widget.refreshHTML();
        });

    };
});
