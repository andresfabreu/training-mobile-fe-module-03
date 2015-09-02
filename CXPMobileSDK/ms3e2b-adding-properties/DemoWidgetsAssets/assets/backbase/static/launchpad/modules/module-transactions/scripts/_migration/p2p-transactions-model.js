define(function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.P2PTransactionsModel = function(httpService) {
        /**
         * P2P Transactions service constructor
         * @param config
         * @alias P2PTransactionsModel
         * @constructor
         */
        var P2PTransactionsModel = function(config) {

            this.transactionsEndpoint = config.transactionsEndpoint;

            this.locale = config.locale;
            this.pageSize = config.pageSize || 20;
            this.pageOffset = 0;

            this.transactions = [];
            this.moreAvailable = true;
            this.messages = {};
            this.errorCode = null;

            this.accountsArray = [];
        };

        /**
         * Clears list of transactions and resets pageOffset counter
         */
        P2PTransactionsModel.prototype.clearTransactionsList = function() {

            this.transactions = [];
            this.moreAvailable = true;
            this.pageOffset = 0;
        };

        /**
         * Loads a new set of transactions for the given list of accounts
         * @param accounts
         */
        P2PTransactionsModel.prototype.loadTransactions = function(accounts) {

            this.clearTransactionsList();
            this.accountsArray = accounts;

            return this.loadMoreTransactions();
        };

        /**
         * Load transactions
         * @param account (pass account only for first load)
         */
        P2PTransactionsModel.prototype.loadMoreTransactions = function() {

            var self = this;

            this.loading = true;

            var service = httpService.getInstance({
                endpoint: this.transactionsEndpoint,
                urlVars: {}
            });

            var queryParams = {
                accountIds: this.accountsArray.join(','),
                offset: this.pageOffset,
                limit: this.pageSize
            };

            var promise = service.read(queryParams);
            promise.then(function(response) {
                // success callback
                self.pageOffset += self.pageSize;

                var newTransactions = self.preprocessTransactions(response.data);
                if (newTransactions && newTransactions.length < self.pageSize) {
                    self.moreAvailable = false;
                }

                self.transactions = self.transactions.concat(newTransactions);

            }, function(response) {
                // error callback
                self.errorCode = response.errorCode || 500;
            });
            promise['finally'](function() {
                self.loading = false;
            });

            return promise;
        };

        /**
         * Enriches data with presentation logic
         * @param transactions
         * @returns {*}
         */
        P2PTransactionsModel.prototype.preprocessTransactions = function(transactions) {
            var result = [];

            if (transactions && transactions.length > 0) {
                result = transactions.map(function(currentValue, index) {
                    var currDate = new Date(currentValue.initiationDateTime);

                    // handle date show/hide
                    currentValue.showDate = true;
                    if (index > 0) {
                        var prevDate = new Date(transactions[index - 1].initiationDateTime);
                        currentValue.showDate = prevDate.getDate() !== currDate.getDate() ||
                            prevDate.getMonth() !== currDate.getMonth() ||
                            prevDate.getFullYear() !== currDate.getFullYear();
                    }

                    // add accept and reject buttons on transactions
                    currentValue.requiresUserAction = false;
                    if (currentValue.creditDebitIndicator === 'CREDIT' && currentValue.status === 'PENDING') {
                        currentValue.requiresUserAction = true;
                    }

                    return currentValue;
                });
            }

            return result;
        };

        /**
         * Checks for errors while loading transactions
         * @returns {boolean}
         */
        P2PTransactionsModel.prototype.allowMoreResults = function() {

            return (!this.loading && this.moreAvailable) && !this.errorCode;
        };

        /**
         * Checks for errors during download and ensures that no transactions have been loaded
         * @returns {boolean}
         */
        P2PTransactionsModel.prototype.noTransactionsFound = function() {

            return (!this.loading && this.transactions.length === 0) && !this.errorCode;
        };

        return {
            getInstance: function(config) {
                return new P2PTransactionsModel(config);
            }
            // availableFilters: availableFilters
        };
    };
});
