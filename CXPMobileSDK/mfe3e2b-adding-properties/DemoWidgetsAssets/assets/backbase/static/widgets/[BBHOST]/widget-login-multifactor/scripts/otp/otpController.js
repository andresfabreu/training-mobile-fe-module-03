define(function(require, exports, module) {
	'use strict';

	// @ngInject
	module.exports = function OtpCtrl($scope, $timeout, lpCoreBus, lpUsersAuthentication, lpFocus, loginSteps, STEPS, lpCoreI18n) {
		var ctrl = this;
		ctrl.data = {};

		loginSteps.addStep(STEPS.OTP, {
			onShow: function() {
				lpFocus('otp');
				$scope.$broadcast('timer-run');
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

			$scope.$broadcast('timer-pause');
			$scope.$emit('start-loading');

			lpUsersAuthentication.verifyOTP({
				otpCode: ctrl.data.otpcode
			})
			.then(function(response) { // Success
				if (lpUsersAuthentication.isVerified()) {
					lpUsersAuthentication.securityCheck()
					.then(function(securityCheckResponse) { // Success
						lpCoreBus.publish('widget-login-multifactor:status:security-check-success');
						loginSteps.next();
					}, function(securityCheckError) { // Error
						$scope.$emit('error', securityCheckError);
					})
					['finally'](function() {
						$scope.$emit('stop-loading');
					});
				}
			}, function(error) { // Error
				$scope.$broadcast('timer-resume');
				$scope.$emit('error', error);
			})
			['finally'](function() {
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
			$scope.$broadcast('timer-run');
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
			ctrl.timeExpired = false;
			$scope.$broadcast('timer-reset');
			$scope.$emit('error-clean');
		};
	};
});
