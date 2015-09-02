define(function(require, exports, module) {
	'use strict';

	// @ngInject
	module.exports = function PrivacyCtrl($scope, $window, loginSteps, STEPS) {
		var ctrl = this;

		loginSteps.addStep(STEPS.PRIVACY, {
			next: function() {
				$window.location.replace($window.location.href);
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
