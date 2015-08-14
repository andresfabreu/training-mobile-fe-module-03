define(function (require, exports, module) {
    'use strict';

    var angular = require('base').ng;
    var d3 = require('d3');
    var utils, d3tip;

    function BarChart(el) {
        this.$ = angular.element(el).html('<div class="ytm"/>');
        this.x = d3.scale.ordinal();
        this.y = d3.scale.linear();
        this.svg = d3.select(el).append('svg');
        this.xAxis = d3.svg.axis().scale(this.x).orient('bottom').tickSize(0).tickFormat(d3.time.format('%Y'));
        this.svg.append('g').attr('class', 'bars');
        this.svg.append('g').attr('class', 'x axis');
    }

    BarChart.prototype = {
        constructor: BarChart,
        parse: function (data) {
            var parse = d3.time.format('%Y').parse;
            data.forEach(function (d) {
                d.date = parse(d.year);
            });
            return data;
        },
        update: function (data) {
            var date = utils.property('date'),
                amount = utils.property('amount');

            this.$.find('.ytm').html('<h2>' + data.averageYieldToMaturity.toFixed(2) + '%</h2>Avg. YTM');
            data = this.parse(data.datapoints);
            this.x.domain(data.map(date));
            this.y.domain([0, d3.max(data, amount)]);

            var html = utils.compose(function (s) {
                return s.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }, amount);
            var tip = d3tip().attr('class', 'd3-tip').offset([-7, 0]).html(html);
            this.svg.call(tip);
            this.svg.select('.bars').selectAll('rect').data(data).enter().append('rect')
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            var y = this.y;
            this.attrs = {
                width: this.x.rangeBand,
                x: utils.compose(this.x, date),
                y: utils.compose(this.y, amount),
                height: function (d) {
                    return y(0) - y(amount(d));
                }
            };
            this.render();
        },
        render: function () {
            this.svg.select('.bars').selectAll('rect').attr(this.attrs);
            this.svg.select('.x.axis').call(this.xAxis);
        },
        resize: function (w, h) {
            w -= this.$.find('.ytm').width();
            this.x.rangeBands([0, w], .1);
            this.y.range([h, 0]);
            this.svg.attr({width: w, height: h});
            this.svg.select('.x.axis').attr('transform', 'translate(0,' + (h - 30) + ')');
            this.render();
        }
    };

    module.exports = function (_utils, _d3tip) {
        utils = _utils;
        d3tip = _d3tip;
        return BarChart;
    };
});
