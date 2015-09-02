define(function (require, exports, module) {
    'use strict';

    module.exports = function (config) {
        var x = config.xScale;
        var y = config.yScale;
        var node = config.node.append('g');
        var barWidth, duration;

        function render() {
            var bars = node.selectAll('rect').data(config.data);

            bars.enter().append('rect');
            bars.exit().remove();

            bars.attr({
                    y: y(0),
                    height: 0
                })
                .transition()
                .duration(duration)
                .attr({
                    width: barWidth,
                    x: function (d) {
                        return x(config.parsers.x(d)) - barWidth / 2;
                    },
                    y: function (d) {
                        return Math.min(y(0), y(config.parsers.y(d)));
                    },
                    height: function (d) {
                        return Math.abs(y(0) - y(config.parsers.y(d)));
                    }
                });
        }

        var bars = {
            attr: function (name, val) {
                node.attr(name, val);
                return bars;
            },
            barWidth: function (val) {
                barWidth = val;
                return bars;
            },
            duration: function (val) {
                duration = val;
                return bars;
            },
            render: render
        };

        return bars;
    };

});
