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
			title: 'Login - Multifactor New'
		};

	var widget = this;

	widget.name = config.name;
	widget.title = config.title;

	/**
	 * Test elements
	 */
	widget.body = utils.getWidgetElement(config);
	widget.username = widget.body.element(by.css('.js-login-username input'));
	widget.password = widget.body.element(by.css('[type="password"]'));
	widget.loginBtn = widget.body.element(by.css('[ng-submit="loginCtrl.submit()"] [type="submit"]'));
	widget.errorMsg = widget.body.element(by.css('.alert-warning span.ng-scope'));

	/**
	 * Wait For Widget To be Loaded
	 */
	widget.waitForWidgetToLoad = function() {
		utils.waitForElement(widget.loginBtn);
	};

	/**
	 * Get Login Button State
	 */
	widget.getLoginBtnState = function() {
		return widget.loginBtn.getAttribute('disabled');
	};

	/**
	 * Login with credentials
	 */
	widget.login = function(username, password) {
		utils.sendKeys(widget.username, username);
		utils.sendKeys(widget.password, password);
		utils.click(widget.loginBtn);
	};

	/**
	 * Get error message
	 */
	widget.getErrorMessage = function() {
		utils.waitForElement(widget.errorMsg);
		return widget.errorMsg.getText();
	};

	/**
	 * Check error message
	 */
	widget.checkErrorMessage = function(message) {
		utils.waitForElement(widget.errorMsg);
		utils.waitForElementToContainText(widget.errorMsg, message);
	};

};
