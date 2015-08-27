define(function(require, exports) {
    'use strict';

    // @ngInject
    exports.lpCoreI18nLoader = function(lpCoreUtils, lpCoreI18nUtils) {
        var utils = lpCoreUtils;
        var portalPage = utils.getPortalPage();
        var i18n = utils.getPortalProperty('i18n');
        var commonTranslationsPath = utils.resolvePortalPlaceholders(
            portalPage && portalPage.getPreference('commonTranslationsPath') ||
            i18n.commonTranslationsPath ||
            // #TODO use a common static path to work also stand alone;remove the hardcoded static path
            '$(contextRoot)/bower_components/config/i18n/common.json'
        );
        this.setCommonTranslationsPath = function(path) {
            return utils.resolvePortalPlaceholders(path);
        };

        // @ngInject
        this.$get = function($q, $http, lpI18nCommonTranslation, lpCoreCachePromise, lpCoreBus) {
            /**
             * Helper function to cache the promises
             * @param  {[type]} options [description]
             * @return {[type]}         [description]
             */
            var promiseHttp = function(options) {
                return lpCoreCachePromise({
                    key: options.url,
                    promise: function() {
                        return $http(options);
                    }
                });
            };
            /**
             * Main i18n loader
             * @param  {object} options http option + extra options TODO
             * @return {promise}         returns a promise
             */
            function loader(options) {

                var deferred = $q.defer();
                // extend with ngTranslate options
                utils.extend({
                    url: options.url
                }, options.$http);
                // call the common translations first
                promiseHttp({
                    url: commonTranslationsPath
                })
                // assign to lpI18nCommonTranslation
                .then(function(res) {
                    lpI18nCommonTranslation = res.data;
                    lpCoreBus.publish(lpCoreI18nUtils.COMMON_I18N_LOAD_EVENT, lpI18nCommonTranslation);
                    return options;
                })
                // call the widget translation url
                .then(promiseHttp).then(function(res) {
                    var data = utils.extend({}, lpI18nCommonTranslation[options.key], res.data[options.key]);
                    deferred.resolve(data);
                    return data;
                })
                // IE8 keywords
                ['catch'](function(err) {
                    deferred.reject(err);
                    //lpCoreError.captureException(err);
                })
                 // IE8 keywords
                ['finally'](function(){
                    // #TODO add hooks
                });

                return deferred.promise;
            }

            return loader;
        };
    };

    // @ngInject
    exports.lpCoreI18n = function(lpCoreUtils, $translateProvider, tmhDynamicLocaleProvider, lpCoreI18nUtils) {

        var utils = lpCoreUtils;
        var portalPage = utils.getPortalPage();
        var i18n = utils.getPortalProperty('i18n');
        var locale = lpCoreI18nUtils.parseLocale(
            portalPage && portalPage.getPreference('locale') ||
            i18n.locale ||
            window.navigator.userLanguage || window.navigator.language
        );

        var localePattern = lpCoreUtils.resolvePortalPlaceholders(
            portalPage && portalPage.getPreference('localeLocationPattern') ||
            i18n.localeLocationPattern ||
            // #TODO use a common static path to work also stand alone;remove the hardcoded static path
            '$(contextRoot)/bower_components/config/i18n/ng-locale/angular-locale_{{locale}}.js'
        );

        // Syncing the default locale with Containers
        // This event should be fired only once, not per each widget
        if(window.gadgets && typeof window.gadgets.pubsub.publish === 'function') {
            window.gadgets.pubsub.publish('lpi18n:locale:change', locale.id);
        }

        var defaults = {
            locale: locale.id,
            i18nEndPoint: ''
        };

        // Setting the locale location pattern for dynamic locale switching
        // Should be called for each widget, even if .useWidgetInstance() or .init() are never called
        tmhDynamicLocaleProvider.localeLocationPattern(localePattern);

        /**
         * Set up i18n configuration based on widget instance
         * @param  {object} widget instance widget
         * @return {object}        self provider for chaining
         */
        this.useWidgetInstance = function(widget) {
            this.widget = widget;
            try{
               this.setConfig({
                    i18nEndPoint: this.widget.getPreference(lpCoreI18nUtils.WIDGET_TRANSLATION_PREFERENCE)
                }).init();
            } catch(err) {
                // lpCoreError.captureException(err);
            }
            return this;
        };

        /**
         * Initialize the translation loader and set the default locale language
         * @return {object}        self provider for chaining
         */
        this.init = function() {

            $translateProvider.useLoader('lpCoreI18nLoader', {
                url: this.options.i18nEndPoint + (locale.external ? locale.id + '.json' : lpCoreI18nUtils.ALL_LOCALES_FILE)
            });
            $translateProvider.preferredLanguage(this.options.locale);
            return this;
        };

        /**
         * Extend and set the provider options
         * @return {object}        self provider for chaining
         */
        this.setConfig = function(options) {
            var i18nEndPoint = options.i18nEndPoint;

            if( utils.isEmpty(i18nEndPoint) ) {
                i18nEndPoint = ( utils.getWidgetBaseUrl(this.widget) || defaults.i18nEndPoint );
                i18nEndPoint += lpCoreI18nUtils.DEFAULT_TRANSLATIONS_PATH;
            }

            this.options = utils.defaults( options, defaults);
            this.options.i18nEndPoint = utils.trimRight(i18nEndPoint, '/') + '/';
            return this;
        };
        /**
         * Service i18n
         * @param  {function} $filter          filter in module ng
         * @param  {object}   lpCoreI18nLoader request static loader provider
         * @param  {object}   $translate       ng-translate 3rd party
         * @param  {object}   tmhDynamicLocale dynamic locale switcher 3rd party
         * @return {object}                    i18n Service
         */
        // @ngInject
        this.$get = function($filter, lpCoreI18nLoader, $translate, tmhDynamicLocale) {
            return {
                /**
                 * Sets translation based on locale
                 * @param {string} locale 'en-US'
                 */
                setLocale: function(l) {
                    $translate.use(l);
                    tmhDynamicLocale.set(l.toLowerCase());
                },

                /**
                 * [formatCurrency description]
                 * @param  {number} amount
                 * @param  {string} currency
                 * @return {string}
                 */
                formatCurrency: function (amount, currency) {
                    var symbol = $filter('currencySymbol')(currency);
                    return $filter('currency')(amount, symbol); // built in ng filter, uses page locale.
                },

                formatDate: function(value, format) {
                    return $filter('date')(value, format || 'medium');
                },

                instant: function(string) {
                    return $translate.instant(string);
                }
            };

        };
    };

});
