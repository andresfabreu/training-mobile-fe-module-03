/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : template.js
 *  Description: Launchpad Template Module
 *  ----------------------------------------------------------------
 */

define(function(require, exports, module) {

    'use strict';

    module.name = 'core.template';

    var base = require('base');

    // external module deps
    var deps = [];
    // providers holder
    var providers = {};
    // directives holder
    var directives = {};

    /*----------------------------------------------------------------*/
    /* Providers
    /*----------------------------------------------------------------*/
    // @ngInject
    providers.lpCoreTemplate = function(lpCoreUtils) {

        var defaults = {
        };

        var API = {};

        /**
         * Set provider options
         * @param  {object} options
         * @return {object} this        templateProvider instance
         * #TODO
         * - parse the widget src preference and return the folder path as default path
         */
        this.config = function(setOptions) {
            if (setOptions.path) {
                setOptions.path = lpCoreUtils.trimRight(setOptions.path, '/');
            }

            defaults = lpCoreUtils.extend(defaults, setOptions);

            return this;
        };

        // Provider Template instance
        // @ngInject
        this.$get = function(lpCoreConfiguration) {
            API = function(options) {
                this.options = options;

                // Initialise defaults.
                lpCoreUtils.defaults(
                    this.options,
                    {
                        // Default template path is the ABS path from config.
                        path: lpCoreConfiguration.getAbsPath()
                    }
                );
            };

            /**
             * get provider configuration
             * @return {object} configuration option
             */
            API.prototype.getOptions = function() {
                return this.options;
            };

            /**
             * Resolve template ID
             *
             * @param {string} id
             * @return {string}
             */
            API.prototype.resolveTemplateSrc = function(id) {
                var path = this.getTemplatePath();
                if (path === '/') {
                    return path + id;
                }
                else {
                    return [path, id].join('/');
                }
            };

            /**
             * Get absolute template path.
             *
             * @return {string}
             */
            API.prototype.getTemplatePath = function() {
                return this.options.path;
            };

            return new API(defaults);
        };
    };

    /*----------------------------------------------------------------*/
    /* Directives
    /*----------------------------------------------------------------*/

    // @ngInject
    directives.lpTemplate = function(lpCoreTemplate) {

        /**
         * inline Template
         * @return {string} angular html template
         * #TODO
         *     - trim trailing slashes in tplOptions.path
         *     - resolve relative src like: './' or '../'
         */

        function templateFn(el, attrs) {
            var id = (attrs.lpTemplate || attrs.src);
            var src = lpCoreTemplate.resolveTemplateSrc(id);

            return [
                '<div ng-transclude></div>',
                '<div ng-include src="\'' + src + '\'"></div>'
            ].join('');
        }

        // Directive configuration
        return {
            restrict: 'AE',
            transclude: true,
            priority: Number.MAX_VALUE,
            template: templateFn
        };
    };

    module.exports = base.createModule(module.name, deps)
        .provider(providers)
        .directive(directives);
});
