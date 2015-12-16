/* eslint-disable*/
/**
 * <p>Launchpad responsive library, allows you to apply responsive behaviors to widgets and other DOM element by
 * applying CSS media query style rules to an HTML element.
 *
 * <p>This module is packaged as an AMD module, and should be include using the <i>define</i> syntax.
 *
 * @module responsive
 * @exports Responsive
 * @author philip@backbase.com, nikos@backbase.com
 * @copyright Backbase B.V, 2013
 *
 * @example
 * //Changing the inner html of a widget based on its size:
 *
 * //amd define imports the responsive module
 * define('launchpad/lib/responsive', function(responsive) {
 *
 *   //Enable a dom element (the widget body) as responsive
 *   var responsive = Responsive.enable(widget.body);
 *
 *   //chain a set of rules
 *   responsive
 *     .rule({
 *       'max-width': 100,
 *       then: function(e) {
 *         widget.body.innerHTML('&lt;p&gt;Small widget&lt;/p>');
 *       }
 *     }).rule({
 *       'min-width': 101,
 *       'max-width' 500,
 *       then: function(e) {
 *         widget.body.innerHTML('&lt;p&gt;Medium widget&lt;/p&gt;');
 *       }
 *    }).rule({
 *       'min-width': 501  ,
 *       then: function(e) {
 *         widget.body.innerHTML('&lt;p&gt;Large widget&lt;/p&gt;');
 *       }
 *   });
 *
 * });
 */
