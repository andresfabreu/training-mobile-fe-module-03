/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : providers.js
 *  Description:
 *  Transactions Charts Component Provider
 *  ----------------------------------------------------------------
 */

define(function (require, exports, module) {

    'use strict';

    // @ngInject
    exports.lpAccountsChartData = function(lpCoreUtils, $http) {
        var defaults = {
            accountsChartEndpoint: '',
            accountId: null
        };

        /**
         * Accounts Chart service constructor
         * @param config
         * @constructor
         */
        var AccountsChartModel = function(config) {
            this.config = lpCoreUtils.extend({}, defaults, config);
            this.chartData = null;
            this.error = false;
        };

        AccountsChartModel.prototype.setId = function(id) {
            this.config.accountId = id;
        };

        /**
         * Load data from server
         * @param queryParams {}
         */
        AccountsChartModel.prototype.load = function(queryParams) {
            var self = this,
                $xhr;

            $xhr = $http.get(this.config.accountsChartEndpoint, {
                data: {
                    accountId: this.config.accountId
                },
                params: queryParams
            }).success(function(data){
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

    // @ngInject
    exports.lpTransactionsChartData = function(lpCoreUtils, $http) {
        var defaults = {
            transactionsChartEndpoint: '',
            accountId: null
        };

        /**
         * Transactions Chart service constructor
         * @param config
         * @constructor
         */
        var TransactionsChartModel = function(config) {
            this.config = lpCoreUtils.extend({}, defaults, config);
            this.chartData = null;
            this.error = false;
        };

        TransactionsChartModel.prototype.setId = function(id) {
            this.config.accountId = id;
        };

        /**
         * Load data from server
         * @param queryParams {}
         */
        TransactionsChartModel.prototype.load = function(queryParams) {
            var self = this,
                $xhr;

            $xhr = $http.get(this.config.transactionsChartEndpoint, {
                data: {
                    accountId: this.config.accountId
                },
                params: queryParams
            }).success(function(data){
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
                return new TransactionsChartModel(config);
            }
        };
    };
});
