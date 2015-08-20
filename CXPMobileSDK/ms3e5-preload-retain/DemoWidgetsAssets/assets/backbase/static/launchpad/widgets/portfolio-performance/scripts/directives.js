define(function (require, exports, module) {
    'use strict';
    var d3 = require('d3');
    var angular = require('base').ng;

    var MARGIN = {top: 10, bottom: 20},
        Y_LABELS_SHIFT = {top: -5, left: -25},
        AXIS_FORMATS = {
            monthly: d3.time.format.multi([
                ['%b %Y', function(d) { return d.getMonth() === 0; }],
                ['%b', function(d) { return d.getDate() === 1; }],
                ['', function() { return true; }]
            ]),
            yearly: d3.time.format.multi([
                ['%Y', function(d) { return d.getMonth() === 0; }],
                ['', function() { return true; }]
            ])
        };
    var yLabelsTransform = 'translate(' + Y_LABELS_SHIFT.left + ',' + Y_LABELS_SHIFT.top + ')';

    // @ngInject
    exports.lpWealthPerformance = function ($window, utils, wealthUtils, d3tip, lpCoreBus) {
        var bus = lpCoreBus;
        var date = utils.property('date');
        var data = utils.property('data');

        var hasVCR = function (d, none) { return d.datapoint.valueChangeRate === null ? 0 : 1; },
            getFirstIndex = d3.bisector(hasVCR).right;

        function getFirstDate(vData) {
            var i = getFirstIndex(vData),
                item = vData[i];
            return i === 0 && hasVCR(item) ? -1 : date(item);
        }

        function main(scope, element) {
            var config = scope.config;
            var x = d3.time.scale();
            var y = d3.scale.linear();
            var ticks = wealthUtils.ticks();
            var accum, width, height, domainWidth, firstVCRDate, mode, modeIsAvailable;
            var modeIsSet = true;
            var el = element.find('svg')[0];
            var xDate;
            var yValue;
            var yRate;

            function value(d) {
                return d.datapoint.totalPortfolioValue;
            }

            function rate(d) {
                return mode ? d.datapoint.valueChangeRate : d.datapoint.totalPortfolioValue;
            }

            function maxExtent(arr1, arr2) {
                return [Math.min(d3.min(arr1), d3.min(arr2)), Math.max(d3.max(arr1), d3.max(arr2))];
            }

            function barClassName(d) {
                return rate(d) < 0 ? 'negative' : '';
            }

            xDate = utils.compose(x, date);
            yValue = utils.compose(y, data);
            yRate = utils.compose(y, rate);

            function barY(d) {
                return mode ? Math.min(y(0), yRate(d)) : yRate(d);
            }

            var xAxis = d3.svg.axis().scale(x).orient('bottom').tickSize(0).ticks(ticks);

            var numFormat = d3.format('.2s');
            var grid = d3.svg.axis().scale(y).orient('right')
                .ticks(5).tickFormat(function (d) { return mode ? d + '%' : numFormat(d); } );

            var line = d3.svg.line().x(xDate).y(yValue);

            var updateCenters = function (vEl) {
                vEl.attr({
                    cx: xDate,
                    cy: yValue
                });
            };

            function getPoint(vDate, vData, left) {
                var iL = 0,
                    iR = vData.length - 1;
                if (vDate <= vData[iL].date) {
                    return iL;
                }
                if (vDate >= vData[iR].date) {
                    return iR;
                }

                while (iR - iL > 1) {
                    var iM = iL + iR >> 1;
                    if (vData[iM].date <= vDate) {
                        iL = iM;
                    } else {
                        iR = iM;
                    }
                }

                return left ? iL : iR;
            }

            var updateBars = function (vEl) {
                var vWidth = domainWidth / wealthUtils.getDomainSize(x) * .75;
                vEl.attr({
                    width: vWidth,
                    y: barY,
                    class: barClassName,
                    height: function (d) {
                        return mode ? Math.abs(y(0) - yRate(d)) : height - yRate(d);
                    },
                    transform: function (d) {
                        return 'translate(' + (xDate(d) - vWidth / 2) + ',0)';
                    }
                });
            };

            var updateHelpers = function (vEl) {
                var vWidth = domainWidth / wealthUtils.getDomainSize(x);
                vEl.attr({
                    width: vWidth,
                    transform: function (d) {
                        return 'translate(' + (xDate(d) - vWidth / 2) + ',0)';
                    }
                });
            };

            var svg = d3.select(el);

            var chart = svg.append('g').attr('transform', 'translate(0,' + MARGIN.top + ')');

            chart.append('g').attr('class', 'bars');
            chart.append('g').attr('class', 'grid').call(grid);
            chart.append('g').attr('class', 'x axis');
            chart.append('g').attr('class', 'x axis zero').append('line');
            chart.append('path').attr('class', 'line');
            chart.append('g').attr('class', 'dots');
            chart.append('g').attr('class', 'tip-helpers');

            var timeFormats = {
                    monthly: d3.time.format('%b %Y'),
                    yearly: d3.time.format('%Y')
                },
                valueFormatPre = d3.format(',.2f'),
                valueFormat = function (d) {
                    return valueFormatPre(d).replace(/,/g, '~').replace(/\./g, ',').replace(/~/g, '.');
                },
                rateFormat = d3.format('+,.2f');
            var tip = d3tip()
                .attr('class', 'd3-tip')
                .offset([-7, 0])
                .y(barY)
                .html(function (d) {
                    return (
                    '<div>' + timeFormats[config.frequency](date(d)) + '</div>' +
                    '<div>' + valueFormat(value(d)) + ' EUR</div>' +
                    (mode ? '<div>' + rateFormat(rate(d)) + '%</div>' : '') +
                    '<div> &rarr; ' + valueFormat(d.datapoint.cashIn) + ' EUR</div>' +
                    '<div> &larr; ' + valueFormat(d.datapoint.cashOut) + ' EUR</div>' +
                    (mode ? '<div>Cumul: ' + data(accum[getPoint(date(d), accum, true)]).toFixed(2) + '%</div>' : '')
                    );
                });
            chart.call(tip);

            function accumulative(from, to, vData) {
                var ret = [],
                    curr1, prev1, curr2, prev2;

                for (var i = from, j; i <= to; i++) {
                    j = i - from;
                    curr1 = 1 + rate(vData[i]) / 100;
                    curr2 = j === 0 ? curr1 : curr1 * (j === 1 ? prev1 : prev2);
                    prev1 = curr1;
                    prev2 = curr2;

                    ret.push({
                        date: vData[i].date,
                        data: (curr2 - 1) * 100
                    });
                }

                return ret;
            }

            function zoom() {
                var range = scope.range;
                if (!range || !scope.data) {
                    return;
                }
                x.domain(range);
                var model = scope.data[config.frequency];
                if (modeIsAvailable !== range[0] > firstVCRDate) {
                    modeIsAvailable = range[0] > firstVCRDate;
                    mode = modeIsAvailable && modeIsSet;
                    scope.onSwitch({modeIsAvailable: modeIsAvailable});
                }

                if (mode) {
                    accum = accumulative(getPoint(range[0], model), getPoint(range[1], model), model);
                    y.domain(maxExtent(accum.map(data), model.map(rate)));
                } else {
                    accum = [];
                    y.domain(d3.extent(model, rate));
                }
                chart.select('.line').datum(accum).attr('d', line);

                var circles = chart.select('.dots').selectAll('.dot').data(accum);
                circles.enter().append('circle')
                    .attr('class', 'dot')
                    .attr('r', 4);
                circles.exit().remove();
                circles.call(updateCenters);

                chart.select('.grid').call(grid).selectAll('text').attr('transform', yLabelsTransform);
                chart.select('.x.axis').call(xAxis);
                chart.select('.x.zero').attr('transform', 'translate(0,' + y(0) + ')');
                chart.select('.bars').selectAll('rect').call(updateBars);
                chart.select('.tip-helpers').selectAll('rect').call(updateHelpers);
            }

            function resize() {
                var w = width;
                width = element.innerWidth();
                height = element.innerHeight() - MARGIN.top - MARGIN.bottom;
                if (width <= 0 || height <= 0) {
                    width = w;
                    return;
                }
                domainWidth *= width / w;
                ticks.width(width);
                x.range([0, width]);
                y.range([height, 0]);
                grid.tickSize(width, 0, 0);
                svg .attr('width', width)
                    .attr('height', height + MARGIN.top + MARGIN.bottom);
                chart.select('.x.axis').attr('transform', 'translate(0,' + height + ')');
                chart.select('.x.zero line').attr('x2', width);
                zoom();
            }

            function render() {
                var vData = scope.data;
                if (!vData) {
                    return;
                }
                vData = vData[config.frequency];
                firstVCRDate = getFirstDate(vData);
                x.domain(d3.extent(vData, date));
                domainWidth = width / vData.length * wealthUtils.getDomainSize(x);

                xAxis.tickFormat(AXIS_FORMATS[config.frequency]);

                var bars = chart.select('.bars').selectAll('rect').data(vData);
                bars.enter().append('rect');
                bars.exit().remove();

                var helpers = chart.select('.tip-helpers').selectAll('rect').data(vData);
                helpers.enter().append('rect')
                    .attr({
                        y: 0,
                        height: height
                    })
                    .on('mouseover', tip.show)
                    .on('click', tip.show) // for Titanium
                    .on('mouseout', tip.hide);
                helpers.exit().remove();
                zoom();
            }


            resize();

            var onRange = utils.compose(zoom, function (r) { scope.range = r; });

            bus.subscribe('portfolio-rangeSelected', onRange);
            bus.subscribe('portfolio-rangeSelected-live', onRange);

            scope.$watch('data', render);
            scope.$watch('config.frequency', render);
            scope.$watch('config.mode', function (m) {
                modeIsSet = m;
                mode = modeIsAvailable && modeIsSet;
                zoom();
            });

            angular.element($window).on('resize', utils.debounce(resize, 250));
        }

        return {
            restrict: 'EA',
            require: '?ngModel',
            priority: Number.MAX_VALUE,
            link: main,
            template: '<svg/>',
            scope: {
                config: '=lpWealthPerformance',
                data: '=ngModel',
                onSwitch: '&'
            }
        };
    };
});
