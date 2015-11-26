define(function (require, exports, module) {
    'use strict';

    var d3 = require('d3');
    var angular = require('base').ng;

    var ARROW = '<div class="arrow"></div>';
    var ARROW_SIZE = 7;
    var BORDER_RADIUS = 5;

    module.exports = function (config) {
        var x = config.xScale;
        var y = config.yScale;
        var bisect;

        var node = config.node.append('rect')
            .style('opacity', 0)
            .attr({
                x: 0,
                y: 0
            });
        var $node = angular.element(node.node());

        var $tooltip = angular.element('<div class="d3-tip"/>').appendTo(document.body);

        function show(dataItem) {
            $tooltip
                .html(ARROW + config.formatters.tooltip(dataItem))
                .css('opacity', 1);

            var offset = $node.offset();
            offset.left = offset.left + x(config.parsers.x(dataItem)) - $tooltip.outerWidth() / 2 | 0;
            offset.top = offset.top + y(config.parsers.y(dataItem)) - $tooltip.outerHeight() - ARROW_SIZE | 0;
            $tooltip.offset(offset);

            // Overflow? Adjusting the tooltip position and shape

            var tooltipRect = $tooltip[0].getBoundingClientRect();
            var rootRect = config.node.node().getBoundingClientRect();
            var delta = (
                tooltipRect.left < rootRect.left ? tooltipRect.left - rootRect.left :
                tooltipRect.right > rootRect.right ? tooltipRect.right - rootRect.right : 0
            ) | 0;

            var width = tooltipRect.width / 2 - ARROW_SIZE | 0;
            $tooltip
                .toggleClass('no-bl', delta < BORDER_RADIUS - width)
                .toggleClass('no-br', delta > width - BORDER_RADIUS);

            if (delta) {
                offset.left -= delta;
                $tooltip.css(offset);

                var leftBorder = ARROW_SIZE;
                var rightBorder = ARROW_SIZE;

                if (delta < -width) {
                    leftBorder = Math.max(0, width + ARROW_SIZE + delta);
                    delta = -width;
                } else if (delta > width) {
                    rightBorder = Math.max(0, width + ARROW_SIZE - delta);
                    delta = width + ARROW_SIZE - rightBorder;
                }

                $tooltip.find('.arrow').css({
                    'margin-left': delta - ARROW_SIZE,
                    'border-left-width': leftBorder,
                    'border-right-width': rightBorder
                });
            }
        }

        function check() {
            var data = config.data;
            var x0 = +x.invert(d3.mouse(this)[0]);
            bisect = bisect || d3.bisector(config.parsers.x).left;
            var i = bisect(data, x0, 1);
            if (i < data.length) {
                var d0 = data[i - 1];
                var d1 = data[i];
                show(x0 - config.parsers.x(d0) < config.parsers.x(d1) - x0 ? d0 : d1);
            }
        }

        function hide() {
            $tooltip.css('opacity', 0);
        }

        node.on('mousemove', check)
            .on('mouseleave', hide);

        function resize(width, height) {
            node.attr({
                width: width,
                height: height
            });
        }

        return {resize: resize};
    };

});
