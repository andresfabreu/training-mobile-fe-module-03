/**
 * Auto configuration module
 * @name configuration
 * @memberof core
 * @ngModule
 */

define(function(require, exports, module) {
    'use strict';

    module.name = 'core.configuration';

    var base = require('base');
    var deps = [];

    /**
     * {Description}
     * @name lpCoreConfiguration
     * @memberof core.configuration
     * @ngProvider
     * @ngInject
     */
    function configurationProvider(lpCoreUtils, lpCoreI18nProvider) {
        var widget;
        var utils = lpCoreUtils;

        this.useWidgetInstance = function(w) {
            widget = w;
            lpCoreI18nProvider.useWidgetInstance(w);
        };

        // @ngInject
        this.$get = function() {
            /**
             * @alias core.configuration.lpCoreConfiguration
             */
            var API = function (setWidget) {
                this.widget = setWidget;
                this.attributes = {};

                this.defineAttribute('locale', {
                    'default': 'en'
                });
            };

            /**
             * Returns current value of locale attribute
             *
             * @example
             * ```
             * var locale = configProvider.getLocale(); // "en"
             * ```
             *
             * @returns {String}
             */
            API.prototype.getLocale = function() {
                return this.get('locale');
            };

            /**
             * Defines a new config attribute with the specified attribute name
             * and the specified attribute description.
             *
             * @example
             * ```
             * // Define attribute "permission" and set "readonly" as a default value
             * configProvider.defineAttribute('permission', {
             *   'default': 'readonly'
             * });
             * ```
             *
             * @param attr {String} Attribute name
             * @param {Object} definition
             *
             * @returns {Undefined}
             */
            API.prototype.defineAttribute = function(attr, definition) {
                this.attributes[attr] = definition;
            };

            /**
             * Returns value of the specified attribute.
             * Returns default value if actual value is undefined.
             * @param attr {String} Attribute name
             * @returns {*}
             */
            API.prototype.get = function(attr) {
                var value;
                if (this.widget) {
                    value = (this.widget.getPreference(attr)) || (this.widget.getPreferenceFromParents(attr));
                }

                value = (typeof value !== 'undefined') ? value : (this.getDefault(attr));

                // If the value is a string, the resolve portal client placeholders ($contextRoot, etc).
                if (utils.isString(value)) {
                    value = utils.resolvePortalPlaceholders(value);
                }

                return value;
            };

            /**
             * Returns default value of the specified attribute or null,
             * if the attribute doesn't have default value;
             *
             * @example
             * ```
             * // Read default value for "locale" attribute
             * var defaultValue = configProvider.getDefault('locale'); // "en"
             * ```
             *
             * @param attr {String} Attribute name
             * @returns {*|Null}
             */
            API.prototype.getDefault = function(attr) {
                return (this.attributes[attr] && this.attributes[attr]['default'])
                    ? this.attributes[attr]['default']
                    : null;
            };

            /**
             * Returns the ABS path if there is one. Only works if a widget is set, otherwise assumes
             * ABS path is on the root `/`.
             * @returns {String}
             */
            API.prototype.getAbsPath = function() {
                return (this.widget && utils.getWidgetBaseUrl(this.widget)) || '/';
            };

            return new API(widget);
        };
    }

    module.exports = base.createModule(module.name, deps)
        .provider('lpCoreConfiguration', configurationProvider);
});