define(function(require, exports, module) {

	'use strict';

	var jQuery = window.jQuery;

	/**
	 * How often should the element be polled to check for a size change
	 * @const
	 * @type {number}
	 */
	var DEFAULT_SIZE_CHECK_INTERVAL = 150;

	/**
	 * Return if an element is visible.
	 *
	 * @param {DomElemetn} element
	 * @return bool
	 */
	var _isVisible = function(element) {
		if (jQuery) {
			return jQuery(element).is(':visible');
		}
		else if (element[0]) {
			// Native element is visible.
			return (element[0].offsetParent === null);
		}
	};

	/**
	 * Return element width.
	 *
	 * @param {DomElemetn} element
	 * @return int
	 */
	var _elementWidth = function(element) {
		if (jQuery) {
			return jQuery(element).width();
		}
		else if (element[0]) {
			// Native element width.
			return element[0].offsetWidth;
		}
	};

	/**
	 * Constructs a new Responsive instance which monitors the given html element and fires callbacks associated with
	 * rules if a rule's media query matches the html element's width
	 *
	 * @constructor
	 * @alias module:responsive
	 * @private
	 * @param {Object} element  An html element to monitor for size changes
	 */
	var Responsive = function(element) {

		this.element = element;
		this.checkSizeInterval = DEFAULT_SIZE_CHECK_INTERVAL;
		this.rules = [];
		this.lastWidth = 0;

		//when new rules are added this is true
		this.forceCheck = false;
	};

	/**
	 * Stop polling the this responsive instance's dom node for size changes
	 *
	 * @return {Object} Responsive
	 */
	Responsive.prototype.stop = function () {

		window.clearTimeout(this.checkSizeTimeout);
		return this;
	};

	/**
	 * Start/resume polling. (Polling starts automatically). Only use this if you have manually stopped polling
	 *
	 * @return {Object} Responsive
	 */
	Responsive.prototype.start = function () {

		this._checkForSizeChange();
		return this;
	};

	/**
	 * Adds a new rule to this responsive object
	 * A rule object may contain min width and/or max width properties and a callback function <i>then</i>. The <i>then</i>
	 * function will be invoked when it the becomes active with an event parameter which contains one
	 * property, the current width.
	 *
	 * @param {Object} rule A responsive rule object
	 *
	 * @returns {Responsive} The responsive object to allow chaining
	 */
	Responsive.prototype.rule = function(rule) {

		//convert to camel case for internal use
		if('min-width' in rule) {
			rule.minWidth = rule['min-width'];
		}
		if('max-width' in rule) {
			rule.maxWidth = rule['max-width'];
		}

		//parse values
		rule.minWidth = parseInt(rule.minWidth, 10);
		rule.maxWidth = parseInt(rule.maxWidth, 10);

		//don't add an empty rule
		//probably need some kind of console warning here
		if(typeof rule.minWidth === 'number' || typeof rule.maxWidth === 'number') {
			//default active
			rule.active = false;

			//add to rules array
			this.rules.push(rule);

			//forces the check interval to check for changes if a new rule has been added
			this.forceCheck = true;
		}

		// Do one time check when a new rule is added
		this._hasSizeChanged();

		return this;
	};

	/**
	 * The given callback function will be called whenever any rule is triggered
	 * @param {Function} callback A callback function, when invoked it will be passed an event argument containing details
	 *                          of the size change
	 *
	 */
	Responsive.prototype.any = function(callback) {

		this.anyFn = callback;
		return this;
	};

	/**
	 * The given callback function will be called whenever the element's width changes
	 * @param {Function} callback A callback function, when invoked it will be passed an event argument containing details
	 *                          of the size change
	 *
	 */
	Responsive.prototype.resize = function(callback) {

		this.resize = callback;
		return this;
	};

	/**
	 * Polling for detecting size changes
	 * @private
	 * @return {Object} Responsive
	 */
	Responsive.prototype._checkForSizeChange = function () {

		var self = this;

		//poll width for changes
		this.checkSizeTimeout = window.setTimeout(function() {
			self._hasSizeChanged();
			self._checkForSizeChange();
		}, this.checkSizeInterval);

		return this;
	};


	/**
	 * Check if size has changed
	 * @private
	 * @return {Object} Responsive
	 */
	Responsive.prototype._hasSizeChanged = function () {
		var newWidth = this._isWidthChanged();
		if(newWidth > 0) {
			this._checkRules(newWidth);
			if(typeof this.resize === 'function') {
				this.resize.call(this.element, {
					width: newWidth
				});
			}
		}

		return this;
	};

	/**
	 * If the size has changed returns the new width, otherwise returns 0
	 *
	 * @private
	 * @return {Number}
	 */
	Responsive.prototype._isWidthChanged = function () {

		var width = _elementWidth(this.element);

		var sizeChanged = (width !== this.lastWidth) && _isVisible(this.element);
		if(sizeChanged || this.forceCheck) {
			this.lastWidth = width;
			return width;
		} else {
			return 0;
		}
	};

	/**
	 * Iterates through the registered rules looking for inactive rules with media queries which match the current
	 * width
	 * @private
	 */
	Responsive.prototype._checkRules = function(width) {

		var self = this;
		var i, rule, len = this.rules.length;
		for(i = 0; i < len; i++) {
			rule = this.rules[i];
			var match =
				(!rule.minWidth || (rule.minWidth && width >= rule.minWidth)) &&
				(!rule.maxWidth || (rule.maxWidth && width <= rule.maxWidth));

			if(match && !rule.active) {
				var e = {
					width: width
				};

				if(typeof rule.then === 'function') {
					rule.then.call(this.element, e);
				}
				if(typeof self.anyFn === 'function') {
					self.anyFn.call(this.element, e);
				}
			}
			rule.active = match;
		}
	};

	/**
	 * Factory function which enables responsive behavior on a DOM element and returns a Responsive instance on which
	 * rules can be applied.
	 * @param element The DOM element to monitor for size changes
	 * @returns {Responsive} A responsive instance object
	 */
	Responsive.enable = function (element) {
		var responsive = new Responsive(element);
		responsive.start();
		return responsive;
	};

	// export
	module.exports = Responsive;

	// export to window for springboard (TODO: Refactor springboard).
	window.lp = window.lp || {};
	window.lp.responsive = Responsive;
});
