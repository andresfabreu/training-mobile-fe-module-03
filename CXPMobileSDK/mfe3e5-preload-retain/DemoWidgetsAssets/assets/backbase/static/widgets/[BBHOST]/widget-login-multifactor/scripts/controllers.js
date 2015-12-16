/**
 * Controllers
 * @module controllers
 */
define(function(require, exports) {
    'use strict';

    // @ngInject
    exports.MainCtrl = function MainCtrl($scope, $timeout, lpCoreUtils, loginSteps) {
        var ctrl = this;

        ctrl.steps = loginSteps.steps;

        $scope.$on('start-loading', function() {
            ctrl.loading = true;
        });

        $scope.$on('stop-loading', function() {
            ctrl.loading = false;
        });

        // Handle errors raised by the inner controllers
        $scope.$on('error', function(event, err) {
            $timeout(function() {
                ctrl.errorMessage = err.message;
            });
        });

        $scope.$on('error-clean', function(event) {
            $timeout(function() {
                ctrl.errorMessage = null;
            });
        });
    };

    exports.LoginCtrl = require('./login/loginController');
    exports.OtpCtrl = require('./otp/otpController');
    exports.PrivacyCtrl = require('./privacy/privacyController');
});
