
define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.PreferencesController = function($scope, lpWidget, $timeout, lpCoreI18n, lpCoreI18nUtils,
        lpCoreUtils, lpCoreBus, lpCoreError, dropdownSelectConfig, AccountsModel, PreferenceService/*, LandingLinksService*/) {

        var widget = lpWidget;
        var util = lpCoreUtils;
        var localeSelectorPref = widget.getPreference('localeSelector');
        var balanceSelectorPref = widget.getPreference('balanceSelector');
        var categorizationSelectorPref = widget.getPreference('categorizationSelector');
        var inited = false;
        // service data is stored here
        var accounts, preferences;

        /**
         * Hash type preference parser
         * @param {String} str - String where selection items are divided by comma and key/value pairs by colon
         * @returns {Object} key/value hash
         */
        function parseSelector(str) {
            if (!str) {
                return {};
            }
            var pair, ret = [];
            try {
                var items = str.split(',');
                util.each(items, function(v) {
                    pair = v.split(':');
                    util.each(pair, util.trim);
                    if (pair.length === 2) {
                        ret.push({
                            value: pair[0],
                            text: lpCoreI18n.instant(pair[1])
                        });
                    }
                });
                return ret;
            } catch(e) {
                lpCoreError.captureException(e);
            }
        }

        function initDropboxes() {
            var localeSelector = parseSelector(localeSelectorPref);
            var balanceSelector = parseSelector(balanceSelectorPref);
            var categorizationSelector = parseSelector(categorizationSelectorPref);
            dropdownSelectConfig.emptyPlaceholderText = lpCoreI18n.instant('Nothing selected');

            $scope.control = {
                preferredName: {
                    value: preferences.preferredName,
                    errors: [],
                    loading: false,
                    validate: function(name) {
                        if(name.length < 3) {
                            return 'invalid_name';
                        }
                        return true;
                    }
                },
                locale: {
                    value: preferences.lpLocale,
                    options: localeSelector,
                    loading: false
                },
                defaultAccount: {
                    value: preferences.defaultAccount,
                    options: accounts,
                    loading: false
                },
                preferredBalanceView: {
                    value: preferences.preferredBalanceView,
                    options: balanceSelector,
                    loading: false
                },
                pfm: {
                    value: preferences.pfm,
                    options: categorizationSelector,
                    loading: false
                }
            };


        }

        AccountsModel.setConfig({
            accountsEndpoint: widget.getPreference('accountsDataSrc')
        });

        AccountsModel.load().then(function(acnts) {
            accounts = acnts;
            // this service is reading widget preference for service path on it's own
            PreferenceService.read().then(function(prefs) {
                preferences = prefs.data;
                preferences.pfmEnabled = util.parseBoolean(preferences.pfmEnabled);
                initDropboxes();
                inited = true;
            });
        });

        lpCoreBus.subscribe(lpCoreI18nUtils.LOCALE_CHANGE_EVENT, function() {
            if (inited) {
                $timeout(initDropboxes, 10);
            }
        });

        $scope.save = function(key, value) {

            PreferenceService.put(key, value)
            .then(function(res) {
                preferences[key] = value;
                if (key === 'lpLocale') {
                    lpCoreBus.publish(lpCoreI18nUtils.LOCALE_CHANGE_EVENT, value);
                }
            });

        };

    };
});
