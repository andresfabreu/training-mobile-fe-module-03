/*global define */
define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var core = require('core');

    module.name = 'ui.smartsuggest-formatter'; // launchpad/lib/ui/smartsuggest-formatter

    module.exports = base.createModule(module.name, [
        core.name
    ]);

    // @ngInject
    module.exports.factory('SmartSuggestFormatter', function(SmartSuggestEngine, lpCoreI18n, lpCoreUtils) {

        // shrotcut to getter function from util
        var getFormatterFnName = SmartSuggestEngine.util.getFormatterFnName;

        /**
         * CONSTRUCTOR
         *
         * @param locale
         * @constructor
         */
        var SmartSuggestFormatter = function(options) {
            this.locale = options.locale || null;
            this.currency = options.currency || null;
        };

        /**
         * Adds custom formatter.
         * ----------------------
         * Adds a new formatter of a certain type (or OVERWRITES existing of the type provided)
         *
         * @param type {string}
         * @param formatter {function}
         */
        SmartSuggestFormatter.prototype.addFormatter = function(type, formatter) {
            if (lpCoreUtils.isString(type) && lpCoreUtils.isFunction(formatter)) {
                SmartSuggestFormatter.prototype[getFormatterFnName(type)] = formatter;
            } else {
                // TODO: add proper validation error handling
                console.log('addFormatter: input arguments validation failure');
            }
        };

        /**
         *
         */
        SmartSuggestFormatter.prototype.format = function(suggestion) {

            var values = [];

            if(suggestion.displayAsRange) {
                values[0] = this.formatValue(suggestion.search.from, suggestion.type);
                values[1] = this.formatValue(suggestion.search.to, suggestion.type);
            } else if(suggestion.type === SmartSuggestEngine.types.DATE) {
                values[0] = this.formatValue(suggestion.search.from, suggestion.type);
            } else if(suggestion.type === SmartSuggestEngine.types.AMOUNT) {
                values[0] = this.formatValue(suggestion.search.original, suggestion.type);
            } else if(suggestion.type === SmartSuggestEngine.types.CONTACT) {
                values[0] = this.formatValue(suggestion.contact.name, suggestion.type);
                values[1] = this.formatValue(suggestion.contact.account, suggestion.type);
            } else if(suggestion.type === SmartSuggestEngine.types.CATEGORY) {
                values[0] = this.formatValue(suggestion.category, suggestion.type);
            } else if(suggestion.type === SmartSuggestEngine.types.ACCOUNT) {
                values[0] = this.formatValue(suggestion.account.name, suggestion.type);
                values[1] = this.formatValue(suggestion.account.iban, suggestion.type);
                values[2] = this.formatAmount(suggestion.account.balance, suggestion.account.currency);
            } else if(suggestion.type === SmartSuggestEngine.types.TITLE) {
                values[0] = this.formatValue(suggestion.title, suggestion.type);
            } else {
                values[0] = this.formatValue(suggestion.search.query, suggestion.type);
            }

            values = lpCoreUtils.map(values, lpCoreUtils.stripHtml);

            return values;
        };

        /**
         * Format value, other then money amount
         *
         * IMPORTANT: formatter function name should be the following format: "formatType",
         *            where Type is your suggester type (like 'date', 'contact', etc.)
         *
         * @param value
         * @param type
         * @returns {*}
         */
        SmartSuggestFormatter.prototype.formatValue = function(value, type) {
            return lpCoreUtils.isFunction(this[getFormatterFnName(type)]) ? this[getFormatterFnName(type)](value) : value;
        };

        /**
         * Format money amount (not a type-dependent)
         *
         * @param value
         * @returns {*}
         */
        SmartSuggestFormatter.prototype.formatAmount = function(value, currency) {
            return lpCoreI18n.formatCurrency(value, currency || this.currency);
        };

        /**
         *
         * @param value
         * @returns {*}
         */
        SmartSuggestFormatter.prototype.formatDate = function(value) {
            return lpCoreI18n.formatDate(value);
        };

        SmartSuggestFormatter.prototype.formatAccount = function(value) {
            return value.name;
        };

        SmartSuggestFormatter.prototype.formatCategory = function(value) {
            var categories = value;

            return categories.map(function(category) {
                return category.name;
            }).join(', ');
        };

        /**
         *
         * @param value
         * @returns {*}
         */
        SmartSuggestFormatter.prototype.formatGeneral = function(value) {
            return value;
        };

        SmartSuggestFormatter.prototype.formatTitle = function(value) {
            switch (value) {
                case SmartSuggestEngine.types.ACCOUNT:
                    return 'My accounts';
                case SmartSuggestEngine.types.CONTACT:
                    return 'Address Book';
            }
            return value;
        };

        /**
         *
         * @param suggestion
         * @returns {*}
         */
        SmartSuggestFormatter.prototype.getTypeLabel = function(suggestion) {
            var label;

            if(suggestion.displayAsRange) {
                label = 'Between';
            } else {
                label = SmartSuggestEngine.labels[suggestion.type] || 'Description';
            }

            return lpCoreI18n.instant(label) + ': ';
        };

        /**
         * Returns icon classes set
         *
         * @param suggestion
         * @returns {*}
         */
        SmartSuggestFormatter.prototype.getSuggestionIcon = function(suggestion, small) {
            return 'lp-icon lp-icon-' + (small ? 'small' : 'medium') + ' ' + SmartSuggestEngine.icons[suggestion.type];
        };

        /**
         *
         * @param suggestion
         * @returns {string}
         */
        SmartSuggestFormatter.prototype.getSuggestionHtml = function(suggestion) {

            var htmlClass = 'lp-smartsuggest-' + suggestion.type;
            var values = this.format(suggestion);

            var html = '<div class="lp-smartsuggest-result clearfix ' + htmlClass + '">';
            var predictedClass = suggestion.predicted ? 'lp-smartsuggest-predicted' : '';

            //image
            if(suggestion.type !== SmartSuggestEngine.types.ACCOUNT && suggestion.type !== SmartSuggestEngine.types.TITLE){
                html += '<span class="lp-smartsuggest-icon">';
                if(suggestion.type === SmartSuggestEngine.types.CONTACT && typeof suggestion.contact.photoUrl === 'string') {
                    html += '<img src="' + decodeURIComponent(suggestion.contact.photoUrl) + '" width="35" height="35">';
                } else if(suggestion.type === SmartSuggestEngine.types.CONTACT && suggestion.contact.initials) {
                    html += '<span class="lp-smartsuggest-intials">' + suggestion.contact.initials + '</span>';
                } else {
                    var iconClass = this.getSuggestionIcon(suggestion);
                    html += '<i class="' + iconClass + '"></i>';
                }
                html += '</span>';
            }

            html += '<div class="lp-smartsuggest-valuegroup">';
            if(!suggestion.contact && !suggestion.account) {
                html += '<span class="lp-smartsuggest-category">' + this.getTypeLabel(suggestion) + '</span>';
            }
            //formatting for contacts
            if(suggestion.contact) {
                html += '<span class="lp-smartsuggest-value ' + htmlClass + '-value">' + values[0] + '</span><br>';
                html += '<span class="' + htmlClass + '-value">' + values[1] + '</span>';
            } else if (suggestion.account) {
                html += '<div class="lp-smartsuggest-value ' + htmlClass + '-value">' + values[0] + '</div>';
                html += '<div><small class="' + htmlClass + '-value pull-left muted">' + values[1] + '</small>';
                html += '<span class="' + htmlClass + '-value pull-right">' + values[2] + '</span></div>';
            }
            //formatting for ranges
            else if(values.length === 2) {
                html += '<span class="lp-smartsuggest-from lp-smartsuggest-value ' + htmlClass + '-value">' + values[0] + '</span> ' + lpCoreI18n.instant('to');
                html += ' <span class="lp-smartsuggest-to lp-smartsuggest-value ' + htmlClass + '-value ' + predictedClass + '">' + values[1] + '</span>';

                //formatting for single values
            } else {
                html += '<span class="lp-smartsuggest-value ' + htmlClass + '-value">' + values[0] + '</span>';
            }
            html += '</div>';
            html += '</div>';

            return html;
        };

        return SmartSuggestFormatter;
    });
});
