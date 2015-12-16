define(function(require, exports, module) {
	'use strict';

	// @ngInject
	module.exports = function LoginCtrl($scope, $timeout, $window, lpFocus, lpCoreBus, lpUsersAuthentication, loginSteps, lpCoreStore, STEPS, STORE_LOGIN_ID) {
		var ctrl = this;
		// var userId = lpCoreStore.getItem(STORE_LOGIN_ID);

		ctrl.data = {};
		ctrl.locked = false;
		// if (userId) {
		// 	ctrl.data.username = userId;
		// 	ctrl.remember = !!userId;
		// }

		// Get device signature
		// TODO: implement method subscribeOnce in lpCoreBus
		lpCoreBus.subscribe('widget-device-dna:data:ready', function(data) {
			ctrl.data.deviceId = data.deviceId || '';
			//ctrl.data.deviceSignature = data.deviceSignature;
			// Listen when deviceId is ready from the initiate response
			$scope.$on('initiate-success', function(response) {
				var deviceId = response.deviceId || '';
				// Notify device dna widget that it can set deviceId in the cookie
				if (deviceId) {
					lpCoreBus.subscribe('widget-login-multifactor:status:security-check-success', function() {
						lpCoreBus.publish('widget-device-dna:device:ready', deviceId);
					});
				}
			});
		});

		// Register the controller as a step and the behavior
		loginSteps.addStep(STEPS.LOGIN, {
			onShow: function() {
				lpFocus('username');
			},
			onHide: function() {
				ctrl.hasFocus = false;
				ctrl.resetFields();
				$scope.$emit('error-clean');
			}
		});

		ctrl.validate = function(event) {
			// console.log('Validate credentials against backend service');
		};

		ctrl.submit = function() {
			$scope.$emit('start-loading');
			$scope.$emit('error-clean');

			// if (ctrl.remember)
			// 	lpCoreStore.setItem(STORE_LOGIN_ID, ctrl.data.username);
			// else
			// 	lpCoreStore.removeItem(STORE_LOGIN_ID);

			lpUsersAuthentication.initiate(ctrl.data)
			.then(function(initiateResponse) { // Success
				$scope.$emit('initiate-success', initiateResponse);
				if (lpUsersAuthentication.isInitiated()) {
					$scope.$emit('stop-loading');
					loginSteps.next();
				}
				else if (lpUsersAuthentication.isVerified()) {
					lpUsersAuthentication.securityCheck()
					.then(function(response) {
						lpCoreBus.publish('widget-login-multifactor:status:security-check-success');
						lpUsersAuthentication.handleVerifiedResponse(response);
					},
					function(securityCheckError) { // Error
						$scope.$emit('stop-loading');
						$scope.$emit('error', securityCheckError);
					});
				}
			}, function(initiateError) { // Error
				if (initiateError.code === lpUsersAuthentication.ERROR_CODE.MAX_ATTEMPTS_EXCEEDED) {
					ctrl.showMaxAttemptsExceeded();
				}
				$scope.$emit('stop-loading');
				$scope.$emit('error', initiateError);
			});
		};

		ctrl.showMaxAttemptsExceeded = function() {
			ctrl.locked = true;
		};

		ctrl.resetFields = function() {
			// var id = lpCoreStore.getItem(STORE_LOGIN_ID);

			ctrl.data.username = '';
			ctrl.data.password = null;
		};
	};
});
