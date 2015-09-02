/**
*  ----------------------------------------------------------------
*  Copyright © Backbase B.V.
*  ----------------------------------------------------------------
*  Author : Backbase R&D - Amsterdam - New York
*/

'use strict';

var utils = global.utils;

module.exports = function(config) {

	config = config || {
		name: 'widget-login-multifactor',
		title: 'Login - Multifactor'
	};

	var widget = this;

	widget.name = config.name;
	widget.title = config.title;

	/**
	* Prepare all elements
	* @return {promise} Return widget.elements
	*/
	widget.get = function() {
		var d = utils.q.defer();
		utils.getWidget(widget).then(function(res) {
			widget.chrome = res.chrome;
			widget.body = res.body;
			widget.username = widget.body.element(by.css('.js-login-username .form-group'))
								.element(by.css('[type="text"]'));
			widget.password = widget.body.element(by.css('[type="password"]'));
			widget.loginBtn = widget.body.element(by.css('.lp__login-button'));
			d.resolve(widget);
		});
		return d.promise;
	};

	/**
	* The widget should be visible on the page
	* @return {Boolean}
	*/
	widget.isVisible = function() {
		return widget.body.isDisplayed();
	};
	/**
	 * Login
	 * @description Login with credentials
	 */
	widget.login = function(username, password) {
		// widget.username.clear();
		// widget.password.clear();
		widget.username.sendKeys(username || '');
		widget.password.sendKeys(password || '');
		// browser.actions().mouseMove(widget.loginBtn).click();
		widget.loginBtn.click();
	};
};
