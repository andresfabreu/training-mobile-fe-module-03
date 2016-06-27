define(function(require, exports, module) {
    'use strict';

    var base = require('base');

    // @ngInject
    exports.AccountsChartModel = function($rootScope, httpService) {
        /**
         * Accounts Chart service constructor
         * @param config
         * @constructor
         */
        var AccountsChartModel = function(config) {
            base.utils.deprecate('AccountsChartModel is deprecated.');
            this.accountsChartModel = httpService.getInstance({
                endpoint: config.accountsChartEndpoint,
                urlVars: {
                    accountId: config.accountId
                }
            });
            this.chartData = null;
            this.error = false;
        };

        /**
         * Load data from server
         * @param queryParams {}
         */
        AccountsChartModel.prototype.load = function(queryParams) {
            var self = this,
                $xhr;

            $xhr = self.accountsChartModel.read(queryParams).success(function(data){
                self.chartData = data;
            });

            $xhr.error(function(data){
                if(data.errors) {
                    self.error = data.errors[0].code;
                }
            });

            return $xhr;
        };

        return {
            getInstance: function(config) {
                return new AccountsChartModel(config);
            }
        };
    };
});
