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
        name: 'widget-profile-preferences',
        title: 'Profile - Preferences'
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
        utils.getWidget(widget.title).then(function(res) {
            widget.chrome = res.chrome;
            widget.body = res.body;
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
	 * The value of username field
	 * @return {string}
	 */
	widget.profileName = function() {
		var parent = widget.body.element(by.model('control.preferredName.value'));
		return parent.element(by.model('model.text')).getAttribute('value');
	};
	/**
	 * The value of locale dropdown
	 * @return {string}
	 */
	widget.locale = function() {
		var el = widget.body.element(by.model('control.locale.value'));
		return el.getText();
	};
	/**
	 * The value of default view dropdown
	 * @return {string}
	 */
	widget.defaultView = function() {
		var el = widget.body.element(by.model('control.defaultView.value'));
		return el.getText();
	};
	/**
	 * The value of default account
	 * @return {string}
	 */
	widget.defaultAccount = function() {
		var el = widget.body.element(by.model('control.defaultAccount.value'));
		return el.getText();
	};
	/**
	 * The value of default balance
	 * @return {string}
	 */
	widget.defaultBalance = function() {
		var el = widget.body.element(by.model('control.preferredBalanceView.value'));
		return el.getText();
	};
	/**
	 * The value of categorization setting
	 * @return {string}
	 */
	widget.categorization = function() {
		var el = widget.body.element(by.model('control.pfm.value'));
		return el.getText();
	};
};
