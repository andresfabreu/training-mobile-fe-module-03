/**
 * Utility methods to assign with portal.
 * @module string
 */
define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var lpPortal = base.inject('lpPortal', require('../portal/main').name);
    var utils = base.utils;

    /**
     * Resolve portal client placeholders.
     *
     * @example
     * ```
     * lpCoreUtils.resolvePortalPlaceholders('$(contextPath)/some/page.html'); // "/real/context/path/some/page.html"
     * ```
     *
     * @memberof core.utils.lpCoreUtils
     * @param   {String} string Path to be resolved
     * @returns {String}
     */
    exports.resolvePortalPlaceholders = function(string) {
        var replaceWith = lpPortal.root || '';
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
     * Returns the base URL of the given widget instance.
     *
     * @memberof core.utils.lpCoreUtils
     * @param   {Widget} widgetInstance Instance of the widget
     * @returns {String}
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
     * Return value of the portal configuration property
     * @memberof core.utils.lpCoreUtils
     * @param   {String} property  Name of the portal property
     * @returns {String}           Value of the portal property
     */
    // TODO: remove this method after refactoring MFALogin to use lpPortal
    exports.getPortalProperty = function(property) {
        switch (property) {
            case 'serverRoot':
                return lpPortal.root;
            case 'portalName':
                return lpPortal.name;
            case 'pageName':
                return lpPortal.page.name;
            case 'defaultLandingPage':
                return lpPortal.defaultLandingPage;
            case 'locale':
                return lpPortal.locale;
            case 'hideAccount':
                return lpPortal.hideAccount;
            case 'maskAccount':
                return lpPortal.maskAccount;
            default:
                return lpPortal['_portalConfig'][property];
        }
    };

     /**
      * Returns value of the page configuration preference
      * @memberof core.utils.lpCoreUtils
      * @param   {String} prop  Name of the page property
      * @returns {String}       Value of the page property
      */
    exports.getPagePreference = function(prop) {
        return lpPortal.page.getPreference(prop);
    };

    /**
     * Returns the portal page element
     * @memberof core.utils.lpCoreUtils
     * @returns {Element}
     */
    exports.getPortalPage = function() {
        return lpPortal.page;
    };

    exports.generateUUID = function() {

            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
    };
});
