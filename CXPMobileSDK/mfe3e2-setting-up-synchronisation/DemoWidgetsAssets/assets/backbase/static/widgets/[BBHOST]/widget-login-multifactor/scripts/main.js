/**
 * @module widget-login-multifactor
 * @version 1.0.0
 * @file lp-widget-login-multifactor description
 * @copyright Backbase Amsterdam
 * @requires module:lp/base
 * @requires module:lp/resources/core
 * @requires module:lp/resources/ui
 * @requires module:lp/resources/user
 * @requires interact
 *
 * @example Require Widget
 * // add this in the index.html
 * window.requireWidget( __WIDGET__ ,'scripts/index');
 */

define( function (require, exports, module) {

	'use strict';

	module.name = 'widget-login-multifactor';

	/**
	 * Dependencies
	 */
	var base = require('base');
	var core = require('core');
	var ui = require('ui');
	var user = require('module-users');

	var deps = [
		core.name,
		user.name,
		ui.name
	];

	// @ngInject
	function run(loginSteps, lpWidget, lpCoreUtils, lpUsersAuthentication, lpCoreError) {
		try {
			var prefixSessionUrl = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('prefixSessionUrl'));
			lpUsersAuthentication.setConfig({
				initiateEndPoint: prefixSessionUrl + lpWidget.getPreference('initiateEndPoint'),
				otpEndPoint: prefixSessionUrl + lpWidget.getPreference('otpEndPoint'),
				serverRootPath: lpCoreUtils.getPortalProperty('serverRoot'),
				portalName: lpCoreUtils.getPortalProperty('portalName'),
				pageName: lpCoreUtils.getPortalProperty('pageName')
			});

			loginSteps.initialize();
		} catch(e) {
			lpCoreError.captureException(e);
		}

	}

	module.exports = base.createModule(module.name, deps)
		.constant(require('./constants'))
		.provider('loginSteps', require('./loginStepsProvider'))
		.config(require('./config'))
		.controller(require('./controllers'))
		.run(run);
});
