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
		name: 'widget-profile-summary',
		title: 'Profile - Summary'
	};

	var widget = this;

	widget.name = config.name;
	widget.title = config.title;

	/**
	 * Test elements
	 */
	widget.body = utils.getWidgetElement(config);
	widget.usernameLink = widget.body.element(by.css('.lp-profile-summary-username'));
	widget.viewProfileLink = widget.body.element(by.css('div[ng-if="profileLink"] button'));
	widget.loggedUsername = widget.usernameLink.element(by.css('span'));
	widget.logoutLink = widget.body.element(by.css('.lp-icon-icon-logout'));
	widget.userPhoto = widget.body.element(by.css('.media img'));
	widget.profileWidget = element(by.css('h3.widget-title span[data-lp-i18n="Profile"]'));
	widget.profileWidgetCloseButton = element(by.css('button[aria-label="close Profile"'));

	/**
	 * Wait For Widget To be Loaded
	 */
	widget.waitForWidgetToLoad = function() {
		utils.waitForElement(widget.logoutLink);
	};

	/**
	 * Check Profile Widget visibility
	 */
	widget.profileWidgeIsVisible = function() {
		return widget.profileWidget.isDisplayed();
	};

	/**
	 * Click profile widget close button
	 */
	widget.clickCloseProfileWidget = function() {
		widget.profileWidgetCloseButton.click();
	};

	/**
	 * Check logged user name
	 */
	widget.checkUserName = function(name) {
		utils.waitForElement(widget.loggedUsername);
		utils.waitForElementToContainText(widget.loggedUsername, name);
	};

	/**
	 * Check user photo visibility
	 */
	widget.userPhotoIsVisible = function() {
		return widget.userPhoto.isDisplayed();
	};

	/**
	 * Click on Username Link
	 */
	widget.clickUserLink = function() {
		widget.usernameLink.click();
	};

	/**
	 * Click on View Profile Link
	 */
	widget.clickProfileLink = function() {
		widget.viewProfileLink.click();
	};

	/**
	 * Click on Logout link
	 */
	widget.logout = function() {
		widget.logoutLink.click();
	};

	/**
	 * Check Logout Button visibility
	 */
	widget.logoutIsVisible = function() {
		return widget.logoutLink.isDisplayed();
	};
};
