define(function (require, exports, module){
	'use strict';
	var d3 = require('d3');
    var angular = require('base').ng;

    var TPL = '<svg></svg>';
	var AXIS_FORMAT = d3.time.format.multi([
		['%Y', function(d) { return d.getMonth() === 0; }],
		['%b', function(d) { return d.getDate() === 1; }],
		['', function() { return true; }]
	]);
    var X_AXIS_DY = -10;
    var X_LABELS_DY = -20;

    function getTimespan(date2, span) {
        var date1 = new Date(date2);
        if (span.indexOf('year') === -1) {
            date1.setMonth(date2.getMonth() - parseInt(span, 10));
        } else {
            date1.setFullYear(date2.getFullYear() - parseInt(span, 10));
        }
        return [date1, date2];
    }

	// @ngInject
	exports.lpWealthMinimap = function ($window, utils, wealthUtils, lpCoreBus) {
        var bus = lpCoreBus;
        var date = utils.property('date');
        var value = function (d) {
            return d.datapoint.totalPortfolioValue;
        };

        function main(scope, element) {
            var config = scope.config;
            var el = element.find('svg')[0];
            var svg = d3.select(el);
            var x = d3.time.scale();
            var y = d3.scale.linear();
            var xAxis = d3.svg.axis().scale(x).orient('bottom').tickFormat(AXIS_FORMAT);
            var brush = d3.svg.brush().x(x);
            var zoom;
            var area = d3.svg.area()
                .x(function (d) {
                    return x(d.date);
                })
                .y1(function (d) {
                    return y(value(d));
                });

            svg.append('path').attr('class', 'area');
            svg.append('g').attr('class', 'x axis');

            var resizers = svg.append('g').attr('class', 'x brush').call(brush).selectAll('.resize');
            resizers.append('rect').attr({
                class: 'drg',
                width: 5,
                x: function (d, i) {
                    return i ? 0 : -5.5;
                }
            });
            resizers.append('path').attr('d', function (d, i) {
                return i ? 'M1,16v20M3,16v20' : 'M-2,16v20M-4,16v20';
            });

            function getZoomFn(eventName) {
                return function () {
                    var range = brush.empty() ? x.domain() : brush.extent();
                    bus.publish(eventName, range);
                };
            }

            function updateBrush(vDate, span) {
                var timespan = getTimespan(vDate, span),
                    domain = x.domain();
                if (timespan[0] < domain[0]) {
                    timespan[0] = domain[0];
                }
                brush.extent(timespan);
                svg.select('.brush').call(brush);
                zoom();
            }

            function render() {
                var data = scope.data;
                if (!data) {
                    return;
                }
                data = data[config.frequency];
                x.domain(d3.extent(data, date));
                y.domain(d3.extent(data, value));
                svg.select('.area').datum(data).attr('d', area);
                svg.select('.x.axis')
                    .call(xAxis)
                    .selectAll('text')
                    .attr('transform', 'translate(0,' + X_LABELS_DY + ')');
                updateBrush(x.domain()[1], config.timespan);
            }

            function resize() {
                var width = element.innerWidth(),
                    height = element.innerHeight();
                if (width <= 0 || height <= 0) {
                    return;
                }
                x.range([0, width]);
                y.range([height, 0]);
                area.y0(height);
                svg.attr({width: width, height: height});
                svg.select('.x.axis').attr('transform', 'translate(0,' + (height + X_AXIS_DY) + ')');
                svg.select('.x.brush').selectAll('rect').attr('height', height);
                svg.select('.x.brush').selectAll('.drg').attr({
                    height: height / 2,
                    y: height / 4
                });
                render();
            }

            zoom = getZoomFn('portfolio-rangeSelected');
            brush.on('brush', getZoomFn('portfolio-rangeSelected-live'))
                .on('brushend', zoom);


            resize();
            wealthUtils.sticky(element, 50);


            scope.$watch('data', render);
            scope.$watch('config.timespan', function (t) {
                updateBrush(brush.extent()[1], t);
            });

            scope.$on('$destroy', function () {
            });

            angular.element($window).on('resize', utils.debounce(resize, 250));
        }

        return {
            restrict: 'EA',
            require: '?ngModel',
            priority: Number.MAX_VALUE,
            link: main,
            template: TPL,
            scope: {
                data: '=ngModel',
                config: '=lpWealthMinimap',
                onRender: '&onRender'
            }
        };

    };
});

