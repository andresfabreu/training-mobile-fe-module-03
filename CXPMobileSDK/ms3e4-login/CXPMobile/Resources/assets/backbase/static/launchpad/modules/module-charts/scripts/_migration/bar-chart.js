define(function(require, exports, module) {
    'use strict';

    var d3 = require('d3');

    /**
     * Bar Chart directive.
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
     *      }
     * }
     *
     * Height, width & padding define the size of the canvas & chart position.
     *
     * Parsers are used to get data from the array, and formatters define axis labels & tooltip.
     *
     */
    exports.lpBarChart = function() {
        return {
            restrict: 'EA',
            replace: true,
            template: '<div>' +
                      '  <div class="canvas"></div>' +
                      '  <div class="tooltip in" style="display:none">' +
                      '    <div class="tooltip-inner"></div>' +
                      '  <div>' +
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
                        $tooltip = $element.find(".tooltip"),
                        data = options.data || [],
                        padding = options.padding || [20, 20, 20, 20],
                        width = (options.width || $canvas.width()) - padding[1] - padding[3],
                        height = (options.height || $canvas.height()) - padding[0] - padding[2];

                    // Ranges
                    var x = d3.time.scale().domain([options.parsers.x(data[0]), options.parsers.x(data[data.length - 1])]).range([0, width]);
                    var y = d3.scale.linear().domain([0, d3.max(data, options.parsers.y)]).range([height, 0]);

                    // Canvas
                    $canvas.empty();

                    var graph = d3.select($canvas[0]).append("svg:svg")
                        .attr("class", "chart")
                        .attr("height", height + padding[0] + padding[2])
                        .append("svg:g")
                        .attr("transform", "translate(" + padding[3] + "," + padding[0] + ")");

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

                    var barWidth = width > 0 ? width / data.length / 2 : 0;

                    graph.selectAll("rect")
                        .data(data)
                        .enter()
                            .append("rect")
                            .attr("y", y(0))
                            .attr("height", height - y(0))
                            .transition()
                                .duration(2000)
                                .attr("x", function(d) {
                                    return x(options.parsers.x(d)) - (barWidth/2);
                                })
                                .attr("width", barWidth)
                                .attr("y", function(d) {
                                    return y(options.parsers.y(d));
                                })
                                .attr("height", function(d) {
                                    return height - y(options.parsers.y(d));
                                });

                    graph.selectAll("rect")
                        .attr("class", "bar")
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

                        width = $canvas.width() - padding[1] - padding[3];

                        x = d3.time.scale().domain([options.parsers.x(data[0]), options.parsers.x(data[data.length - 1])]).range([0, width]);
                        y = d3.scale.linear().domain([0, d3.max(data, options.parsers.y)]).range([height, 0]);

                        xAxis.scale(x);

                        graph.attr("width", width - padding[1] - padding[3]);

                        graph.select('.x.axis')
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

                        graph.select('.y.axis')
                            .attr("width", width - padding[1] - padding[3])
                            .call(yAxis);

                        graph.selectAll('.y.axis line')
                            .attr("x2", width);

                        barWidth = width > 0 ? width / data.length / 2 : 0;

                        graph.selectAll("rect")
                            .attr("x", function(d) {
                                return x(options.parsers.x(d)) - (barWidth/2);
                            })
                            .attr("width", barWidth);

                    };

                    d3.select(window).on('resize.barchart', resize);

                });
            }
        };
    };
});
