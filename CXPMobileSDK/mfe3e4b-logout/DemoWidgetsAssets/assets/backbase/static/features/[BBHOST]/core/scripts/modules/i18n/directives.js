define(function (require, exports) {
    'use strict';

    /**
     * Use lp-i18n angular directive to translate string used in Launchpad Widget HTML template.
     *
     * @example
     * ```
     * <span lp-i18n="Statement as of"></span>
     * ```
     *
     * @example
     * `label`, `placeholder` and `help` attributes inside of `lp-field`, `lp-input`, `lp-text-input`,
     * `lp-password-input` or `lp-checkbox` directives will also be automatically translated:
     *
     * ```
     * <div lp-field="lp-field" label="Enrol for Estatements"></div>
     * ```
     *
     * @memberof core.i18n
     * @ngDirective
     * @ngInject
     */
    exports.lpI18n = function ($compile) {
        function link(scope, el, attr) {
            attr.$observe('lpI18n', function(val) {
                el.attr('translate', val);
                //need to prevent cycle loop on observable
                el.removeAttr('lp-i18n');
                $compile(el)(scope);
            });
        }

        return {
            restrict: 'AE',
            link: link,
            // These 2 options prevent additional other directives recompilations
            // i.e. ngClick would twice, ngRepeat would render infinite loop, etc.
            // Need to set priority higher then any other directive.
            priority: Number.MAX_VALUE,
            terminal: true
        };
    };

    /**
     * @memberof core.i18n
     * @ngDirective
     * @ngInject
     */
    exports.lpI18nSwitch = function (lpCoreBus, lpCoreI18nUtils) {
        function link(scope, el, attr) {
            var locales = attr.lpI18nSwitch;
            if (!locales) { return; }
            locales = locales.split(',');
            var id;

            lpCoreBus.subscribe(lpCoreI18nUtils.LOCALE_CHANGE_EVENT, function (locale) {
                id = locales.indexOf(locale);
            });

            el.on('click', function (e) {
                e.preventDefault();
                id = ++id % locales.length;
                lpCoreBus.publish(lpCoreI18nUtils.LOCALE_CHANGE_EVENT, locales[id]);
            });
        }

        return {
            template: '<span translate="_languageCode"></span>',
            restrict: 'AE',
            link: link
        };
    };

});
