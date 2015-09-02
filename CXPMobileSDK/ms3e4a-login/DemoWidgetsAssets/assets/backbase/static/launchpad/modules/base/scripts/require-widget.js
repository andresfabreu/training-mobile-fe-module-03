/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : require-widget.js
 *  Description:
 *  ----------------------------------------------------------------
 */
(function(root, factory) {
    'use strict';
    if (typeof exports === 'object') {
        module.exports = factory(require('jquery'), require('angular'));
    } else {
        root.requireWidget = factory(root.jQuery, root.angular);
    }
}(this, function($, ng) {
    'use strict';
    // debugger;
    var utils = {
        slice: Array.prototype.slice,
        clone: $.extend,
        isFunction: $.isFunction,
        isObject: $.isPlainObject,
        trim: $.trim,
        isAngularObject: function isAngularObject(obj) {
            return utils.isObject(obj) && utils.isFunction(obj.run);
        }
    };

    return function() {
        var args = utils.slice.call(arguments);
        var requirejs = window.requirejs;
        if (utils.isFunction(requirejs)) {
            var widget = {
                instance: args[0],
                config: utils.clone(requirejs.s.contexts._.config, {}),
                module: utils.trim(args[1].replace(/.js$/, ''), '/')
            };

            var fn = requirejs.config(widget.config);
            try {
                widget.module = widget.instance.myDefinition.sUrl
                    .replace(/[^\/]*$/, '')
                    .replace(new RegExp('^' + widget.config.baseUrl), '') + widget.module;

                //add js extension if module is an absolute file path
                if(/^(https?:\/\/|file:\/\/\/)(.*)/.test(widget.module)) {
                    widget.module += '.js';
                }
            } catch (err) {

            }

            fn([widget.module, 'base', 'core'], function(app, base, core) {
                var wi = widget.instance;
                // Create a callback method on the widget instance object to be used internally by app
                // to notify that widget is done loading
                var widgetLoadingClass = 'lp-widget-loading';
                wi.loading = function(className) {
                    widgetLoadingClass = (className || widgetLoadingClass);
                    ng.element(wi.body).addClass(widgetLoadingClass);
                };
                wi.loaded = function(doneClass) {
                    ng.element(wi.body).removeClass(widgetLoadingClass);
                    if(typeof doneClass === 'string') { ng.element(wi.body).addClass(doneClass); }
                };
                if (utils.isFunction(app)) {
                    app.call(null, wi);
                } else if (utils.isAngularObject(app)) {

                    // app.constant('widget', (function() {
                    //     return wi;
                    // })());
                    // @ngInject
                    app.config(function($provide, lpCoreUtils, lpCoreI18nProvider, lpCoreTemplateProvider) {
                        if( !lpCoreUtils.isEmpty(wi.getPreference('locale')) ) {
                            lpCoreI18nProvider.useWidgetInstance(wi);
                        }

                        lpCoreTemplateProvider.config({
                            path: lpCoreUtils.getWidgetBaseUrl(wi)
                        });

                        $provide.provider('lpWidget', function() {
                            this.getInstance = this.$get = function() {
                                return wi;
                            };
                        });

                        $provide.value('widget', wi); // will be deprecated

                    });


                    ng.bootstrap(wi.body || wi, [app.name]);

                } else if (utils.isObject(app)) {
                    // Call if you find an init function
                    if (utils.isFunction(app.run)) {
                        app.run.call(null, (typeof wi === 'string' ? ng.element(wi) : wi));
                    }
                }
            });
        }
    };

}));
