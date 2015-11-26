define(function (require, exports, module) {
    'use strict';

    module.name = 'module-charts';

    var base = require('base');

    var barChart = require('./components/bar-chart/scripts/main');
    var donutChart = require('./components/donut-chart/scripts/main');
    var lineChart = require('./components/line-chart/scripts/main');

    var deps = [
        barChart.name,
        donutChart.name,
        lineChart.name
    ];

    return base.createModule(module.name, deps);
});
