define(function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpWealth = function () {

        var defaults = {
            portfolioEndPoint: '',
            timespan: '3 years',
            frequency: 'monthly'
        };

        // @ngInject
        this.$get = function (lpCoreUtils) {
            var config = defaults;

            return {
                setConfig: function(options) {
                    config = lpCoreUtils(options).chain()
                        .mapValues(lpCoreUtils.resolvePortalPlaceholders)
                        .defaults(defaults)
                        .value();

                    return this;
                },

                getConfig: function(prop) {
                    return prop && lpCoreUtils.isString(prop) ? config[prop] : config;
                }
            }
        };
    };
});
