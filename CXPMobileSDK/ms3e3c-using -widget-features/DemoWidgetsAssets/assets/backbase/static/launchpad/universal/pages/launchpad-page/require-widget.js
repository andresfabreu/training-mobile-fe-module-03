(function(root, factory) {
    'use strict';
    if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.requireWidget = factory(root.jQuery, require);
    }
}(this, function($, require) {

    'use strict';
    var _toString_ = Object.prototype.toString;
    var _slice_ = Array.prototype.slice;
    /**
     * Utils function for cloning an object
     * @private
     * @param obj
     * @return {*}
     */
    var clone = function(obj){
        if (!obj || _toString_.call(obj) !== '[object Object]') { return obj; }
        var temp = obj.constructor(); // changed
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                temp[key] = clone(obj[key]);
            }
        }

        return temp;
    };

    /**
     * Util function for shallow merging objects
     * @private
     * @param o1
     * @param o2
     * @return {*}
     */
     var utils = {
        extend: jQuery.extend,
        isFunction: jQuery.isFunction,
        isPlainObject: jQuery.isPlainObject,
        isAngular: function(app) {
            return jQuery.isPlainObject(app) && app._invokeQueue;
        }
    };

    /**
     * Gets and invokes widget function written as an AMD module
     *
     * @param {Object} localConfig Additional config for the internal require call
     * @param {Object} widgetInstance The instance of the widget created by portal (__WIDGET__)
     * @param {String} widgetModule The amd module that should return a function to handle the widget
     */

    var _requireWidget = function(localConfig, widgetInstance, widgetModule) {

	    //clone the require js config, don't want to modify the original
	    var widgetConfig = clone(require.s.contexts._.config);

        //work out correct widget module id
        var widgetBase = widgetInstance.myDefinition.sUrl.replace(/[^\/]*$/, '');
	    widgetBase = widgetBase.replace(new RegExp('^' + widgetConfig.baseUrl), '');
	    widgetModule = widgetBase + widgetModule;

	    var isAbsolute = /^(https?:\/\/|\/)/i;
	    if (isAbsolute.test(widgetModule) && widgetModule.indexOf('.js') < 0) {
		   widgetModule += '.js';
	    }

        //update widget config to include any local shims or paths
        widgetConfig.shim = utils.extend(widgetConfig.shim, localConfig.shim);
        widgetConfig.paths = utils.extend(widgetConfig.paths, localConfig.paths);

        //require the widget module wrapped in a specific require context
        var widgetRequire = require.config(widgetConfig);
        widgetRequire([widgetModule], function(app) {

            if (utils.isFunction(app)) {
                app.call(null, widgetInstance);
            } else if (utils.isAngular(app)) {
                //is angular
                app.constant('widget', widgetInstance);
                angular.bootstrap(widgetInstance.body || widgetInstance, [app.name]);

            } else if (utils.isPlainObject(app)) {
                // Call if you find an init function
                if (utils.isFunction(app.init)) {
                    app.init.call(null, (typeof widgetInstance === 'string' ? $(widgetInstance) : widgetInstance));
                }
            }

        });
    };

    /**
     * Use in a g:onload for asynchronously loading AMD modules associated with widgets. This is a global function
     *
     * @author philip@backbase.com
     * @copyright Backbase B.V, 2013
     * @exports requireWidget
     *
     * @example
     * &lt;body g:onload='requireWidget(__WIDGET__, 'my-module')'&gt;
     *
     * @param {Object} localConfig Require JS config containing paths or shims to add to the global requirejs context before loading
     *                  this widget (Optional)
     * @param {Object} widgetInstance The widget (__WIDGET__) instance
     * @apram {String} module The name of the widget module to load
     */
    return function() {

        //parse args to figure out if extra require js config was passed
        var args = _slice_.call(arguments, 0);
        if(!args[0].shim || args[1].paths) {
            //add an empty config object
            args.unshift({});
        }
        _requireWidget.apply(null, args);
    };

}));
