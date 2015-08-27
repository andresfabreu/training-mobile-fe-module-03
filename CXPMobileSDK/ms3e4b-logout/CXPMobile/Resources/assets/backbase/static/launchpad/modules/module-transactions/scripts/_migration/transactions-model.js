/**
 * Retrieves a list of transactions from the server and maintains their state
 * @author philip@backbase.com
 * @copyright Backbase B.V, 2013
 * @module transactions-model
 * @exports TransactionsModel
 */
define(function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.TransactionsModel = function(httpService, lpTagsUtils, lpCoreUtils) {
        var availableFilters = {
            QUERY: 'query',
            FROM_DATE: 'fromDate',
            TO_DATE: 'toDate',
            FROM_AMOUNT: 'fromAmount',
            TO_AMOUNT: 'toAmount',
            CONTACT: 'contact',
            CATEGORY: 'category',
            DEBITCREDIT: 'bk'
        };

        /**
         * Transactions service constructor
         * @param config
         * @alias TransactionsModel
         * @constructor
         */
        var TransactionsModel = function(config) {

            this.transactionsEndpoint = config.transactionsEndpoint;
            this.transactionDetailsEndpoint = config.transactionDetailsEndpoint;

            this.locale = config.locale;
            this.pageSize = config.pageSize || 20;

            this.sort = '-bookingDateTime';

            this.transactions = [];
            this.moreAvailable = true;
            this.messages = {};
            this.from = 1;
            this.errorCode = null;

            this.pfmEnabled = true;

            this.account = null;
        };

        /**
         * Clears list of transactions and resets from counter
         */
        TransactionsModel.prototype.clearTransactionsList = function() {

            this.transactions = [];
            this.moreAvailable = true;
            this.from = 1;
        };

        /**
         * Sets the search filters to be used when next loading transactions from the server
         * @param filters
         */
        TransactionsModel.prototype.setFilters = function(filters) {
            if (lpTagsUtils) {
                lpTagsUtils.setFilter(filters);
                this.filters = lpTagsUtils.getFilters();
            } else {
                this.filters = filters;
            }

        };

        /**
         * Clears any current search filters
         */
        TransactionsModel.prototype.clearFilters = function() {
            if (lpTagsUtils) {
                this.filters = lpTagsUtils.clearFilters();
            } else {
                this.filters = {};
            }

        };

        /**
         * Updates current search filters
         */
        TransactionsModel.prototype.updateFilters = function() {
            if (lpTagsUtils) {
                this.filters = lpTagsUtils.getFilters();
            } else {
                this.filters = {};
            }

        };

        /**
         * Loads a new set of transactions for the given account
         * @param account
         */
        TransactionsModel.prototype.loadTransactions = function(account) {

            this.clearTransactionsList();

            this.account = account;
            return this.loadMoreTransactions();
        };

        /**
         * Load transactions
         * @param account (pass account only for first load)
         */
        TransactionsModel.prototype.loadMoreTransactions = function() {

            var self = this;

            this.loading = true;

            if(!this.account) {
                throw new Error('No account specified');
            }

            var service = httpService.getInstance({
                endpoint: this.transactionsEndpoint,
                urlVars: {
                    accountId: this.account.id
                }
            });

            var queryParams = {
                f: this.from,
                l: this.pageSize
            };

            // Key:
            // a: action
            // q: query
            // df: Date from
            // dt: Date to
            // af: Amount from,
            // at: Amount to
            // ca: counter party account
            // categoryIds: category ids
            // bk: debit:1, credit:2
            if (this.filters) {
                if (this.filters.query) {
                    queryParams.a = 'search';
                    queryParams.q = this.filters[availableFilters.QUERY];
                }
                if (this.filters[availableFilters.FROM_DATE] && this.filters[availableFilters.TO_DATE]) {
                    queryParams.df = this.filters[availableFilters.FROM_DATE];
                    queryParams.dt = this.filters[availableFilters.TO_DATE];
                }
                if (this.filters[availableFilters.FROM_AMOUNT] && this.filters[availableFilters.TO_AMOUNT]) {
                    queryParams.af = this.filters[availableFilters.FROM_AMOUNT];
                    queryParams.at = this.filters[availableFilters.TO_AMOUNT];
                }
                if (this.filters[availableFilters.CONTACT]) {
                    queryParams.ca = this.filters[availableFilters.CONTACT];
                }
                if (this.filters[availableFilters.CATEGORY]) {
                    queryParams.categoryIds = this.filters[availableFilters.CATEGORY];
                }
                if (this.filters[availableFilters.DEBITCREDIT]) {
                    queryParams.bk = this.filters[availableFilters.DEBITCREDIT];
                }
            }

            //the minus here means descending order
            queryParams.sort = this.sort;

            var xhr = service.read(queryParams);
            xhr.success(function(data) {

                //need to normalize null data to empty array
                if(data === null || data === 'null') {
                    data = [];
                }

                //update paging info
                self.from = self.from + self.pageSize;

                var newTransactions = self.preprocessTransactions(data);
                if(newTransactions && newTransactions.length < self.pageSize) {
                    self.moreAvailable = false;
                }

                self.transactions.length = queryParams.f - 1; // Reduce array in case there is request conflict
                self.transactions = self.transactions.concat(newTransactions);
            });
            xhr.error(function(data) {
                self.errorCode = data.errorCode || 500;
            });
            xhr['finally'](function() {
                self.loading = false;
            });

            return xhr;
        };

        /**
         * Enriches data with presentation logic
         * @param transactions
         * @returns {*}
         */
        TransactionsModel.prototype.preprocessTransactions = function(transactions) {

            if(transactions) {
                transactions = transactions.map(function(transaction, i) {

                    //figure out if the date should be displayed as a new date
                    var prevDate =
                        transactions[i - 1] ?
                            new Date(transactions[i - 1].bookingDateTime) :
                            new Date(new Date().getTime() + (1000 * 60 * 60 * 24)); //arbitrary future day
                    var currDate = new Date(transaction.bookingDateTime);
                    transaction.newDate =
                        prevDate.getDate() !== currDate.getDate() ||
                            prevDate.getMonth() !== currDate.getMonth() ||
                            prevDate.getFullYear() !== currDate.getFullYear();

                    //normalize empty details to be null
                    if(!transaction.details) {
                        transaction.details = null;
                    }

                    //create details tab boolean values
                    transaction.detailTabs = {
                        details: true,
                        categories: false
                    };

                    //move this to view?
                    if(transaction.creditDebitIndicator === "DBIT") {
                        transaction.transactionAmount *= -1;
                    }

                    return transaction;
                });
            }
            return transactions;
        };

        /**
         * Enriches data with presentation logic
         * @param transactions
         * @returns {*}
         */
        TransactionsModel.prototype.loadTransactionDetails = function(transaction) {
            var self = this;

            if(!transaction.details || lpCoreUtils.isEmpty(transaction.details)) {
                transaction.loading = true;

                this.transactionDetailsService = httpService.getInstance({
                    endpoint: this.transactionDetailsEndpoint,
                    urlVars: {
                        transactionId: transaction.id,
                        accountId: this.account.id
                    }
                });

                var xhr = this.transactionDetailsService.read();
                xhr.success(function(data) {
                    transaction.details = self.preprocessTransactionDetails(data, transaction);
                });
                xhr.error(function(data) {
                    transaction.errorCode = data.errorCode || 500;
                });
                xhr['finally'](function() {
                    transaction.loading = false;
                    // transaction.displayDetails = transaction.displayDetails ? false : true;
                });
                return xhr;
            }
            // transaction.displayDetails = transaction.displayDetails ? false : true;
        };


        TransactionsModel.prototype.updateTransactionCategory = function(transaction, categoryId) {
            var service = httpService.getInstance({
                contentType: 'application/json',
                endpoint: this.transactionsEndpoint + '/' + transaction.id,
                urlVars: {
                    accountId: this.account.id
                }
            });

            var xhr = service.update({
                data: {
                    categoryId: categoryId
                }
            });
            xhr.success(function(data) {
                transaction.categoryId = categoryId;
            });
            xhr.error(function(data) {
                transaction.errorCode = data.errorCode || 500;
            });

            return xhr;
        };

        TransactionsModel.prototype.updateSimilarTransactionCategory = function(transaction, categoryId) {
            var service = httpService.getInstance({
                endpoint: this.transactionsEndpoint,
                contentType: 'application/json',
                urlVars: {
                    accountId: this.account.id
                }
            });

            var xhr = service.update({
                data: {
                    id: transaction.id,
                    condition: 'SIMILAR',
                    categoryId: categoryId
                }
            });
            xhr.success(function(data) {
                transaction.categoryId = categoryId;
            });
            xhr.error(function(data) {
                transaction.errorCode = data.errorCode || 500;
            });

            return xhr;
        };

        /**
         * Enriches/updates data ready for view rendering
         * @param transactions
         * @returns {*}
         */
        TransactionsModel.prototype.preprocessTransactionDetails = function(details, transaction) {

            var specialDetails = [];
            var customDetails = [];

            var detailsToOmit = [
                'location'
            ];
            var specialDetailsKeys = [
                'address',
                'merchantType',
                'bookingDateTime'
            ];

            var longValueKeys = [
                "transactionId"
            ];

            if(details) {
                if(typeof details.location === 'object') {
                    //special case for map data
                    var latLong = details.location.latitude + ',' + details.location.longitude;
                    var mapParams = [
                        'size=' +  '160x90',
                        'center=' + latLong,
                        'zoom=' + 12,
                        'format=' + 'jpg',
                        'sensor=' + false,
                        'markers=' + encodeURIComponent('size:med|color:red|') + latLong
                    ];
                    details.location.mapUrl = 'http://maps.googleapis.com/maps/api/staticmap?' + mapParams.join('&');
                }
                //add date to details for convenience
                details.bookingDateTime = transaction.bookingDateTime;

                //NOTE: angular 1.1.5 breaks when iterating over a map with duplicate values!
                //need to convert to an array of objects for happy view rendering. This will be fixed in 1.2
                for(var key in details) {
                    if(details.hasOwnProperty(key) && detailsToOmit.indexOf(key) < 0) {
                        var detailData = {
                            name: key,
                            value: details[key],
                            longValue: longValueKeys.indexOf(key) > -1
                        };
                        if(specialDetailsKeys.indexOf(key) > -1) {
                            specialDetails.push(detailData);
                        } else {
                            customDetails.push(detailData);
                        }
                    }
                }

                details.special = specialDetails;
                details.custom = customDetails;
            }
            return details;
        };

        /**
         * Checks for errors while loading transactions
         * @returns {boolean}
         */
        TransactionsModel.prototype.allowMoreResults = function() {

            var allowMoreResults = (!this.loading && this.moreAvailable) && !this.errorCode;
            return allowMoreResults;
        };

        /**
         * Checks for errors during download and ensures that no transactions have been loaded
         * @returns {boolean}
         */
        TransactionsModel.prototype.noTransactionsFound = function() {

            var noTransactionsFound = (!this.loading && this.transactions.length === 0)  && !this.errorCode;
            return noTransactionsFound;
        };

        /**
         * Checks whether or not there are search filters set
         * @returns {boolean}
         */
        TransactionsModel.prototype.isSearching = function() {

            //searching if filters in not empty
            if(this.filters) {
                for(var key in this.filters) {
                    if(this.filters.hasOwnProperty(key)) {
                        return true;
                    }
                }
            }
            return false;
        };

        return {
            getInstance: function(config) {
                return new TransactionsModel(config);
            },
            availableFilters: availableFilters
        };
    };
});
