// NOTE: I don't think file is actually used anywhere in LP.
define(function(require, exports, module) {
    'use strict';

    var d3 = require('d3');

    "use strict";

    var PieChart = function() {
        this._width = 500;
        this._height = 500;
        this._radius = 125;
        this._textPadding = 10;

        this._color = d3.scale.category20();
        this._arc = d3.svg.arc()
            .outerRadius(this._radius - 10)
            .innerRadius(0);
        this._pie = d3.layout.pie()
            .sort(null)
            .value(function(d) { return d.value; });
    };

    PieChart.prototype.draw = function(element, data){
        this._svg = d3.select(element).append("svg")
            .attr("width", this._width)
            .attr("height", this._height)
            .append("g")
            .attr("transform", "translate(" + this._width / 2 + "," + this._height / 2 + ")");

        this._data = data;
        this._drawPie();
    };

    PieChart.prototype._drawPie = function(){
        var chart = this,
            g = this._svg.selectAll(".arc")
                .data(this._pie(this._data))
                .enter().append("g")
                .attr("class", "arc");

        g.append("path")
            .attr("d", this._arc)
            .style("fill", function(d) {
                return chart._color(d.data.name);
            });

        g.append("text")
            .attr("transform", function(d) {
                var x = Math.cos(((d.startAngle + d.endAngle - Math.PI)/2)) * (chart._radius + chart._textPadding),
                    y = Math.sin((d.startAngle + d.endAngle - Math.PI)/2) * (chart._radius + chart._textPadding) ;

                return "translate(" + x + "," + y + ")";
            })
            .attr("text-anchor", function(d){
                if ((d.startAngle + d.endAngle)/2 < Math.PI ){
                    return "start";
                } else {
                    return "end";
                }
            })
            .text(function(d) {
                return d.data.name + ": " + d.data.value + "$";
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "14px");
    };

    exports.PieChart;

});
