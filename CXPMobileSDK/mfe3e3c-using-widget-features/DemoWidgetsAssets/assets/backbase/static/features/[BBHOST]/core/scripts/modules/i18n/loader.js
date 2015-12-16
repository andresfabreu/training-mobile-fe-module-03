define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpCoreI18nLoader = function(lpCoreUtils, lpCoreI18nUtils, $q, $http, lpI18nCommonTranslation, lpCoreCachePromise, lpCoreBus, lpCoreError) {
            /**
             * Returns either cached promise or new one.
             * @param {String} url - Url of the translation file.
             * @returns {Object} Promise object
             */
            function getPromise(url) {
                return lpCoreCachePromise({
                    key: url,
                    promise: function() {
                        return $http.get(url);
                    }
                });
            }
            /**
             * Main i18n loader
             * @param {Object} options - Loader options
             * @param {String} options.key - Locale string, added by angular-translate automatically
             * @param {String} options.widgetUrl - Url of the widget
             * @param {String} options.i18nPath - Path where translation files are stored
             * @param {Boolean} options.merged - If false, load (key).json, otherwise load ALL_LOCALES_FILE
             * @returns {Object} Promise object
             */
            return function (options) {
                // widget translation path
                var wUrl = options.widgetUrl + lpCoreI18nUtils.DEFAULT_TRANSLATIONS_PATH;
                wUrl = lpCoreUtils.trimRight(wUrl, '/') + '/' + (options.merged ? lpCoreI18nUtils.ALL_LOCALES_FILE : (options.key + '.json'));
                // common translations path
                var cUrl = options.i18nPath + '/' + (options.merged ? 'common.json' : (options.key + '.json'));

                return $q.all({
                    common: getPromise(cUrl),
                    widget: getPromise(wUrl)
                }).then(function(res) {
                    var data;
                    if (options.merged) {
                        // if all translations are in the same file, set them only once
                        if (!lpI18nCommonTranslation) {
                            lpI18nCommonTranslation = res.common.data; // TODO: doesn't work with [key], check for bug in deck container
                            lpCoreBus.publish(lpCoreI18nUtils.COMMON_I18N_LOAD_EVENT, lpI18nCommonTranslation);
                        }
                        data = lpCoreUtils.extend({}, res.common.data[options.key], res.widget.data[options.key]);
                    } else {
                        lpI18nCommonTranslation = res.common.data;
                        lpCoreBus.publish(lpCoreI18nUtils.COMMON_I18N_LOAD_EVENT, lpI18nCommonTranslation);

                        data = lpCoreUtils.extend({}, res.common.data, res.widget.data);
                    }

                    return data;
                }).catch(function(err) {
                    lpCoreError.captureException(err);
                });
            };

    };
});
