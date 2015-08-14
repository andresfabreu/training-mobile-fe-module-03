/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : directives.js
 *  Description:  Transaction charts directive
 *  ----------------------------------------------------------------
 */
define(function(require, exports) {

    'use strict';

    var d3 = require('d3');

    var types = {
        vertical: '',
        horizontal: '-horizontal'
    };

    function buildCharts(type) {

        // @ngInject
        var controller = function($templateCache, lpCoreUtils, lpCoreI18n, $q, lpAccountsChartData, lpTransactionsChartData, lpWidget, lpCoreBus) {
            function linkFn(scope, elem, attrs) {
                var getNiceTimePeriod = function(startTime, endTime) {
                    var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

                    var start = new Date(startTime);
                    var end = new Date(endTime);

                    //Same dates are fed into the chart but days are cut off at the start of the chart
                    //This fix brings the display in line together
                    start.setDate(start.getDate() + 1);

                    //return nicely formatted time period
                    return start.getDate() + ' ' + monthNames[start.getMonth()] + ' - ' + end.getDate() + ' ' + monthNames[end.getMonth()];
                };

                var getStartDate = function(){
                    var result = new Date(scope.endDate);
                    switch(scope.scale) {
                        case 'WEEK':
                            result.setDate(result.getDate() - 7);
                            break;
                        case 'MONTH':
                            result.setMonth(result.getMonth() - 1);
                            break;

                    }
                    return result;
                };

                var setDateRange = function(endDate) {
                    scope.endDate = new Date(endDate);
                    scope.timePeriod = getNiceTimePeriod(getStartDate().getTime(), scope.endDate.getTime());
                };

                var onTransactionsReady = function(transactions) {
                    // get the date of the newest transaction
                    if (transactions && transactions.length) {
                        setDateRange(transactions[0].bookingDateTime);
                    }
                    lpCoreBus.unsubscribe('widget-transactions:transactions:ready', onTransactionsReady);
                };
                lpCoreBus.subscribe('widget-transactions:transactions:ready', onTransactionsReady);

                var initialize = function() {
                    scope.now = new Date();
                    scope.scale = 'WEEK';
                    scope.series = 'WITHDRAWAL';
                    setDateRange(scope.now);

                    scope.accountsChartModel = lpAccountsChartData.getInstance({
                        accountsChartEndpoint: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('accountBalanceChartDataSrc'))
                    });

                    scope.transactionsChartModel = lpTransactionsChartData.getInstance({
                        transactionsChartEndpoint: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('transactionsChartDataSrc'))
                    });
                };

                var updateCharts = function(direction, onlyTransactions) {
                    var params = {
                        start: getStartDate().getTime(),
                        end: scope.endDate.getTime()
                    };

                    //Refresh the nice time period
                    scope.timePeriod = getNiceTimePeriod(params.start, params.end);

                    var getDate = function(date){
                        var result = new Date(date);
                        result.setHours(0);
                        result.setMinutes(0);
                        result.setSeconds(0);
                        return result;
                    };

                    scope.accountsChartModel.setId(scope.lpAccounts.selected.id);
                    scope.transactionsChartModel.setId(scope.lpAccounts.selected.id);

                    var getTransactionsValue = function(data){
                        return scope.series === 'DEPOSIT' ? data.deposit : data.withdrawal;
                    };

                    var formatAmount = function(amount){
                        return lpCoreI18n.formatCurrency(amount, scope.lpAccounts.selected.currency);
                    };

                    $q.all([scope.accountsChartModel.load(params), scope.transactionsChartModel.load(params)]).then(function() {
                        scope.transactionsChartOptions = {
                            data: scope.transactionsChartModel.chartData,
                            height: 200,
                            padding: [30, 30, 30, 90],
                            parsers: {
                                x: function(data) {
                                    return getDate(data.date);
                                },
                                y: function(data) {
                                    return getTransactionsValue(data);
                                }
                            },
                            formatters: {
                                y: function(amount){
                                    return formatAmount(amount);
                                },
                                x: function(date) {
                                    return d3.time.format('%e')(date);
                                },
                                tooltip: function(data) {
                                    return d3.time.format('%B %e')(getDate(data.date)) + '<br>' + formatAmount(getTransactionsValue(data));
                                }
                            }
                        };

                        if(!onlyTransactions){
                            scope.accountBalanceChartOptions = {
                                data: scope.accountsChartModel.chartData,
                                height: 200,
                                padding: [30, 30, 30, 90],
                                parsers: {
                                    x: function(data) {
                                        return getDate(data.date);
                                    },
                                    y: function(data) {
                                        return data.amount;
                                    }
                                },
                                formatters: {
                                    y: function(amount){
                                        return formatAmount(amount);
                                    },
                                    x: function(date) {
                                        return d3.time.format('%e')(date);
                                    },
                                    tooltip: function(data) {
                                        return d3.time.format('%B %e')(getDate(data.date)) + '<br>' + formatAmount(data.amount);
                                    }
                                },
                                animation: {
                                    direction: direction === 'prev' ? 'left' : 'right'
                                }
                            };
                        }

                    });
                };

                scope.nextPeriod = function() {
                    switch(scope.scale) {
                        case 'WEEK':
                            scope.endDate.setDate(scope.endDate.getDate() + 7);
                            break;
                        case 'MONTH':
                            scope.endDate.setMonth(scope.endDate.getMonth() + 1);
                            break;
                    }

                    updateCharts('next');
                };

                scope.prevPeriod = function() {
                    switch(scope.scale) {
                        case 'WEEK':
                            scope.endDate.setDate(scope.endDate.getDate() - 7);
                            break;
                        case 'MONTH':
                            scope.endDate.setMonth(scope.endDate.getMonth() - 1);
                            break;
                    }
                    updateCharts('prev');
                };

                scope.setScale = function(scale) {
                    scope.scale = scale;
                    updateCharts('prev');
                };

                scope.setSeries = function(series) {
                    scope.series = series;
                    updateCharts('prev', true);
                };

                scope.showNextPeriod = function() {
                    return scope.now.getTime() > scope.endDate.getTime();
                };

                scope.$watch('lpAccounts.selected', function(value) {
                    // If the account selected is a credit card the charts
                    // are not loaded, but if you loaded an account previously
                    // this listener is enabled and it will be called when a card account
                    // is selected.
                    // TODO: Fix sharing same provider for bank accounts and
                    //       card accounts
                    if (value && !value.cardId) {
                        updateCharts('prev');
                    }
                });

                scope.$on('tabSelected', function(event, tab){
                    if (tab === 'chart' || tab === 'combined'){
                        updateCharts('prev');
                    }
                });

                initialize();
            }

            function compileFn(elem, attrs) {
                return linkFn;
            }

            // require template
            if (type === types.vertical) {
                $templateCache.put('$transactions/chartTemplate', require('../templates/charts'));
            } else {
                $templateCache.put('$transactions/chartTemplate-horizontal', require('../templates/charts-horizontal'));
            }

            // Directive configuration
            return {
                scope: {
                    lpAccounts: '='
                },
                restrict: 'AE',
                compile: compileFn,
                template: $templateCache.get('$transactions/chartTemplate' + type)
            };
        };

        return controller;
    }

    exports.lpTransactionsCharts = buildCharts(types.vertical);
    exports.lpTransactionsChartsHorizontal = buildCharts(types.horizontal);
});
