/**
 * Launchpad Template Module
 *
 * @copyright Backbase B.V.
 * @author Backbase R&D - Amsterdam - New York
 *
 * @name template
 * @memberof core
 * @ngModule
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

    // =============================
    // Providers
    // =============================

    /**
     * Helper service used by lpTemplate directive.
     *
     * @alias lpCoreTemplate
     * @memberof core.template
     * @ngProvider
     * @ngInject
     */
    providers.lpCoreTemplate = function(lpCoreUtils) {

        var defaults = {
        };

        var API = {};

        /**
         * Set provider options.
         * @param {Object} options Default options for lpCoreTemplate service.
         * @returns {Object} this templateProvider instance.
         */
        this.config = function(options) {

            if (options.path) {
                options.path = lpCoreUtils.trimRight(options.path, '/');
            }

            defaults = lpCoreUtils.extend(defaults, options);

            return this;
        };

        // Provider Template instance
        // @ngInject
        this.$get = function(lpCoreConfiguration) {
            /**
             * Provider API
             * @memberof core.template.lpCoreTemplate
             * @class
             */
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
             * @returns {Object} configuration option
             */
            API.prototype.getOptions = function() {
                return this.options;
            };

            /**
             * Resolve template ID
             *
             * @param   {String}  id
             * @returns {String}
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
             * @returns {String}
             */
            API.prototype.getTemplatePath = function() {
                return this.options.path;
            };

            return new API(defaults);
        };
    };

    // =============================
    // Directives
    // =============================

    /**
     * Wrapper around [ngInclude][1] directive. Fetches, compiles and includes an external HTML fragment.
     *
     * ##### Attributes
     *
     * ###### src
     *
     * lpTemplate uses `src` attribute as template path. The value of the attribute should be valid Angular expression. For static paths string literal should be used.
     *
     * If `src` is not provided `lp-template` attribute is used.
     *
     * Below two examples using string literals are equivalent:
     *
     * ```
     * <lp-template src="'templates/accounts.html'"></lp-template>
     * <div lp-template="'template/accounts.html'"></div>
     * ```
     *
     * Template path could be configured in controller, in this case quotes are not needed:
     *
     * ```
     * <lp-template src="templates.iban"></lp-template>
     * ```
     *
     * ###### name
     *
     * `lpTemplate` can also accept optional argument `name`. If provided, it is used for identifing template for customization with template path property. See next section for details.
     *
     * If `name` attribute is missing (in most cases) then template key is extracted from resolved template path as substring between last `/` and before `.html` strings. For example, if template path (result of evaluation of the expression for src) is `templates/accounts-header.html` then corresponding template key is `accounts-header`.
     *
     * ##### Template keys
     *
     * `lpTemplate` directive uses unique identifiers in order to provide a way to overwrite template path with custom preference. Special proprty name must conform the following format:
     *
     * ```
     * widgetTemplate_{template key}
     * ```
     *
     * Every widget that uses `lpTemplate` and allows template cutomization should describe template keys it provides.
     *
     * In above example with accounts-header key corresponding property would be `widgetTemplate_accounts-header`.
     *
     * [1]: https://docs.angularjs.org/api/ng/directive/ngInclude
     *
     * @alias lpTemplate
     * @memberof core.template
     * @ngDirective
     * @ngInject
     */
    directives.lpTemplate = function($compile, lpCoreTemplate, lpCoreUtils) {

        /**
         * @memberof core.template.lpTemplate
         * @param {Object} scope
         * @param {Object} attrs
         * @returns {String} Angular html template
         */
        function getTemplate(scope, attrs, callback) {

            var options = lpCoreTemplate.getOptions(),
                srcExp = decodeURIComponent(attrs.lpTemplate || attrs.src),
                templateKey,
                customTemplate;

            scope.$watch(srcExp, function(src) {

                if (!src) {

                    // For backward compatibility
                    // If it's "undefined" but looks like template path with html extension then skip it in this digest
                    if (src === undefined && !/\.html$/.test(srcExp)) {
                        return callback();
                    }

                    // This is likely deprecated old syntax just use this path as is
                    lpCoreUtils.deprecate('Template expression "' + srcExp + '" is invalid and evaluated to "' + src + '". Raw path is used as is. See LPES-4017 for details.');
                    src = srcExp;
                }

                // If attribute "name" is provided take it as template key otherwise try to extract it from template path
                if (attrs.name) {
                    templateKey = attrs.name;
                }
                else {
                    var match = src.match(/(?:^|\/)([^\/]+?)\.html$/);
                    templateKey = match && match[1];
                }

                if (templateKey && options.templates[templateKey]) {

                    customTemplate = options.templates[templateKey];

                    if (/^https?:\/\//.test(customTemplate)) {
                        src = customTemplate;
                    }
                    else {
                        src = lpCoreTemplate.resolveTemplateSrc(customTemplate);
                    }
                }
                else {
                    src = lpCoreTemplate.resolveTemplateSrc(src);
                }

                callback('<div class="ng-transclude-node"></div><div ng-include src="\'' + src + '\'"></div>');

            });
        }

        // Directive configuration
        return {
            restrict: 'AE',
            transclude: true,
            priority: Number.MAX_VALUE,
            link: function(scope, element, attrs, controller, $transclude) {

                getTemplate(scope, attrs, function(template) {

                    if (template) {
                        element.html(template).show();

                        // manually transclude content
                        $transclude(function(clone) {
                            element.find('.ng-transclude-node').html(clone);
                        });

                        $compile(element.contents())(scope);
                    }
                });
            }
        };
    };

    module.exports = base.createModule(module.name, deps)
        .provider(providers)
        .directive(directives);
});
