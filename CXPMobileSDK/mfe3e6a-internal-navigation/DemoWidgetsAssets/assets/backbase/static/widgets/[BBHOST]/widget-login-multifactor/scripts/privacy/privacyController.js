define(function(require, exports, module) {
	'use strict';

	// @ngInject
	module.exports = function PrivacyCtrl($scope, $window, lpCoreBus, lpUsersAuthentication, loginSteps, STEPS) {
		var ctrl = this;

		loginSteps.addStep(STEPS.PRIVACY, {
			next: function() {
				if (lpUsersAuthentication.isVerified()) {
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
			}
		});

		ctrl.data = {
			privacy: 'public'
		};

		ctrl.submit = function() {
			$scope.$emit('error-clean');
			// Call service
			loginSteps.next();
		};
	};
});
