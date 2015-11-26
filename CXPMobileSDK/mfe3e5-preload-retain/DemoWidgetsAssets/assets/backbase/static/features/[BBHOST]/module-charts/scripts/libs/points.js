define(function (require, exports, module) {
    'use strict';

    module.exports = function (config) {
        var x = config.xScale;
        var y = config.yScale;
        var node = config.node.append('g');
        var duration;

        function render() {
            var points = node.selectAll('circle').data(config.data);

            points
                .enter()
                .append('circle');

            points.exit().remove();

            points
                .attr('r', 0)
                .transition()
                .delay(duration)
                .duration(duration / 4)
                .attr({
                    r: 4,
                    cx: function (d) {
                        return x(config.parsers.x(d));
                    },
                    cy: function (d) {
                        return y(config.parsers.y(d));
                    }
                });
        }

        var api = {
            attr: function (name, val) {
                node.attr(name, val);
                return api;
            },
            duration: function (val) {
                duration = val;
                return api;
            },
            render: render
        };

        return api;
    };

});
