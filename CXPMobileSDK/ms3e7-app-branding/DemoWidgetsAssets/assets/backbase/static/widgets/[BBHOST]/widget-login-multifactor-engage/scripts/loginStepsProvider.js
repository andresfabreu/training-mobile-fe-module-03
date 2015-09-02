define( function (require, exports, module) {
	'use strict';

	// @ngInject
	module.exports = function loginStepsProvider(lpCoreUtils) {
		var currentStep;
		var routes = {};
		var DEFAULT_STEP = {
			shown: false,
			onShow: null,
			onHide: null,
			back: null,
			next: null
		};

		/**
		 * Configure what step should be shown first
		 * @param {string} currentStep Step identifier
		 */
		this.setInitialStep = function(step) {
			currentStep = step;
		};

		this.setRoutes = function(routesOpt) {
			lpCoreUtils.extend(routes, routesOpt);
		};

		// @ngInject
		this.$get = function($timeout) {
			var API = {};
			/** @type {Object} Store all the steps configuration */
			API.steps = {};

			/**
			 * Display the `step`
			 * @param  {string} step Step identifier
			 */
			function showStep(step) {
				if (!step.shown && lpCoreUtils.isFunction(step.onShow)){
					step.onShow();
				}

				step.shown = true;
			}

			/**
			 * Hides the `step`
			 * @param  {string} step Step identifier
			 */
			function hideStep(step) {
				if (step.shown && lpCoreUtils.isFunction(step.onHide)){
					step.onHide();
				}

				step.shown = false;
			}

			/**
			 * Creates a new step entry and configure it
			 * @param {string} step    Step identifier
			 * @param {Object} options Step configuration
			 * @param {Boolean} options.shown Flag to indicate if it is displayed
			 * @param {function} options.onShow Handler that will be executed when the step is shown
			 * @param {function} options.onHide Handler that will be executed when the step is hidden
			 * @param {string|function} options.back Action or step to go backward
			 * @param {string|function} options.next Action or step to go forward
			 */
			API.addStep = function(step, options) {
				if (!step){
					throw new Error('You must provide an id for the step');
				}

				this.steps[step] = lpCoreUtils.extend({}, DEFAULT_STEP);

				if (routes.hasOwnProperty(step)) {
					lpCoreUtils.extend(this.steps[step], routes[step], options);
				}
				else {
					lpCoreUtils.extend(this.steps[step], options);
				}
			};

			/**
			 * Moves to the next step or executes the next action
			 */
			API.next = function() {
				var next = this.steps[currentStep].next;
				if (lpCoreUtils.isFunction(next)) {
					next();
					return;
				}
				this.to(next);
			};

			/**
			 * Go back one step before or execute the back action
			 */
			API.back = function() {
				var back = this.steps[currentStep].back;
				if (lpCoreUtils.isFunction(back)) {
					back();
					return;
				}
				this.to(back);
			};

			/**
			 * Move directly to one step
			 * @param  {string} step Step identifier
			 */
			API.to = function(step) {
				currentStep = step;
				lpCoreUtils.forEach(this.steps, hideStep);
				showStep(this.steps[currentStep]);
			};

			/**
			 * Returns the current visible step
			 */
			API.getCurrent = function() {
				return currentStep;
			};

			/**
			 * Change the step configuration  on the fly
			 * @param {string} step   Step identifier
			 * @param {object} values Attributes to upate
			 */
			API.setValues = function(step, values) {
				lpCoreUtils.extend(this.steps[step], values);
			};

			/**
			 * Start the step navigation
			 */
			API.initialize = function() {
				$timeout(function() {
					showStep(API.steps[currentStep]);
				});
				API.initialize = lpCoreUtils.noop;
			};

			return API;
		};
	};
});
