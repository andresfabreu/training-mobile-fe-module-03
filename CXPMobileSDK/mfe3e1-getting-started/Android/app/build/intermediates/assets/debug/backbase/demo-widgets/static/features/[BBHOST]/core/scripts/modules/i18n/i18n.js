define(function(require, exports, module) {
    'use strict';

    // when triggering LOCALE_CHANGE event in the run phase, do it only once
    var once = true;
    var options;

    function getHtmlAttr(name) {
        return document.getElementsByTagName('html')[0].getAttribute(name);
    }

    /**
     * @memberof core.i18n
     * @ngProvider
     * @ngInject
     */
    exports.lpCoreI18n = function(lpCoreUtils, $translateProvider, lpCoreI18nUtils, tmhDynamicLocaleProvider) {

        // runs only once
        if (!options) {
            var lp = window.launchpad;

            options = {
                locale: lpCoreI18nUtils.parseLocale(
                    getHtmlAttr('lang') || getHtmlAttr('xml:lang') ||
                    navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage
                ),
                merged: true,
                i18nPath: lpCoreUtils.resolvePortalPlaceholders(
                    lp ? '$(contextRoot)/static/launchpad/modules/config/i18n' : '/bower_components/config/i18n'
                )
            };

            if (lp && lp.i18n) {
                options.merged = lp.i18n.mergedFiles;
                options.i18nPath = lpCoreUtils.resolvePortalPlaceholders(lp.i18n.path);
            }
        }

        tmhDynamicLocaleProvider.localeLocationPattern(options.i18nPath + '/ng-locale/angular-locale_{{locale}}.js');
        $translateProvider.preferredLanguage(options.locale);

        /**
         * Set up i18n configuration based on widget instance
         * @param {Object} widget instance widget
         */
        this.useWidgetInstance = function(widgetInstance) {
            if(lpCoreUtils.isEmpty(widgetInstance.getPreference('locale'))) {
                return;
            }

            $translateProvider.useLoader('lpCoreI18nLoader', {
                i18nPath: options.i18nPath,
                merged: options.merged,
                widgetUrl: lpCoreUtils.getWidgetBaseUrl(widgetInstance)
            });
        };

        /**
         * Service i18n
         * @param   {Function} $filter           Filter in module ng
         * @param   {Object}   lpCoreI18nLoader  Request static loader provider
         * @param   {Object}   $translate        ng-translate 3rd party
         * @param   {Object}   tmhDynamicLocale  Dynamic locale switcher 3rd party
         * @private
         * @returns {Object}                     i18n Service
         * @ngInject
         */
        this.$get = function($filter, lpCoreI18nLoader, $translate, tmhDynamicLocale, lpCoreBus) {
            // Syncing the default locale with Containers
            // This event should be fired only once, not per each widget
            // setLocale methods of the widget are subsribed to this event
            if (once) {
                setTimeout(function () {
                    lpCoreBus.publish(lpCoreI18nUtils.LOCALE_CHANGE_EVENT, options.locale);
                }, 0);
                once = false;
            }
            return {
                /**
                 * Changes locale of the widget module.
                 * @memberof core.i18n.lpCoreI18n
                 * @param {String} locale Locale string, e.g. 'en-US'
                 */
                setLocale: function(locale) {
                    $translate.use(locale);
                    tmhDynamicLocale.set(locale.toLowerCase());
                },

                /**
                 * Returns proper currency format, using currency filter.
                 *
                 * @example
                 * ```
                 * lpCoreI18n.formatCurrency(24, 'USD'); // "$24"
                 * ```
                 *
                 * @memberof core.i18n.lpCoreI18n
                 * @param   {Number} amount    Amount
                 * @param   {String} currency  Currency code
                 * @returns {String} Formatted string
                 */
                formatCurrency: function (amount, currency) {
                    var symbol = $filter('currencySymbol')(currency);
                    return $filter('currency')(amount, symbol); // built in ng filter, uses page locale.
                },

                /**
                 * Returns localized date format, using date filter
                 *
                 * @example
                 * ```
                 * lpCoreI18n.formatDate(1288323623006, 'yyyy-MM-dd HH:mm:ss Z'); // "2010-10-29 05:40:23 +0200"
                 * ```
                 *
                 * @memberof core.i18n.lpCoreI18n
                 * @param   {Number} value   Date as Unix timestamp
                 * @param   {String} format  Format
                 * @returns {String}
                 */
                formatDate: function(value, format) {
                    return $filter('date')(value, format || 'medium');
                },

                /**
                 * Returns a translation instantly from the internal state of loaded translation.
                 *
                 * @example
                 * ```
                 * lpCoreI18n.instant('Enrol for Estatements'); // "Schrijf je in voor eStatements" for locale "nl-NL"
                 * ```
                 *
                 * @memberof core.i18n.lpCoreI18n
                 * @param   {String} string  A string which represents a translation id or array of strings.
                 * @returns {String}
                 */
                instant: function(string) {
                    return $translate.instant(string);
                }

            };

        };
    };

});


