/**
 * Utility methods to assign with portal.
 * @module string
 */
define(function(require, exports, module) {
    'use strict';

    var portal = window.b$ && window.b$.portal;
    var portalConfig = portal && portal.config;
    var utils = require('base').utils;

    if (utils.isObject(portalConfig)) {
        utils.extend(portalConfig, {
            portalName: portal.portalName,
            pageName: portal.pageName
        });
    }

    /**
     * Resolve portal client placeholders.
     *
     * @param {String} string
     * @return {String}
     */
    exports.resolvePortalPlaceholders = function(string) {
        var replaceWith = portalConfig && portalConfig.serverRoot || '';
        if ( utils.isString(string) ) {
            var replacements = utils([
                '$(contextRoot)',
                '$(contextPath)',
                '$(servicesPath)'
            ]);

            string = replacements.reduce(function(str, replace) {
                return str.replace(replace, replaceWith);
            }, string);
        }
        return string;
    };

    /**
     * Return the base URL of the given widget instance.
     *
     * @param {Widget} widgetInstance
     * @return {String}
     */
    exports.getWidgetBaseUrl = function(widgetInstance) {
        if( !utils.isEmpty(widgetInstance)) {
            var src = widgetInstance.getPreference('src');
            return (src && exports.resolvePortalPlaceholders(
                src.replace(/\/[^\/]*$/, '')
            ));
        }
    };

    /**
     * Return the portal configuration property
     * @param  {String} property Name of the property
     * @return {String}          Value of the property
     */
    exports.getPortalProperty = function(property) {
        if (portalConfig && !utils.isUndefined(portalConfig[property])) {
            return portalConfig[property];
        }

        return '';
    };

     /**
     * Return the page preference
     * @param  {String} property Name of the property
     * @return {String}          Value of the property
     */
    exports.getPagePreference = function(prop) {
        var propVal;
        if ( portal.portalView && portal.portalView.getElementsByTagName('page').length > 0 && utils.isString(prop) ) {
            propVal = portal.portalView.getElementsByTagName('page')[0].getPreference(prop);
        }
        return propVal;
    };
    /**
     * Return the portal Page property
     * @param  {String} property Name of the property
     * @return {String}          Value of the property
     */
    exports.getPortalPage = function() {

        try {
            return portal.portalView.getElementsByTagName('page')[0];
        } catch(e) {

        }
    };
});
