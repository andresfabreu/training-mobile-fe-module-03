define(function(rerquire, exports, module) {
    'use strict';

    module.name = 'core.configuration';

    var base = require('base');
    var deps = [];

    // @ngInject
    function configurationProvider(lpCoreUtils, lpCoreI18nProvider) {
        var widget;
        var utils = lpCoreUtils;

        this.useWidgetInstance = function(w) {
            widget = w;
            lpCoreI18nProvider.useWidgetInstance(w);
        };

        // @ngInject
        this.$get = function() {
            var API = function (setWidget) {
                this.widget = setWidget;
                this.attributes = {};

                this.defineAttribute('locale', {
                    'default': 'en'
                });
            };

            API.prototype.getLocale = function() {
                return this.get('locale');
            };

            API.prototype.defineAttribute = function(attr, definition) {
                this.attributes[attr] = definition;
            };

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

            API.prototype.getDefault = function(attr) {
                return (this.attributes[attr] && this.attributes[attr]['default'])
                    ? this.attributes[attr]['default']
                    : null;
            };

            /**
             * Get the ABS path if there is one (only works if a widget is set, otherwise assumes
             * ABS path is on the root /).
             *
             * @return {String}
             */
            API.prototype.getAbsPath = function() {
                return (this.widget && utils.getWidgetBaseUrl(this.widget)) || '/';
            };

            var config = new API(widget);

            return config;
        };
    }

    module.exports = base.createModule(module.name, deps)
        .provider('lpCoreConfiguration', configurationProvider);
});
