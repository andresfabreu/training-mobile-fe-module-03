define(function(require, exports, module) {
    'use strict';

    var d3 = require('d3');

    /**
     * Line Chart directive.
     *
     * Use lp-chart-options attribute to pass the configuration for the chart. Available options are:
     *
     * {
     *      data: {Array},
     *      height: {number},
     *      width: {number}
     *      padding: {Array[number]},
     *      parsers: {
     *          x : {callback},
     *          y : {callback}
     *      },
     *      formatters: {
     *          y : {callback},
     *          x : {callback},
     *          tooltip : {callback}
     *      },
     *      animation : {
     *          direction : {string}
     *      }
     * }
     *
     * Height, width & padding define the size of the canvas & chart position.
     *
     * Parsers are used to get data from the array, and formatters define axis labels & tooltip.
     *
     * This chart supports animation, you can also define the direction of animation.
     *
     */

    exports.lpLineChart = function(){
        return {
            restrict: 'EA',
            replace: true,
            template:  '<div>' +
                       '  <div class="canvas"></div>' +
                       '  <div class="tooltip in" style="display:none">' +
                       '    <div class="tooltip-inner"></div>' +
                       '  </div>' +
                       '</div>',
            scope: {
                options: '=lpChartOptions'
            },
            link: function($scope, $element, $attrs) {

                $scope.$watch('options', function(options) {

                    if(!options) {
                        return;
                    }
                    var $canvas = $element.find(".canvas"),
                        padding = options.padding || [20, 20, 20, 20],
                        width = $canvas.width() - padding[1] - padding[3],
                        $tooltip = $element.find(".tooltip"),
                        data = options.data || [],
                        height = (options.height || $canvas.height()) - padding[0] - padding[2];

                    // Ranges
                    var max = d3.max(data, options.parsers.y);
                    var min = d3.min(data, options.parsers.y);

                    var firstRecord = data[data.length-1],
                        lastRecord = data[0];

                    // Axes
                    var x = d3.time.scale().domain([options.parsers.x(lastRecord), options.parsers.x(firstRecord)]).range([0, width]);
                    var y = d3.scale.linear().domain([(min < 0) ? min : 0, (max > 0) ? max : 0]).range([height, 0]).nice();

                    // x axis
                    var ticks = (data.length === 7) ? data : data.filter(function(value, index) {
                        return index % 4 === 0;
                    });

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .ticks(d3.time.days, ticks.length)
                        .tickFormat(options.formatters.x)
                        .tickValues(ticks.map(options.parsers.x))
                        .tickPadding(10)
                        .tickSize(-height)
                        .orient("bottom");

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .ticks(3)
                        .tickSize(-width)
                        .tickPadding(20)
                        .tickFormat(options.formatters.y)
                        .orient("left");

                    // Canvas
                    $canvas.empty();

                    var graph = d3.select($canvas[0]).append("svg:svg")
                        .attr("class", "chart")
                        .attr("height", height + padding[0] + padding[2])
                        .append("svg:g")
                        .attr("transform", "translate(" + padding[3] + "," + padding[0] + ")");

                    graph
                        .append("svg:g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    // y axis
                    graph
                        .append("svg:g")
                        .attr("class", "y axis")
                        .attr("transform", "translate(-0,0)")
                        .call(yAxis);

                    // Line chart
                    var path = graph
                        .selectAll('.line')
                        .attr("fill", "none")
                        .data([data])
                        .enter()
                        .append("svg:path")
                        .attr("class", "line")
                        .attr("d", d3.svg.line()
                            .x(function (d) {
                                return x(options.parsers.x(d));
                            })
                            .y(function (d) {
                                return y(options.parsers.y(d));
                            }));

                    // animates the line - doesn't work in ie8 (r2d3 doesn't support getTotalLength on path.node())
                    var hasTotalLength = (typeof path.node().getTotalLength === 'function');
                    if (hasTotalLength) {
                        var totalLength = path.node().getTotalLength();
                        path
                            .attr("class", "line")
                            .attr("stroke-dasharray", totalLength + " " + totalLength)
                            .attr("stroke-dashoffset", options.animation.direction === "right" ? totalLength : -totalLength)
                            .transition()
                            .duration(2000)
                            .attr("stroke-dashoffset", 0);
                    }

                    // Chart dots
                    graph
                        .selectAll("circle")
                        .data(ticks)
                        .enter()
                        .append("svg:circle")
                        .attr("r", 0)
                        .transition()
                        .delay(2000)
                        .attr("fill", "white")
                        .attr("stroke", "steelblue")
                        .attr("r", 4)
                        .attr("cx", function (d) {
                            return x(options.parsers.x(d));
                        })
                        .attr("cy", function (d) {
                            return y(options.parsers.y(d));
                        });

                    graph
                        .selectAll("circle")
                        .on("mouseover", function (d) {
                            var mouse = d3.mouse(this);
                            $tooltip
                                .find('.tooltip-inner')
                                    .html(options.formatters.tooltip(d))
                                    .end()
                                .css("left", mouse[0] + $tooltip.width()/2 + "px")
                                .css("top", mouse[1] - $tooltip.height()/2 + "px")
                                .show();
                        })
                        .on("mouseout", function () {
                            $tooltip.hide();
                        });

                    var resize = function() {

                        var $canvas = $element.find(".canvas");
                        var width = $canvas.width() - padding[1] - padding[3];
                        var x = d3.time.scale().domain([options.parsers.x(lastRecord), options.parsers.x(firstRecord)]).range([0, width]);
                        var y = d3.scale.linear().domain([(min < 0) ? min : 0, (max > 0) ? max : 0]).range([height, 0]).nice();

                        xAxis.scale(x);

                        graph
                            .selectAll("circle")
                            .attr("cx", function (d) {
                                return x(options.parsers.x(d));
                            });

                        graph.attr("width", width - padding[1] - padding[3]);

                        graph.select('.x.axis')
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

                        graph.select('.y.axis')
                            .attr("width", width - padding[1] - padding[3])
                            .call(yAxis);

                        graph.selectAll('.y.axis line')
                            .attr("x2", width);

                        graph
                            .selectAll('.line')
                            .attr("stroke-dasharray", width + padding[1] + padding[3] + " " + width + padding[1] + padding[3])
                            .attr("d", d3.svg.line()
                                .x(function (d) {
                                    return x(options.parsers.x(d));
                                })
                                .y(function (d) {
                                    return y(options.parsers.y(d));
                                }));

                    };

                    d3.select(window).on('resize.linechart', resize);

                });
            }
        };
    };
});
