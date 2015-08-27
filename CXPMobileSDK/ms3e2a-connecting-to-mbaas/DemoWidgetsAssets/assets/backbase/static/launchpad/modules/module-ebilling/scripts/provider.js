define(function(require, exports, module) {
    'use strict';
    /**
     * EBill Module Provider
     * with default configuration
     */
    // @ngInject
    exports.lpEbilling = function() {

        // @ngInject
        this.$get = function($q, $http, lpCoreUtils, lpEbillingUtils, lpEbillingCache, AccountsModel) {

            var config = {
                // Default options
                baseUrl: '',
                locale: 'en',
                debitOrdersSrc: '',
                mandatesSrc: '',
                dateListFormat: 'MMM dd',
                showCurrencySym: true,
                templates: {},
                cache: {
                    enable: false
                }

            };

            var cache = lpEbillingCache;
            cache.init(config.cache);


            return {
                 getAccounts: function() {
                    var d = $q.defer();
                    var accountsData = cache.get('accounts');
                    if (accountsData) {
                        d.resolve(accountsData);
                    } else {
                        AccountsModel.setConfig({
                            accountsEndpoint: config.accountsEndPoint
                        });
                        AccountsModel.load().then(function(response) {
                                if (response) {
                                    cache.put('accounts', response);
                                    d.resolve(response);
                                } else {
                                    d.reject();
                                }
                            }, function(errObj) {
                                d.reject(errObj);
                            });
                    }

                    return d.promise;
                },
                /**
                 * [getTemplate description]
                 * @param  {[type]} k [description]
                 * @return {[type]}   [description]
                 */
                getTemplate: function(k) {
                    if (!config.templates[k]) {
                        throw new Error('Unable to resolve template : ' + k);
                    }
                    var templateUrl = config.baseUrl + config.templates[k];
                    return templateUrl;
                },

                setConfig: function(options) {
                    config = lpCoreUtils(options).chain()
                        .mapValues(lpCoreUtils.resolvePortalPlaceholders)
                        .defaults(config)
                        .value();
                    return this;
                },
                /**
                 * [getConfig description]
                 * @param  {string} prop preference string property
                 * @return {string/object}      preference value
                 */
                getConfig: function(prop) {
                    if (prop && lpCoreUtils.isString(prop)) {
                        return config[prop];
                    } else {
                        return config;
                    }
                }
            };
        };

    };
});
