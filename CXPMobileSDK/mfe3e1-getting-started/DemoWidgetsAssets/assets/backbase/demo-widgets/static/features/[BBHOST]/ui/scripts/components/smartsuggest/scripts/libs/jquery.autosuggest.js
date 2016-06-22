/* eslint-disable */
/**
 *  Ajax Autocomplete for jQuery, version 1.2.7
 *  (c) 2013 Tomas Kirda
 *
 *  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
 *  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
 *
 */

/*jslint  browser: true, white: true, plusplus: true */
/*global define, window, document, jQuery */

// Expose plugin as an AMD module if AMD loader is present:
(function (factory) {
	"use strict";
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
        define(['jquery'],factory);
	} else {
		// Browser globals
		factory(window.jQuery);
	}
}(function ($) {

	"use strict";


	var
		utils = (function () {
			return {
				escapeRegExChars: function (value) {
					return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
				},
				createNode: function (html) {
					var div = document.createElement("div");
					div.innerHTML = html;
					return div.firstChild;
				}
			};
		}()),

		keys = {
			ESC: 27,
			TAB: 9,
			RETURN: 13,
			LEFT: 37,
			UP: 38,
			RIGHT: 39,
			DOWN: 40
		};

	function Autocomplete(el, options) {
		var noop = function () { },
			self = this,
			defaults = {
				autoSelectFirst: false,
				circularSelect: true,
				appendTo: "body",
				serviceUrl: null,
				lookup: null,
				onSelect: null,
				width: "auto",
				minChars: 1,
				maxHeight: 300,
				deferRequestBy: 0,
				params: {},
				formatResult: Autocomplete.formatResult,
				delimiter: null,
				zIndex: 9999,
				type: "GET",
				noCache: false,
				onSearchStart: noop,
				onSearchComplete: noop,
				onClear: noop,
				onChangeModel: noop,
				containerClass: "lp-autosuggest-suggestions",
				tabDisabled: true,
				dataType: "text",
				currentRequest: null,
				paramName: "query",
				transformResult: function (response) {
					return typeof response === "string" ? $.parseJSON(response) : response;
				}
			};

		// Shared variables:
		self.element = el;
		self.el = $(el);
		self.suggestions = [];
		self.badQueries = [];
		self.selectedIndex = -1;
		self.currentValue = self.element.value;
		self.intervalId = 0;
		self.cachedResponse = [];
		self.onChangeInterval = null;
		self.onChange = null;
		self.isLocal = false;
		self.suggestionsContainer = null;
		self.options = $.extend({}, defaults, options);
		self.classes = {
			selected: "lp-autosuggest-selected",
			suggestion: "lp-autosuggest-suggestion"
		};
		self.hint = null;
		self.hintValue = "";
		self.selection = null;

		// Initialize and set options:
		self.initialize();
		self.setOptions(options);
	}

	Autocomplete.utils = utils;

	$.Autocomplete = Autocomplete;

	Autocomplete.formatResult = function (suggestion, currentValue) {
		var pattern = "(" + utils.escapeRegExChars(currentValue) + ")";

		return suggestion.value.replace(new RegExp(pattern, "gi"), "<strong>$1<\/strong>");
	};

	Autocomplete.prototype = {

		killerFn: null,

		initialize: function () {

			var self = this,
				suggestionSelector = "." + self.classes.suggestion,
				selected = self.classes.selected,
				options = self.options,
				container;

			// Remove autocomplete attribute to prevent native suggestions:
			self.element.setAttribute("autosuggest", "off");

			// Add aria attribute
			self.element.setAttribute("aria-autocomplete", "list");

			self.killerFn = function (e) {
                // Don't hide when field has focus
				if (($(e.target).closest("." + self.options.containerClass).length === 0) && !self.el.is(":focus")) {
                    self.killSuggestions();
					self.disableKillerFn();
				}
			};

			self.suggestionsContainer = Autocomplete.utils.createNode('<div class="' + options.containerClass + '" style="position: absolute; display: none;"></div>');

			container = $(self.suggestionsContainer);

			container.appendTo(options.appendTo);

			// Only set width if it was provided:
			if (options.width !== "auto") {
				container.width(options.width);
			}

			// Listen for mouse over event on suggestions list:
			container.on("mouseover.autosuggest", suggestionSelector, function () {
				self.activate($(this).data("index"));
			});

			// Deselect active element when mouse leaves suggestions container:
			container.on("mouseout.autosuggest", function () {
				self.selectedIndex = -1;
				container.children("." + selected).removeClass(selected);
			});

			// Listen for click event on suggestions list:
			container.on("mousedown.autosuggest touchstart.autosuggest", suggestionSelector, function () {
				self.select($(this).data("index"));
                self.el.trigger('blur');
			});

			self.fixPosition();

			self.fixPositionCapture = function () {
				if (self.visible) {
					self.fixPosition();
				}
			};

			$(window).on("resize", self.fixPositionCapture);

			self.el.on("keydown.autosuggest", function (e) { self.onKeyPress(e); });
			self.el.on("keyup.autosuggest", function (e) { self.onKeyUp(e); });
			self.el.on("blur.autosuggest", function (e) {
                var delay;
                if (!e.isTrigger) {
                    delay = setTimeout(function() {
                        self.killerFn(e);
                    }, 100);
                }
                else {
                    clearTimeout(delay);
                    self.killerFn(e);
                }
            });
			self.el.on("focus.autosuggest", function () { self.onFocus(); });
			self.el.on("change.autosuggest", function (e) { self.onKeyUp(e); });
            self.el.on("toggle.autosuggest", function (e) { self.onToggle(e); });
		},

        onToggle: function () {
            if (this.visible) {
                this.el.blur();
            } else {
                this.el.focus();
            }
        },

		onBlur: function () {
			this.enableKillerFn();
		},

		setOptions: function (suppliedOptions) {
			var self = this,
				options = self.options;

			$.extend(options, suppliedOptions);

			self.isLocal = $.isArray(options.lookup);

			if (self.isLocal) {
				options.lookup = self.verifySuggestionsFormat(options.lookup);
			}

			// Adjust height, width and z-index:
			$(self.suggestionsContainer).css({
				"max-height": options.maxHeight + "px",
				"width": options.width + "px",
				"z-index": options.zIndex
			});
		},

		clearCache: function () {
			this.cachedResponse = [];
			this.badQueries = [];
		},

		clear: function () {
			this.clearCache();
			this.currentValue = "";
			this.suggestions = [];
		},

		disable: function () {
			this.disabled = true;
		},

		enable: function () {
			this.disabled = false;
		},

		changeModel: function() {
			var self = this;
			self.options.onChangeModel.call(self.element);
		},

		fixPosition: function () {
			var self = this,
				offset;

			// Don't adjsut position if custom container has been specified:
			if (self.options.appendTo !== "body") {
				return;
			}

			offset = self.el.offset();

			$(self.suggestionsContainer).css({
				top: (offset.top + self.el.outerHeight()) + "px",
				left: offset.left + "px"
			});
		},

		enableKillerFn: function () {
			var self = this;
			$(document).on("click.autosuggest", self.killerFn);
		},

		disableKillerFn: function () {
			var self = this;
			$(document).off("click.autosuggest", self.killerFn);
		},

		killSuggestions: function () {
			var self = this;
			self.stopKillSuggestions();
			self.intervalId = window.setInterval(function () {
				self.hide();
				self.stopKillSuggestions();
			}, 100);
		},

		stopKillSuggestions: function () {
			window.clearInterval(this.intervalId);
		},

		isCursorAtEnd: function () {
			var self = this,
				valLength = self.el.val().length,
				selectionStart = self.element.selectionStart,
				range;

			if (typeof selectionStart === "number") {
				return selectionStart === valLength;
			}
			if (document.selection) {
				range = document.selection.createRange();
				range.moveStart("character", -valLength);
				return valLength === range.text.length;
			}
			return true;
		},

		onKeyPress: function (e) {
			var self = this;

			// If suggestions are hidden and user presses arrow down, display suggestions:
			if (!self.disabled && !self.visible && e.which === keys.DOWN && self.currentValue) {
				self.suggest();
				return;
			}

			if (self.disabled || !self.visible) {
				return;
			}

			switch (e.which) {
				case keys.ESC:
					self.el.val("");
					self.hide();
					self.options.onClear.call(self.element);
					break;
				case keys.RIGHT:
					if (self.hint && self.options.onHint && self.isCursorAtEnd()) {
						self.selectHint();
						break;
					}
					return;
				case keys.TAB:
					if (self.hint && self.options.onHint) {
						self.selectHint();
						return;
					}
				/* falls through */
				case keys.RETURN:
					if (self.selectedIndex === -1) {
						self.hide();
						return;
					}
					self.select(self.selectedIndex);
					if (e.which === keys.TAB && self.options.tabDisabled === false) {
						return;
					}
					break;
				case keys.UP:
					self.moveUp();
					break;
				case keys.DOWN:
					self.moveDown();
					break;
				default:
					return;
			}

			// Cancel event if function did not return:
			e.stopImmediatePropagation();
			e.preventDefault();
		},

		onKeyUp: function (e) {
			var self = this;

			if (self.disabled || e.which === keys.UP || e.which === keys.DOWN) {
				return;
			}

			clearInterval(self.onChangeInterval);

			if (self.currentValue !== self.el.val()) {
				self.findBestHint();
				if (self.options.deferRequestBy > 0) {
					// Defer lookup in case when value changes very quickly:
					self.onChangeInterval = setInterval(function () {
						self.onValueChange();
					}, self.options.deferRequestBy);
				} else {
					self.onValueChange();
				}
			}
		},

        onFocus : function() {
            this.currentValue = this.el.val();
            this.fixPosition();
            this.getSuggestions("", "focus");
        },

		onValueChange: function () {

			var self = this,
				q;

			if (self.selection) {
				self.selection = null;
				(self.options.onInvalidateSelection || $.noop)();
			}

			clearInterval(self.onChangeInterval);
			self.currentValue = self.el.val();

			if(!self.currentValue) {
				//reset
				self.options.onClear.call(self.element);
			}

			q = self.getQuery(self.currentValue);
			self.selectedIndex = -1;

			if (q.length < self.options.minChars) {
				self.hide();
			} else {
				self.getSuggestions(q, "change");
			}
		},

		getQuery: function (value) {
			var delimiter = this.options.delimiter,
				parts;

			if (!delimiter) {
				return $.trim(value);
			}
			parts = value.split(delimiter);
			return $.trim(parts[parts.length - 1]);
		},

		getSuggestionsLocal: function (query) {
			var self = this;

			var suggestions = self.options.lookup.call(this.element, query);
			return {
				suggestions: suggestions
			};
		},

		getSuggestions: function (q, e) {
			var self = this,
				options = self.options;

			if(self.cachedResponse[q]) {
				self.suggestions = self.cachedResponse[q];
				self.suggest();

			}  else if (!self.isBadQuery(q)) {
				options.params[options.paramName] = q;
				if (options.onSearchStart.call(self.element, options.params) === false) {
					return;
				}
				var suggestions = self.getSuggestionsLocal(q);
				self.processResponse(suggestions, q, e);
				options.onSearchComplete.call(self.element, q);
			}
		},

		isBadQuery: function (q) {
			var badQueries = this.badQueries,
				i = badQueries.length;

			while (i--) {
				if (q.indexOf(badQueries[i]) === 0) {
					return true;
				}
			}

			return false;
		},

		hide: function () {
			var self = this;
			self.visible = false;
			self.selectedIndex = -1;
			$(self.suggestionsContainer).hide();
			self.signalHint(null);
		},

		suggest: function () {
			if (this.suggestions.length === 0) {
				this.hide();
				return;
			}

			var self = this,
				formatResult = self.options.formatResult,
				value = self.getQuery(self.currentValue),
				className = self.classes.suggestion,
				classSelected = self.classes.selected,
				container = $(self.suggestionsContainer),
				html = "",
				width;

			// Build suggestions inner HTML:
			$.each(self.suggestions, function (i, suggestion) {
				html += '<div class="' + className + '" data-index="' + i + '" role="option">' + formatResult(suggestion, value) + '</div>';
			});

			// If width is auto, adjust width before displaying suggestions,
			// because if instance was created before input had width, it will be zero.
			// Also it adjusts if input width has changed.
			// -2px to account for suggestions border.
			if (self.options.width === "auto") {
				width = self.el.outerWidth() - 2;
				container.width(width > 0 ? width : 300);
			}

			container.html(html).show();
			self.visible = true;

			// Select first value by default:
			if (self.options.autoSelectFirst) {
				self.selectedIndex = 0;
				container.children().first().addClass(classSelected);
			}

			self.findBestHint();
		},

		findBestHint: function () {
			var self = this,
				value = self.el.val().toLowerCase(),
				bestMatch = null;

			if (!value) {
				return;
			}

			$.each(self.suggestions, function (i, suggestion) {
				var foundMatch = suggestion.value.toLowerCase && suggestion.value.toLowerCase().indexOf(value) === 0;
				if (foundMatch) {
					bestMatch = suggestion;
				}
				return !foundMatch;
			});

			self.signalHint(bestMatch);
		},

		signalHint: function (suggestion) {
			var hintValue = "",
				self = this;
			if (suggestion) {
				hintValue = self.currentValue + suggestion.value.substr(self.currentValue.length);
			}
			if (self.hintValue !== hintValue) {
				self.hintValue = hintValue;
				self.hint = suggestion;
				(this.options.onHint || $.noop)(hintValue);
			}
		},

		verifySuggestionsFormat: function (suggestions) {
			// If suggestions is string array, convert them to supported format:
			if (suggestions.length && typeof suggestions[0] === "string") {
				return $.map(suggestions, function (value) {
					return { value: value, data: null };
				});
			}

			return suggestions;
		},

		processResponse: function (response, originalQuery, e) {
			var self = this,
				options = self.options,
				result = options.transformResult(response, originalQuery);

			result.suggestions = self.verifySuggestionsFormat(result.suggestions);

			// Cache results if cache is not disabled:
			if (!options.noCache) {
				self.cachedResponse[result[options.paramName]] = result;
				if (result.suggestions.length === 0) {
					self.badQueries.push(result[options.paramName]);
				}
			}

			// Display suggestions only if returned query matches current value:
			if (originalQuery === self.getQuery(self.currentValue) || e === "focus") {
				self.suggestions = result.suggestions;
				self.suggest();
			}
		},

		activate: function (index) {
			var self = this,
				activeItem,
				selected = self.classes.selected,
				container = $(self.suggestionsContainer),
				children = container.children();

			container.children("." + selected).removeClass(selected);

			self.selectedIndex = index;

			if (self.selectedIndex !== -1 && children.length > self.selectedIndex) {
				activeItem = children.get(self.selectedIndex);
				$(activeItem).addClass(selected);
				return activeItem;
			}

			return null;
		},

		selectHint: function () {
			var self = this,
				i = $.inArray(self.hint, self.suggestions);

			self.select(i);
		},

		select: function (i) {
			var self = this;
			self.hide();
			self.onSelect(i);
		},

		moveUp: function () {
			var self = this;

			if (self.selectedIndex === -1) {
				return;
			}

			var modifier;
			if (self.selectedIndex === 0) {
				if(self.options.circularSelect) {
					modifier = self.suggestions.length - 1;
				} else {
					$(self.suggestionsContainer).children().first().removeClass(self.classes.selected);
					self.selectedIndex = -1;
					self.el.val(self.currentValue);
                    self.el.trigger("input");
					self.findBestHint();
					return;
				}
			} else {
				modifier = -1;
			}

			self.adjustScroll(self.selectedIndex + modifier);
		},

		moveDown: function () {
			var self = this;

			var modifier;
			if (self.selectedIndex === (self.suggestions.length - 1)) {
				if(self.options.circularSelect) {
					modifier = (self.suggestions.length - 1) * -1;
				} else {
					return;
				}
			} else {
				modifier = 1;
			}

			self.adjustScroll(self.selectedIndex + modifier);
		},

		adjustScroll: function (index) {
			var self = this,
				activeItem = self.activate(index),
				offsetTop,
				upperBound,
				lowerBound,
				heightDelta = 75;

			if (!activeItem) {
				return;
			}

			offsetTop = activeItem.offsetTop;
			upperBound = $(self.suggestionsContainer).scrollTop();
			lowerBound = upperBound + self.options.maxHeight - heightDelta;

			if (offsetTop < upperBound) {
				$(self.suggestionsContainer).scrollTop(offsetTop);
			} else if (offsetTop > lowerBound) {
				$(self.suggestionsContainer).scrollTop(offsetTop - self.options.maxHeight + heightDelta);
			}

			self.el.val(self.getValue(self.suggestions[index].value));
            self.el.trigger("input");
			self.signalHint(null);
		},

		onSelect: function (index) {
			var self = this,
				onSelectCallback = self.options.onSelect,
				suggestion = self.suggestions[index],
                setCurrentValue = true;

			self.currentValue = self.getValue(suggestion.value);
			self.signalHint(null);
			self.suggestions = [];
			self.selection = suggestion;

			if ($.isFunction(onSelectCallback)) {
                if (onSelectCallback.call(self.element, suggestion) === false) {
                    setCurrentValue = false;
                }
			}

            if (setCurrentValue) {
                self.el.val(self.currentValue);
                self.el.trigger("input");
            }
        },

		getValue: function (value) {
			var self = this,
				delimiter = self.options.delimiter,
				currentValue,
				parts;

			if (!delimiter) {
				return value;
			}

			currentValue = self.currentValue;
			parts = currentValue.split(delimiter);

			if (parts.length === 1) {
				return value;
			}

			return currentValue.substr(0, currentValue.length - parts[parts.length - 1].length) + value;
		},

		dispose: function () {
			var self = this;
			self.el.off(".autosuggest").removeData("autosuggest");
			self.disableKillerFn();
			$(window).off("resize", self.fixPositionCapture);
			$(self.suggestionsContainer).remove();
		}
	};

	// Create chainable jQuery plugin:
	$.fn.autosuggest = function (options, args) {
		var dataKey = "autosuggest";
		// If function invoked without argument return
		// instance of the first matched element:
		if (arguments.length === 0) {
			return this.first().data(dataKey);
		}

		return this.each(function () {
			var inputElement = $(this),
				instance = inputElement.data(dataKey);

			if (typeof options === "string") {
				if (instance && typeof instance[options] === "function") {
					instance[options](args);
				}
			} else {
				// If instance already exists, destroy it:
				if (instance && instance.dispose) {
					instance.dispose();
				}
				instance = new Autocomplete(this, options);
				inputElement.data(dataKey, instance);
			}
		});
	};
}));
