define(function(require, exports, module) {
    'use strict';

    // @ngInject
    module.exports = function OtpCtrl($scope, $timeout, lpCoreBus, lpUsersAuthentication, lpFocus, loginSteps, STEPS, lpCoreI18n, lpWidget) {
        var ctrl = this;
        var timerSeconds;
        var timerHideSeconds;

        ctrl.data = {};

        try {
            timerSeconds = parseInt(lpWidget.getPreference('timerSeconds'), 10);
        } catch(err) {
            timerSeconds = 60;
        }

        try {
            timerHideSeconds = parseInt(lpWidget.getPreference('timerHideSeconds'), 10);
        } catch(err) {
            timerHideSeconds = 0;
        }

        ctrl.timerSeconds = timerSeconds * 1000;
        ctrl.timerHideSeconds = timerHideSeconds * 1000;
        ctrl.timerShown = ctrl.timerSeconds && !ctrl.timerHideSeconds;
        ctrl.countdownSeconds = ctrl.timerSeconds - ctrl.timerHideSeconds;

        loginSteps.addStep(STEPS.OTP, {
            onShow: function() {
                lpFocus('otp');
                if (ctrl.timerSeconds) {
                    $scope.$broadcast('timer-run');
                }
            },
            onHide: function() {
                ctrl.resetFields();
            }
        });

        ctrl.submit = function() {
            $scope.$emit('error-clean');

            if (/^\d+$/.test(ctrl.data.otpcode) === false) {
                $scope.$emit('error', {
                    message: 'Code must contain only digits'
                });
                return;
            }

            if (ctrl.timerSeconds) {
                $scope.$broadcast('timer-pause');
            }
            $scope.$emit('start-loading');

            lpUsersAuthentication.verifyOTP({ otpCode: ctrl.data.otpcode })
                .then(function(response) { // Success
                    if (lpUsersAuthentication.isVerified()) {
                        lpUsersAuthentication.securityCheck()
                            .then(function(securityCheckResponse) { // Success
                                lpCoreBus.publish('widget-login-multifactor:status:security-check-success');
                                lpUsersAuthentication.handleVerifiedResponse(securityCheckResponse);
                                lpCoreBus.publish('login-success');
                                $scope.$emit('stop-loading');
                                // In case you want to go to privacy step instead of to the home
                                // loginSteps.next();
                            }, function(securityCheckError) { // Error
                                $scope.$emit('error', securityCheckError);
                                $scope.$emit('stop-loading');
                            });
                    }
                }, function(error) { // Error
                    if (ctrl.timerSeconds) {
                        $scope.$broadcast('timer-resume');
                    }
                    $scope.$emit('error', error);
                    $scope.$emit('stop-loading');
                });
        };

        ctrl.cancel = function() {
            loginSteps.back();
        };

        ctrl.retry = function() {
            // Call service
            ctrl.resetFields();
            lpFocus('otp');
            if (ctrl.timerSeconds) {
                $scope.$broadcast('timer-run');
            }
        };

        ctrl.countdownStart = function() {
            ctrl.timerShown = true;
        };

        ctrl.finish = function(msg) {
            $timeout(function() {
                ctrl.timeExpired = true;
                $scope.$emit('error', {
                    message: 'Time has expired'
                });
            }, 200);
        };

        ctrl.resetFields = function() {
            ctrl.data.otpcode = null;
            if (ctrl.timerSeconds) {
                ctrl.timeExpired = false;
                ctrl.timerShown = !ctrl.timerHideSeconds;
                $scope.$broadcast('timer-reset');
            }
            $scope.$emit('error-clean');
        };

        ctrl.toggleInfoMessage = function() {
            ctrl.displayInfoMessage = !ctrl.displayInfoMessage;
        };
    };
});
