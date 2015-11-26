/**
 * Config
 * @module config
 */
define(function (require, exports, module) {
	'use strict';

	// @ngInject
	module.exports = function (lpCoreUtils, lpCoreTemplateProvider, loginStepsProvider, STEPS) {

		var stepsRoutes = {};

		// Configure Login Steps
		stepsRoutes[STEPS.LOGIN] = {
			back: null,
			next: STEPS.OTP
		};
		stepsRoutes[STEPS.OTP] = {
			back: STEPS.LOGIN,
			next: STEPS.PRIVACY
		};
		stepsRoutes[STEPS.PRIVACY] = {
			back: null,
			next: null
		};
		loginStepsProvider.setInitialStep(STEPS.LOGIN);
		loginStepsProvider.setRoutes(stepsRoutes);

	};
});
