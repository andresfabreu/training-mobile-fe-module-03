define(function (require, exports, module) {
    'use strict';
    var d3 = require('d3');
    var angular = require('base').ng;

    var AXIS_FORMAT = d3.time.format.multi([
        ['%b %Y', function(d) { return d.getMonth() === 0; }],
        ['%b', function(d) { return d.getDate() === 1; }],
        ['', function() { return true; }]
    ]);
    var MARGIN = {top: 0, bottom: 15};
    var TOOLTIP_WIDTH = 80;

    function createTooltip(scope, scale) {
        var $el = angular.element('<div class="details"><div class="line"/><table/></div>').width(TOOLTIP_WIDTH),
            $line = $el.find('.line'),
            item;

        function row(d, i) {
            return '<tr><td><label class="legend asset-' + i + '">' + d.value + '%</label></td></tr>';
        }

        function tpl(d) {
            return d3.entries(d.assetAllocation).map(row).join('');
        }

        $el.update = function () {
            if (!item) {
                return;
            }
            var x = scale(item),
                dx = x < 0 ? 0 :
                     x < TOOLTIP_WIDTH / 2 ? x :
                     x > scope.width ? TOOLTIP_WIDTH :
                     x > scope.width - TOOLTIP_WIDTH / 2 ? x + TOOLTIP_WIDTH - scope.width : TOOLTIP_WIDTH / 2;
            $line.css('left', dx + 'px');
            $el.css('left', x - dx + 'px');
        };

        $el.set = function (i) {
            item = i;
            $el.find('table').html(tpl(item));
            $el.update();
        };

        return $el;
    }

    // @ngInject
    exports.lpWealthAssets = function ($window, utils, wealthUtils, lpCoreBus) {
        var bus = lpCoreBus;
        var date = utils.property('date');
        var data = utils.property('data');

        function main(scope, element) {
            var TYPES = scope.config.types;

            var x = d3.time.scale();
            var y = d3.scale.linear();
            var ticks = wealthUtils.ticks();
            var xDate = utils.compose(x, date);

            var getItemByDate = (function() {
                var bisector = d3.bisector(function (d, vDate) { return d.date - vDate; }).left;
                return function (vDate) {
                    vDate = d3.time.month(vDate);
                    return scope.data[bisector(scope.data, vDate)];
                };
            })();

            var el = element.find('svg')[0];

            var xAxis = d3.svg.axis().scale(x).orient('bottom').tickSize(0).tickFormat(AXIS_FORMAT).ticks(ticks);
            var stack = d3.layout.stack().values(data);

            var area = d3.svg.area()
                .x(xDate)
                .y0(function(d) { return y(d.y0); })
                .y1(function(d) { return y(d.y0 + d.y); });
            var path = utils.compose(area, data);
            var updateAreas = function (vEl) {
                vEl.attr('d', path);
            };

            var chart = d3.select(el);
            chart.append('g').attr('class', 'x axis');
            chart.on('click', function () {
                var vDate = x.invert(d3.event.layerX);
                if (vDate.getDate() > 15) {
                    vDate.setMonth(vDate.getMonth() + 1, 1);
                }
                bus.publish('portfolio-itemSelected', getItemByDate(vDate).date);
            });

            var tooltip = createTooltip(scope, xDate);
            tooltip.insertAfter(el);

            function update() {
                if (scope.range) {
                   x.domain(scope.range);
                }
                chart.selectAll('.asset').call(updateAreas);
                chart.select('.x.axis').call(xAxis);
                tooltip.update();
            }

            var selectItem = utils.compose(tooltip.set, getItemByDate);
            var onRange = utils.compose(update, function (r) { scope.range = r; });


            function resize() {
                var w = element.innerWidth(),
                    h = element.innerHeight() - MARGIN.top - MARGIN.bottom;
                if (w <= 0 || h <= 0) {
                    return;
                }
                scope.width = w;
                ticks.width(w);
                x.range([0, w]);
                y.range([0, h]);
                chart.attr({
                    width: w,
                    height: h + MARGIN.top + MARGIN.bottom
                });
                chart.select('.x.axis').attr('transform', 'translate(0,' + h + ')');
                tooltip.height(h);
                update();
            }

            function render() {
                var vData = scope.data;
                if (!vData) {
                    return;
                }
                var assets = stack(TYPES.map(function(type) {
                    return {
                        name: type.key,
                        data: vData.map(function(d) {
                            return {date: d.date, y: d.assetAllocation[type.key] / 100};
                        })
                    };
                }));

                chart.selectAll('.asset')
                    .data(assets)
                    .enter()
                    .append('path')
                    .attr('class', function (d, i) {
                        return 'asset asset-' + i;
                    });

                selectItem(date(vData[vData.length - 1]));
                update();
            }

            resize();

            angular.element($window).on('resize', utils.debounce(resize, 250));
            bus.subscribe('portfolio-rangeSelected', onRange);
            bus.subscribe('portfolio-rangeSelected-live', onRange);
            bus.subscribe('portfolio-itemSelected', selectItem);
            scope.$watch('data', render);
        }

        return {
            restrict: 'EA',
            require: '?ngModel',
            priority: Number.MAX_VALUE,
            link: main,
            template: '<svg/>',
            scope: {
                config: '=lpWealthAssets',
                data: '=ngModel'
            }
        };
    };
});
