define(function (require, exports, module) {
    'use strict';

    var angular = require('base').ng;
    var d3 = require('d3');
    var utils, d3tip;

    var classed = (function(prefix, max) {
        var i = -1;
        return function () {
            if (++i > max - 1) {
                i = 0;
            }
            return prefix + i;
        };
    })('node cat-', 8);

    var bySize = function (a, b) {
        return a.size - b.size;
    };

    function Treemap(el) {
        this.treemap = d3.layout.treemap().sort(bySize).value(utils.property('size'));
        this.el = d3.select(el).append('div').attr('class', 'treemap');

        var $el = angular.element(this.el[0]);
        var height = function (d) {
            return Math.max(0, d.dy) + 'px';
        };

        function pos(tip) {
            // TODO: refactor to not use __data__?
            var d = this.__data__; // eslint-disable-line no-underscore-dangle
            var offset = $el.offset();
            return {
                left: offset.left + d.x + d.dx / 2 - tip[0].offsetWidth / 2 + 'px',
                top: offset.top + d.y + d.dy / 2 - tip[0].offsetHeight + 'px'
            };
        }

        function text(d) {
            return d.name + '<br/>' + d.size + '%';
        }

        this.style = {
            left: function (d) {
                return d.x + 'px';
            },
            top: function (d) {
                return d.y + 'px';
            },
            width: function (d) {
                return Math.max(0, d.dx) + 'px';
            },
            height: height,
            'line-height': height
        };

        this.html = utils.compose(function (s) { return '<span>' + s + '</span>'; }, text);
        this.tip = d3tip().attr('class', 'd3-tip').html(text).pos(pos);
        this.el.call(this.tip);
    }

    Treemap.prototype = {
        constructor: Treemap,
        parse: function (data) {
            return {children: data.map(this.convert)};
        },
        convert: function (d) {
            return {
                name: d.assetTypeName && d.zoneName
                    ? d.assetTypeName + '<br/>' + d.zoneName
                    : d.assetTypeName || d.zoneName || d.equitySectorName,
                size: d.percentage
            };
        },
        update: function (data) {
            this.nodes = this.el.datum(this.parse(data)).selectAll('.node')
                .data(this.treemap.nodes)
                .enter().append('div')
                .attr('class', classed)
                .on('mouseover', this.tip.show)
                .on('mouseout', this.tip.hide);
            this.render();
        },
        render: function () {
            if (this.nodes) {
                this.el.selectAll('.node')
                    .data(this.treemap.nodes)
                    .style(this.style)
                    .html(this.html);
            }
        },
        resize: function (w, h) {
            this.treemap.size([w, h]);
            this.el.style('height', h + 'px');
            this.render();
        }
    };

    module.exports = function (_utils, _d3tip) {
        utils = _utils;
        d3tip = _d3tip;
        return Treemap;
    };
});
