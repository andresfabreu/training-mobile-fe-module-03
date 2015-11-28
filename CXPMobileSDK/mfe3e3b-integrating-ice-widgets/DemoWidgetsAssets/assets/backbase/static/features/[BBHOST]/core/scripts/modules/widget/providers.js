define(function(require, exports, module) {
    'use strict';

	/**
     * lpCoreWidget provider
     * @return {object} angular provider
     * @ngInject
     */
	exports.lpCoreWidget = function widgetProvider($provide, lpCoreUtils) {
        var widget;

        this.useWidgetInstance = function(widgetInstance) {
            widget = widgetInstance;

            /**
             * @method addResolvedPreference get normalized property from widget model
             * @param {String} propName
             * @returns {Object} value
             */
            widgetInstance.getResolvedPreference = function(propName) {
                var val = this.getPreference(propName);
                return lpCoreUtils.resolvePortalPlaceholders(val);
            };

            $provide.provider('lpWidget', function() {
                /**
                 * @returns {Object} widgetInstance
                 */
                this.getInstance = this.$get = function() {
                    return widgetInstance;
                };
            });

            $provide.value('widget', widget); // will be deprecated
        };

        this.$get = this.getInstance = function() {
            return widget;
        };
    };
});
