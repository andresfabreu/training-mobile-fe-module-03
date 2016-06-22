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
        module.exports = factory();
    } else {
        root.requireWidget = factory();
    }
}(this, function() {
    'use strict';

    function trim(str) {
        if (String.prototype.trim) {
            return str.trim();
        }
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        return str.replace(rtrim, '');
    }

    function isFunction(func) {
        return (typeof func === 'function');
    }
    function isObject(obj) {
        return (typeof obj === 'object' && !(obj instanceof Array));
    }
    function isAngularObject(obj) {
        return isObject(obj) && (typeof obj['_invokeQueue'] !== 'undefined');
    }

    // converts module path relative to it's index.html to path relative to portal's static dir
    function normalizePath(rootPath, staticPath, path) {
        try {
            path = trim(path);
            // remove .js from the module path if path is not absolute
            var isAbsolute = new RegExp('^((https?|file)://|/)', 'i');
            if (!isAbsolute.test(path)) {
                path = path.replace(/.js$/, '');
            }
            path = rootPath
                // remove slashes from the end of path
                .replace(/[^\/]*$/, '')
                // remove static dir from absolute path
                .replace(new RegExp('^' + staticPath), '') + path;
        } catch (err) {
            console.log('Error while normalizing module path.');
            throw err;
        }
        return path;
    }

    function addClass(el, className) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }
    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    function addLoadingClass(widgetInstance) {
        var widgetLoadingClass = 'lp-widget-loading';
        var el = widgetInstance.body;

        widgetInstance.loading = function(className) {
            widgetLoadingClass = (className || widgetLoadingClass);
            addClass(el, widgetLoadingClass);
        };
        widgetInstance.loaded = function(doneClass) {
            removeClass(el, widgetLoadingClass);
            if (typeof doneClass === 'string') {
                addClass(el, doneClass);
            }
        };
    }

    return function(widgetInstance, modulePath) {
        var requirejs = window.requirejs;
        // works only if requirejs is available
        if (isFunction(requirejs)) {
            var myDef = widgetInstance.myDefinition;
            modulePath = normalizePath(
                myDef ? myDef.sUrl : '', // root(from /) path to the widget's index.html
                requirejs.s.contexts._.config.baseUrl, // path to the portals static dir
                modulePath
            );

            addLoadingClass(widgetInstance);

            requirejs([modulePath], function(widgetModule) {

                // when widget module exports function
                if (isFunction(widgetModule)) {

                    widgetModule.call(null, widgetInstance);

                // when widget module exports angular module
                } else if (isAngularObject(widgetModule)) {

                    requirejs(['angular', 'core'], function(ng) {
                        // @ngInject - preconfigure module core services
                        widgetModule.config(function(lpCoreWidgetProvider, lpCoreI18nProvider, lpCoreTemplateProvider){
                            lpCoreWidgetProvider.useWidgetInstance(widgetInstance);
                            lpCoreI18nProvider.useWidgetInstance(widgetInstance);
                            lpCoreTemplateProvider.useWidgetInstance(widgetInstance);
                        });

                        ng.bootstrap(widgetInstance.body || widgetInstance, [widgetModule.name]);
                    });

                // when widget module exports object
                } else if (isObject(widgetModule)) {

                    // Call if you find an init function
                    if (isFunction(widgetModule.run)) {
                        if (typeof widgetInstance === 'string') {
                            if (typeof window.jQuery !== 'undefined') {
                                widgetInstance = window.jQuery(widgetInstance);
                            } else {
                                widgetInstance = window.document.querySelectorAll(widgetInstance);
                            }
                        }
                        widgetModule.run.call(null, widgetInstance);
                    }
                }
            });
        }
    };

}));
