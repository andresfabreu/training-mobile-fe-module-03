/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : directives.js
 *  Description:  Transaction list directive
 *  ----------------------------------------------------------------
 */
define(function(require, exports) {

    'use strict';

    var $ = window.jQuery;
    var angular = require('base').ng;

    /**
     * Check if the current browser is ES3 compliant only
     *
     * @returns {boolean}
     */
    function isES3Browser() {
        var es3Browser = false;
        try {
            Object.defineProperty({}, 'x', {});
        } catch (e) { /* this is ES3 Browser */
            es3Browser = true;
        }
        return es3Browser;
    }

    // @ngInject
    exports.lpTransactionsList = function(widget, $timeout, $templateCache, lpCoreBus, lpCoreUtils) {

        $templateCache.put('$transactions/list.html', require('../templates/list'));

        function linkFn(scope, elem, attrs) {
            /*----------------------------------------------------------------*/
            /* Private methods & variables
            /*----------------------------------------------------------------*/
            var isOldBrowser = isES3Browser();
            var ie8CategoryFull = 160;
            var ie8CategoryCollapsed = 9;

            /*----------------------------------------------------------------*/
            /* Watchers
            /*----------------------------------------------------------------*/
            scope.$watch('accounts.selected', function(account) {
                if (account) {
                    scope.transactions
                    .loadTransactions(account)
                    .then(function() {
                        lpCoreBus.publish('widget-transactions:transactions:ready', scope.transactions.transactions);
                    });
                    // lpCoreBus.publish('launchpad-retail.accountSelected', {
                    //     accountId: account.id,
                    //     originType: 'transactions'
                    // });
                }
            });

            scope.$on('$destroy', function() {
                // clean up
            });

            /*----------------------------------------------------------------
            /* Public methods & properties
            /*----------------------------------------------------------------*/
            scope.previewAll = false;

            scope.transactionKeydown = function(evt, transaction) {
                if (evt.which === 13 || evt.which === 32) {
                    evt.preventDefault();
                    evt.stopPropagation();
                    scope.loadTransactionDetails(transaction);
                    scope.openDetails(transaction);
                }
            };

            scope.loadTransactionDetails = function(transaction) {
                scope.transactions.loadTransactionDetails(transaction);
            };

            scope.loadMoreTransactions = function() {
                var length = scope.transactions.transactions.length;
                scope.transactions.loadMoreTransactions().then(function() {
                    setTimeout(function() {
                        var selector = scope.tabs.combined === true ? '.lp-transactions-combined .transactions-list-row' : '.transactions-list-row';
                        var row = $(widget.body).find(selector).eq(length);
                        row.focus();
                    }, 100);
                });
            };

            scope.updateTransactionCategory = function(transaction, categoryId, similar) {
                var promise;
                if (!similar) {
                    promise = scope.transactions.updateTransactionCategory(transaction, categoryId);
                } else {
                    promise = scope.transactions.updateSimilarTransactionCategory(transaction, categoryId);
                }

                promise.success(function() {
                    // console.log('updateTransactionCategory', transaction.id, categoryId);
                });
            };

            scope.updateItemSize = function (transaction, data) {
                // console.log('updateItemSize', transaction.viewWidth, data.width);
                if (transaction.viewWidth === null || transaction.viewWidth === undefined) {
                    transaction.viewWidth = data.width;
                }

                var resizeBreakpoint = 500;
                var hiddenXsElements = angular.element('#transaction-' + transaction.id + ' .info .hidden-xs');
                if (transaction.viewWidth > resizeBreakpoint && data.width <= resizeBreakpoint) {
                    hiddenXsElements.addClass('hidden');
                }
                if (transaction.viewWidth < resizeBreakpoint && data.width >= resizeBreakpoint) {
                    hiddenXsElements.removeClass('hidden');
                }
                transaction.viewWidth = data.width;
            };

            scope.openDetails = function(transaction, selectedTab) {

                var setDetailTabValues = function(tabs, selectedDetailTab) {
                    for (var tab in tabs){
                        if (tabs.hasOwnProperty(selectedDetailTab)) {
                            tabs[tab] = false;
                            if (tab === selectedDetailTab) {
                                tabs[tab] = true;
                            }
                        }
                    }
                };

                if (selectedTab === null || selectedTab === undefined) {
                    selectedTab = 'details';
                }
                transaction.showDetails = !transaction.showDetails;
                if (transaction.showDetails) {
                    $timeout(function() {
                        setDetailTabValues(transaction.detailTabs, selectedTab);
                    }, 0);
                }
                if (selectedTab === 'details') {
                    scope.loadTransactionDetails(transaction);
                }
                scope.closePreview(transaction);

                if (scope.categorySmallLayout && transaction.showDetails) {
                    $('body').animate({
                        scrollTop: $('#transaction-' + transaction.id).offset().top - 5 - scope.offsetTopCorrection
                    }, 500);
                }

                // fix for chrome redraw issue
                var transactionTabs = document.getElementById('transactions-tabs');
                if (!scope.showDetails && transactionTabs) {
                    transactionTabs.style.display = 'none';
                    transactionTabs.style.display = 'block';
                }
            };

            scope.selectDetailsTab = function(transaction) {
                scope.loadTransactionDetails(transaction);
            };

            scope.openPreview = function(transaction) {
                transaction.preview = true;
                if (!transaction.showDetails) {
                    if (isOldBrowser) {
                        // support IE8
                        $('#transaction-' + transaction.id + ' .categories').width(ie8CategoryFull);
                    } else {
                        $('#transaction-' + transaction.id).addClass('preview');
                    }
                }
            };

            scope.closePreview = function(transaction) {
                transaction.preview = false;
                if (isOldBrowser) {
                    // support IE8
                    $('#transaction-' + transaction.id + ' .categories').width(ie8CategoryCollapsed);
                } else {
                    $('#transaction-' + transaction.id).removeClass('preview');
                }
            };

            scope.categoryClick = function(event, transaction) {
                if (event !== null && event !== undefined) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                scope.openDetails(transaction, 'categories');
            };

            // Service is returning Array[0] when empty
            // so we have to check for that
            var parseTransactionAttribute = function(attribute) {
                if (lpCoreUtils.isString(attribute)) {
                    return lpCoreUtils.trim(attribute);
                } else if (lpCoreUtils.isArray(attribute) && !attribute.length) {
                    return '';
                }

                return attribute || '';
            };

            scope.getTransactionDescription = function(transaction) {
                var counterpartyName = parseTransactionAttribute(transaction.counterpartyName);
                var description = parseTransactionAttribute(transaction.transactionDescription);
                var type = parseTransactionAttribute(transaction.transactionType);

                return counterpartyName || description || type;
            };

            scope.getTransactionSubDescription = function(transaction) {
                var accountName = parseTransactionAttribute(transaction.accountName);
                var counterpartyName = parseTransactionAttribute(transaction.counterpartyName);
                var description = parseTransactionAttribute(transaction.transactionDescription);
                var transactionType = parseTransactionAttribute(transaction.transactionType);

                if (accountName) {
                    return accountName;
                } else if (counterpartyName || description) {
                    return transactionType;
                } else {
                    return '';
                }
            };

            scope.toggleCategoryView = function() {
                scope.previewAll = !scope.previewAll;
            };
        }

        /**
         * Compile function
         * @param  {object} el    angular dom el object
         * @param  {object} attrs el attributes
         * @return {function}       link controller function
         */
        function compileFn(elem, attrs) {
            return linkFn;
        }

        // Directive configuration
        return {
            scope: {
                accounts: '=lpAccounts',
                transactions: '=lpTransactions',
                transactionsCategories: '=lpTransactionsCategories',
                categoryLayout: '=',
                showCategories: '=',
                showDatesAllTransactions: '=',
                hideDetailsPreference: '='
            },
            restrict: 'AE',
            compile: compileFn,
            template: $templateCache.get('$transactions/list.html')
        };
    };

    // @ngInject
    exports.lpTransactionsListDetails = function($templateCache) {
        $templateCache.put('$transactions/details.html', require('../templates/details'));

        function linkFn(scope, elem, attrs) {
        }

        function compileFn(elem, attrs) {
            return linkFn;
        }

        return {
            restrict: 'AE',
            scope: {
                transaction: '='
            },
            compile: compileFn,
            template: $templateCache.get('$transactions/details.html')
        };
    };
});
