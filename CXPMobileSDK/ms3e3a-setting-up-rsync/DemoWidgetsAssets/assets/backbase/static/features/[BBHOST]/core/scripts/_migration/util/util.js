/*----------------------------------------------------------------*/
/* DEPRECATED LIB will be removed in LP-0.13.x version line
/*----------------------------------------------------------------*/
/**
 * These utilities methods are moved into more specific modules
 */
(function(window, $) {

	"use strict";

	/**
	 * Launchpad utility functions
	 *
	 * @exports util
	 * @alias lp.util
	 * @author philip@backbase.com
	 * @copyright Backbase B.V, 2013
	 *
	 * @example
	 * lp.util.isSmartphone();
	 */
	var util = {};
	var lp = window.lp;

	/**
	 * <p>Returns true if:
	 * <ol>
	 *  <li>the value is a boolean and true<br>
	 *  <li>the value is a number and not 0<br>
	 *  <li>the value is a string and equal to 'true' (after trimming and ignoring case)
	 * </ol>
	 * @memberOf util
	 * @param   {*}       val  The value to parse
	 * @returns {Boolean}      A boolean value depending on the parsing result
	 */
	util.parseBoolean = function(val) {

		return (typeof val === "boolean" && val) ||
			(typeof val === "string" && /\s*true\s*/i.test(val)) ||
			(typeof val === "number" && val !== 0);
	};

	var bgImages = {};

	/**
	 * Allows a widget or container to indirectly set the background image of a page
	 * @param {String} imageSrc
	 */
	util.setPageBackground = function(imageSrc) {

		var $main = $("#main");
		var $bg = bgImages[imageSrc];
		if(!$bg) {
			$bg = $("<div class=lp-full-bg />").css("background-image", "url(" + imageSrc + ")");
			$main.prepend($bg);
			bgImages[imageSrc] = $bg;
		}
		var $otherBgs = $main.children(".lp-full-bg").not($bg);
		$otherBgs.fadeOut(1000);
		$bg.fadeIn($otherBgs.length === 0 ? 0 : 1000);
	};

	util.showBackdrop = function(fadeDuration) {
		fadeDuration = fadeDuration || 200;
		$("#lp-page-backdrop").fadeTo(fadeDuration, 0.5);
	};

	util.hideBackdrop = function(fadeDuration) {
		fadeDuration = fadeDuration || 200;
		$("#lp-page-backdrop").fadeOut(fadeDuration);
	};

	/**
	 * Returns true if the portal is running in design mode
	 * @returns {Boolean}
	 */
	util.isDesignMode = function() {
		return util.parseBoolean(bd.designMode);
	};

	/**
	 * Returns true if currently running in the Widget Workbench
	 * Useful for determining if
	 * @returns {Boolean}
	 */
	util.localStorageSupported = function() {
		//no storage in chrome apps/extensions
		var result;
		var testString = 'sessionStorage';

		// Check if sessionStorage is supported
		try {
			sessionStorage.setItem(testString, testString);
			sessionStorage.removeItem(testString);
			result = true;
		} catch(e) {
			result = false;
		}

		// Check if it's a chrome extension
		result = result && window.location.protocol !== "chrome-extension:";

		return result;
	};

	/**
	 * Safe way to get the context path
	 * @returns {*}
	 */
	util.getContextPath = function() {

		var contextPath = typeof b$ !== "undefined" ? b$.portal.config.serverRoot : "";
		return contextPath;
	};


	/**
	 * Safe way to get the context path
	 * @returns {*}
	 */
	util.getServicesPath = function() {

		var servicesPath;
		if(window.lp.servicesPath) {
			servicesPath = window.lp.servicesPath;
		} else {
			//Integration services path is not defined. Defaulting to portlserver context path
			servicesPath = util.getContextPath();
		}
		return servicesPath;
	};

	/**
	 * Returns true if the portal is not running on a tablet or a smartphone
	 * @returns {Boolean}
	 */
	util.isDesktop = function() {

		return !util.isTablet && !util.isSmartphone();
	};

	/**
	 * Returns true if the tablet is running on a table device
	 * @returns {Boolean}
	 */
	util.isTablet = function() {

		return $("html").hasClass("tablet");
	};

	/**
	 * Returns true if the tablet is running on a table device
	 * @returns {Boolean}
	 */
	util.isSmartphone = function() {

		return $("html").hasClass("smartphone");
	};

	util.getWidgetFromNode = function(widgetBody) {
		var widget = $(widgetBody).closest(".bp-widget")[0].viewController;
		return widget;
	};

	util.applyScope = function($scope) {
		if (!$scope.$$phase) {
			$scope.$apply();
		}
	};

	/**
	 * Convert RGB color code into HSL (hue saturation lightness)
	 * @returns {Object} HSL color object
	 */
	util.rgb2hsl = function() {
		var r = arguments[0] / 255,
			g = arguments[1] / 255,
			b = arguments[2] / 255;
		var max = Math.max(r, g, b),
			min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if(max === min){
			h = s = 0; // achromatic
		} else {
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max) {
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h = h / 6;
		}

		return {
			h: Math.round(h * 360),
			s: Math.round(s * 100),
			l: Math.round(l * 100)
		};
	};

	/**
	 * Uses the correct implementation of requestAnimationFrame,
	 * or uses setTimeout as a fallback.
	 *
	 * @param   {Function} fn The callback function to be called
	 * @returns Returns the requestAnimationFrame function result
	 */
	util.requestFrame = function(fn) {
		var raf = window.requestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			function(fn) { return window.setTimeout(fn, 20); };

		return raf(fn);
	};

	/**
	 * Function that cancels the requestAnimationFrame callback or it's setTimeout fallback.
	 *
	 * @param   {Object} id The id of the requestAnimationFrame to be canceled
	 * @returns Returns the cancelAnimationFrame function result
	 */
	util.cancelFrame = function(id) {
		var cancel = window.cancelAnimationFrame ||
			window.mozCancelAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.clearTimeout;

		return cancel(id);
	};

	/**
	 * TODO: remove it. function was only used in rest-services.js and moved there
	 *
	 * Replaces variables within a url. For example
	 *
	 * @example
	 * ${contextPath}/profile
	 * is merged with
	 * {
	 *    contextPath: "/portalserver"
	 * }
	 * and becomes /portalserver/profile
	 *
	 * @param url {String} A url possibly contain vars to replace
	 * @param urlVars {Object} Map of replacement vars
	 */
	util.replaceUrlVars = function(url, urlVars) {
		if(typeof url === "string") {
			for(var urlVar in urlVars) {
				if(urlVars.hasOwnProperty(urlVar)) {
					var urlVarRegexp = new RegExp("\\$\\(" + urlVar + "\\)", "g");
					url = url.replace(urlVarRegexp, urlVars[urlVar]);
				}
			}
		}

		return url;
	};

	util.findMatchingChildrenByTag = function(item, tagName) {

		var findChildrenTags = function(model){
			// Here we using childNodes if available and
			// _children if item did not loadChildren yet
			var children = model.childNodes && model.childNodes.length ? model.childNodes :
				model._children && model._children.length ? model._children : [];

			var hasOwnTag = (model.tags || []).filter(function(tag){
				return tag.type === "behavior" && tag.value === tagName;
			}).length;

			return hasOwnTag || children.length && children.filter(findChildrenTags).length;
		};

		var matchingChildren = item.childNodes.filter(function(child){
			return findChildrenTags(child.model);
		});


		return matchingChildren;
	};

	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#39;",
		"/": "&#x2F;"
	};

	util.escapeHtml = function(value) {
		if(typeof value === "string") {
			return value.replace(/[&<>"'\/]/g, function (s) {
				return entityMap[s];
			});
		} else {
			return value;
		}

	};

	util.stripHtml = function(value) {
		return typeof value === "string" ? value.replace(/[&<>"'\/]/g, "") : value;
	};

	util.generateUUID = function() {

		var d = new Date().getTime();
		var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d/16);
			return (c === "x" ? r : (r & 0x7 | 0x8)).toString(16);
		});
		return uuid;
	};


	util.setMasterPreference = function(name, value) {

		var page = b$.portal.portalView.getElementsByTagName("page")[0];

		//save locally
		page.setPreference(name, value);
		page.model.save();

		//save to server on master page (if any)
		var req = lp.restClient.makePutPageRequest({
			contextPath: b$.portal.config.serverRoot,
			name: page.model.extendedItemName || page.model.name,
			contextItemName: page.model.contextItemName,
			properties: [{
				name: name,
				type: "string",
				value: value
			}]
		});
		return lp.restClient.sendRequest(req.url, req.method, req.body);
	};

	util.extractInitials = function(name) {

		var initials = '';
		name = name.split(' ');

		for (var i = 0; i < name.length; i++) {
			initials += name[i].substr(0,1);
		}

		initials = initials.toUpperCase();
		return initials;

	};

	util.getColorFromInitials = function(initials) {

		var a = initials.charCodeAt(0) - 64;
		var x = a + 120;

		var i  = Math.floor((((a - 1)/(26 - 1)) * (5 - 1) + 1) - 1);
		var colors = [
			[ x, 210, 210 ],
			[ x, x, 210 ],
			[ 210, x, x ],
			[ x, 210, x ],
			[ 210, x, 210 ]
		];

		return colors[i];
	};


	// Temp HACK (to avoid path pains)
	util.defaultProfileImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABPCAIAAADz89W0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3MkVFRDI3OTJERUQxMUUzQkU4Qzk1MDlEQzAyMjFFNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3MkVFRDI3QTJERUQxMUUzQkU4Qzk1MDlEQzAyMjFFNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjcyRUVEMjc3MkRFRDExRTNCRThDOTUwOURDMDIyMUU0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjcyRUVEMjc4MkRFRDExRTNCRThDOTUwOURDMDIyMUU0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+gildPAAABRdJREFUeNrsmstKI0EUhicmRmO8IoKIgigoCoovIOhOX8m38RncuHWjG0HFjeAl4GWhoAvvUZPMZ/6ZQ9OtmUBa04OnFk2luqo9X51LnVMzqZWVlV8/qbX8+mHNgR3YgR3YgR3YgR3YgR3YgR3YgR3YgR3YgR3YgR3YgR34O1umkcWVSiX4M5VK2Yj6PDUt9Co6GPxI6MvB+U0GDlL9MZiWluBe6KkJ9iqI8RmDjVeq7cO/1TQN8wTm9fX16ekpn88/Pj5ms1kky+VyLy8vdMrlMoOtra100um0MWgLghj0mfD29mav+JnJZJKiYWuA9fb2jo2NiRYwhL64uIBf0k9NTTFHWyMY5kRtVX0msIqfPK+vr0ulUnRrmgyMHF1dXQsLCz09PYChlpubm7W1tbu7O2SFbXx8fGZmxpiZDwzToobKTwhZgmKfn5/Pz883NjaKxaJMo3FR0/Pz841/Ba0iGSSDg4MPDw/Ih27b29uPj495hbUXCoWRkRGELlYb5MDAzCv6etJ4xaD2BWzGh4aGmHl5eVnD4b8PWPpBFbK6q6ur0dFRlCxzbWtrw6sZ7OjoQNXIPTs7y2ScOVttTGCVvFTN+lI7P/kyP9k4vhkLc6NBCwmQiT76RLdbW1vLy8tyP8inp6dPT09RFHi49Pb29sDAgMyVJ+N0YI6eW6yFljkMEvyYw19pftCSQ0osheWTk5OjoyNCFLolgGHGc3Nzm5ubnZ2dbMf6+jquzvj7H85kbLOCja+xO4uLi2wWO4I5yMJjceBGMy3bcsRCOBnhzs7O/f09CmcvwJ6cnAQbWgi7u7vhyVcbVIxg1cxkOX1G6LM1eDLBWX4hS47LgWMAthiLuKgCJEx3b2+PETk2KsV1IZS7QmgeyxL5M5y5apO1M5lpds4rqicrtUS94gESZoAnJib6+/sBYBcI3ZiojqtQvik1auNub2+xDu2j3CRGS47fhzVCrEJRGCR+u7S0pIAE5/DwsDpRYEuniOe7u7vsnbKO1N8WL3MMufT74VZNIVAvHY4f/JDgjEoVYC0g84x+oVRt5WpjrX3zizTcaHloSlBKaJkjZ698WOoy3do0dfTKEmw6+DNPTbCWFA2HVC0DVpOtKsYyfnBwsL+/T4gyk+aVlC8kebuKEL1VREhWPRws8aIVrD15RWp9dnYGQyhpEZvgdUQpb5MXVAItKUHLXM4MW/KZKeotZ4/O3mipYGvVOITxZKUllmNGLxuar+HQ1QT6URqsA5noRVIZugOIOoX8glWazEdk2DF6ciZ2J7E8RC4qbPItKkTxh6wjeDeiJcQ50hVLM1G4YkGC6uEQsIWcYMWD6HaVESo8dKppnBGcWaFLsZrz2WJbEjUsEqvvTWl20RHKW2zQtsBuCKiZqCsPDw/tbiiJGpboxFskNjyJa5VgjSs73RCpzKbuJ9ksFApkMhYLkwgMGInx6uoqRZKUo6u5f2rJ/FlVhOqwvr6+GAumr9Kwkko0U7+UZtLsi2KVQoDcwbKUJPqwLiikIrmxyil5bG0N6zKEQlpHsZRsdwzJ1TAiIqhiDzmj7qssONVYq9ybtVKsrUpWLh2NQBDKaaVnRFc9XOdyqVp3l1aZJNSkLdlUTLYiIXjY1nm1EDx77QxL6DkcyoHr+QexaGYe7SRUw9EEu55z5bOFH36qaRcA/11zYAd2YAd2YAd2YAd2YAd2YAd2YAd24B/QMrH/J4qkA8f7Pyhcw+7DzW6/BRgAykJQPtOgddIAAAAASUVORK5CYII=";

	util.getDefaultProfileImage = function(name, width, height, color) {

		var canvas = document.createElement("canvas");

		if ( !canvas.getContext || !canvas.getContext('2d') ) {
			return util.defaultProfileImage;
		}

		var initials = util.extractInitials(name);
		color = color || util.getColorFromInitials(initials);

		canvas.setAttribute("width", width);
		canvas.setAttribute("height", height);
		var ctx = canvas.getContext("2d");

		ctx.fillStyle = $.isArray(color) ? "rgb(" + color.join(",") + ")" : color;
		ctx.fillRect (0, 0, width, height);

		ctx.fillStyle = "rgb(250,250,250)";

		var scale, marginRight;

		switch (initials.length) {
			case 1:
				scale = 0.6;
				marginRight = 4;
				break;

			case 2:
				scale = 0.5;
				marginRight = 3;
				break;

			case 3:
				scale = 0.45;
				marginRight = 2;
				break;

			default:
				scale = 0.3;
				marginRight = 0;
				break;
		}

		var fontSize = parseInt( scale * height, 10);
		var marginBottom = Math.floor( 0.15 * height);

		ctx.font = fontSize + "px Proxima Regular, Helvetica Nueue, Helvetica, Arial, sans-serif";
		ctx.textAlign = "right";
		ctx.fillText(initials, width - 3, height - marginBottom);

		var dataUri = canvas.toDataURL("image/png");
		return dataUri;
	};

	/**
	 * Get the selection position of an input field
	 * @param {element} input the input field to get the caret position
	 * @param {Function} formatter function to handle formatting of input field
	 */
	util.getSelectionPositionOfInput = function(input, formatter) {

		var textSelection = [];

		if(!formatter) {
			formatter = function(input) {
				return input;
			};
		}

		// get the selection start and end values
		if ('selectionStart' in input) {
			textSelection = [formatter(input.selectionStart), formatter(input.selectionEnd)];
		} else {
			// < IE9 version
			var range = document.selection.createRange();
			if (range && range.parentElement() === input) {
				var textInputRange = input.createTextRange();
				textInputRange.moveToBookmark(range.getBookmark());
				textSelection[0] = formatter(textInputRange.moveStart('character', -input.value.length));
				textSelection[1] = formatter(textInputRange.moveEnd('character', -input.value.length));
			}
		}

		return textSelection;
	};

	/**
	 * Gets the caret position of an input field after it has been updated
	 * @param {element} input        The input field
	 * @param {Array}   previousTextSelection  The previous selection on the input before the update
	 * @param {Number}  lengthDiff   The difference in length between the previous value and the new value
	 * @param {Boolean} isBackspace  If the last keypress was a backspace
	 */
	util.getNewCaretPosition = function(input, previousTextSelection, lengthDiff, isBackspace) {
		var cursorPosition = previousTextSelection[0];

		lengthDiff = previousTextSelection[1] - previousTextSelection[0] + lengthDiff;
		if (lengthDiff <= 0) {
			lengthDiff = 1;
		}
		// reset the selection values if input field is empty
		if (!input.value.length) {
			previousTextSelection = [0, 0];
		}

		if (previousTextSelection[0] === previousTextSelection[1]) {
			// if the nothing is selected in the input field
			if (isBackspace) {
				cursorPosition = previousTextSelection[0] === 0 ? 0 : previousTextSelection[0] - 1;
			} else {
				cursorPosition = previousTextSelection[0] + lengthDiff;
			}
		}
		else {
			// if something is selected
			if (isBackspace) {
				cursorPosition = previousTextSelection[0];
			} else {
				cursorPosition = previousTextSelection[0] + lengthDiff;
			}
		}

		return cursorPosition;
	};

	/**
	 * Sets the caret position of input field an handles the scroll to have the caret centered
	 * @param {Element} input the input field to set the caret position of
	 * @param {Number} cursorPosition numeric value representing the desired caret position
	 * @param {String} content content of input field
	 * @param {Element} dummyField dummy field to measure length of text
	 */
	util.setCaretPositionOfInput = function(input, cursorPosition, content, dummyField) {

		var scroll;

		// set the correct cursor position
		if ('setSelectionRange' in input) {
			input.setSelectionRange(cursorPosition, cursorPosition);
		} else {
			// < IE9 version
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', cursorPosition);
			range.moveStart('character', cursorPosition);
			range.select();
		}

		//handle input scroll
		if(content && dummyField) {
			if (content) {
				dummyField.text(content.substr(0, cursorPosition));
			} else {
				dummyField.text("");
			}

			scroll = dummyField.width() - $(input).width() / 2;
			input.scrollLeft = scroll;
		}
	};


	/**
	 * Checks a string against a regular expression for emails
	 * @param email
	 * @returns {Boolean}
	 */
	util.isValidEmail = function(email) {
		var regularExpressions = /^\w+([\.\-]?\w+)*@\w+([\.\-]?\w+)*(\.\w+)+$/;
		var result = regularExpressions.test(email);

		return result;
	};

	/**
	 * Checks if object is empty and return boolean
	 * @param obj
	 * @returns {Boolean}
	 */
	util.isEmptyObject = function(obj) {
		return $.isEmptyObject(obj);
	};

	/**
	 * Checks if element is editable or form element
	 * @param   {HTMLElement} el Inspected element
	 * @returns {Boolean}
	 */
	util.isEditable = function(el) {
		var tagName = el.tagName.toLowerCase();
		var editable = el.getAttribute('contenteditable');
		return editable || ['input', 'textarea', 'select', 'button', 'label'].indexOf(tagName) > -1;

	};

	/**
	 * Periodically executes a function specified by parameters
	 * @params fn, delay
	 */
	util.debounce = function(fn, delay) {

		var timer = null;

		return function () {
			var context = this, args = arguments;
			clearTimeout(timer);
			timer = setTimeout(function () {
				fn.apply(context, args);
			}, delay);
		};
	};

	/**
	 * Validate the payment detail checksum based on ISO 7064
	 * http://en.wikipedia.org/wiki/International_Bank_Account_Number#Validating_the_IBAN
	 * @param  {String} input the input to be validated
	 */
	util.validateISO7064Checksum = function(input) {
		/**
		 * Replace letters from the IBAN with numbers
		 * @param  {String} str [description]
		 */
		var replaceLetters = function(str) {
			var strArray = str.split('');
			for (var i = 0; i < strArray.length; i++) {
				if (/[A-Z]/.test(strArray[i])) {
					strArray[i] = strArray[i].charCodeAt(0) - 55;
				}
			}
			return strArray.join('');
		};

		/**
		 * Performs a basic mod-97 operation for IBAN validation (as described in ISO 7064)
		 * @param  {String} str Max 9 character string respresenting part of the IBAN
		 */
		var mod97 = function(str) {
			var result = parseInt(str, 10) % 97;
			result = result.toString();

			return result.length === 1 ? '0' + result : result;
		};

		if(input) {
			input = input.substr(4) + input.substr(0, 4);
			input = replaceLetters(input);
			//bypasses javascript INT32 restriction
			while (input.length > 2 && !isNaN(input)) {
				input = mod97(input.substr(0, 9)) + input.substr(9);
			}
			if (parseInt(input, 10) === 1) {
				return true;
			}
		}

		return false;
	};

	/**
	 * @param {String} photoUrl Photo Url
	 * @returns {String|Null}
	 */
	util.decodePhotoUrl = function(photoUrl) {
		return photoUrl ? decodeURIComponent(photoUrl) : null;
 	};

	/**
	 * @param widgetInstance
	 * @returns string
	 */
	util.widgetBaseUrl = function(widgetInstance) {
		return util.resolveContextRoot(
			widgetInstance.getPreference('src').replace(/\/[^\/]*$/, '')
		);
	};

	util.resolveContextRoot = function(url) {
		return url.replace('$(contextRoot)', b$.portal.config.serverRoot);
	};

	/**
	 * TEMP HACK: here we get the base Url from widget's Url
	 *
	 * @param widgetInstance
	 * @returns {*}
	 */
	util.baseUrlResolvedFromWidgetUrl = function(widgetInstance) {
		var src = widgetInstance.getPreference('src');
		var entry = '/launchpad';
		return util.resolveContextRoot(src.substring(0, src.indexOf(entry) + entry.length));
	};

	/**
	 * Check if the current browser is ES3 compliant only
	 *
	 * @returns {Boolean}
	 */
	util.isOldBrowser = function() {
		var es3Browser = false;
		try {
			Object.defineProperty({}, 'x', {});
		} catch (e) { /* this is ES3 Browser */
			es3Browser = true;
		}
		return es3Browser;
	};

	/**
	 * Export
	 */
	window.lp = window.lp || {};
	window.lp.util = util;

})(window, window.jQuery);
