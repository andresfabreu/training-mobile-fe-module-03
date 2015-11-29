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
		name: 'widget-profile-contact',
		title: 'Profile - Contact'
	};

	var widget = this;

	widget.name = config.name;
	widget.title = config.title;

	/**
	 * Test elements
	 */
	widget.body = utils.getWidgetElement(config);
	widget.address = widget.body.element(by.css('div[ng-model="control.address.value"]'));
	widget.addressInput = widget.address.element(by.css('input[ng-model="model.text"]'));
	widget.addressChangeLink = widget.body.element(by.css('a[ng-href="/address/change"]'));

	widget.phone = widget.body.element(by.css('div[ng-model="control.phoneNumber.value"]'));
	widget.phoneInput = widget.phone.element(by.css('input[ng-model="model.text"]'));
	widget.phoneEditBtn = widget.phone.element(by.css('span'));
	widget.phoneEditInput = widget.phone.element(by.css('div[ng-show="editting"] input'));
	widget.phoneSaveBtn = widget.phone.element(by.css('div[ng-show="editting"] button[ng-click="save(model.value)"]'));
	widget.phoneErrorMessage = widget.body.element(by.css('div[errors="control.phoneNumber.errors"] .text-danger small'));

	widget.email = widget.body.element(by.css('div[ng-model="control.emailAddress.value"]'));
	widget.emailInput = widget.email.element(by.css('input[ng-model="model.text"]'));
	widget.emailEditBtn = widget.email.element(by.css('span'));
	widget.emailEditInput = widget.email.element(by.css('div[ng-show="editting"] input'));
	widget.emailSaveBtn = widget.email.element(by.css('div[ng-show="editting"] button[ng-click="save(model.value)"]'));
	widget.emailErrorMessage = widget.body.element(by.css('div[errors="control.emailAddress.errors"] .text-danger small'));

	/**
	 * Wait For Widget To be Loaded
	 */
	widget.waitForWidgetToLoad = function() {
		utils.waitForElement(widget.email);
	};

	/**
	 * Get address input value
	 */
	widget.getAddress = function() {
		return widget.addressInput.getAttribute('value');
	};

	/**
	 * Check if address input is read only
	 */
	widget.isAddressReadonly = function() {
		return widget.addressInput.getAttribute('readonly');
	};

	/**
	 * Check Request address changes link visibility
	 */
	widget.addressChageLinkIsVisible = function() {
		return widget.addressChangeLink.isDisplayed();
	};

	/**
	 * Get phone input value
	 */
	widget.getPhone = function() {
		return widget.phoneInput.getAttribute('value');
	};

	/**
	 * Set phone input value
	 */
	widget.setPhone = function(value) {
		utils.click(widget.phoneEditBtn);
		widget.phoneEditInput.clear();
		widget.phoneEditInput.sendKeys(value);
	};

	/**
	 * Click phone save button
	 */
	widget.savePhone = function() {
		utils.click(widget.phoneSaveBtn);
	};

	/**
	 * Check phone error message visibility
	 */
	widget.phoneErrorMessageIsVisible = function() {
		return widget.phoneErrorMessage.isDisplayed();
	};

	/**
	 * Get email input value
	 */
	widget.getEmail = function() {
		return widget.emailInput.getAttribute('value');
	};

	/**
	 * Set email input value
	 */
	widget.setEmail = function(value) {
		utils.click(widget.emailEditBtn);
		widget.emailEditInput.clear();
		widget.emailEditInput.sendKeys(value);
	};

	/**
	 * Click email save button
	 */
	widget.saveEmail = function() {
		utils.click(widget.emailSaveBtn);
	};

	/**
	 * Check email error message visibility
	 */
	widget.emailErrorMessageIsVisible = function() {
		return widget.emailErrorMessage.isDisplayed();
	};
};



