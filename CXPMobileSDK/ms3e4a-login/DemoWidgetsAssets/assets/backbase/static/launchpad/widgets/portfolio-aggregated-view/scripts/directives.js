define(function (require, exports, module){
    'use strict';

    var angular = require('base').ng;
    var Treemap = require('./view-treemap');
    var BarChart = require('./view-bar-chart');

    // @ngInject
    exports.lpWealthAggregatedView = function ($window, utils, d3tip) {
        function main(scope, element, attrs) {
            var Constructor = (attrs.type === 'treemap' ? Treemap : BarChart)(utils, d3tip);
            var instance = new Constructor(element[0]);

            function resize() {
                var parent = element.parent(),
                    width = parent.parent().width(),
                    height = parent.height();
                if (width <= 0 || height <= 0) {
                    return;
                }
                instance.resize(width, height);
            }
            resize();

            angular.element($window).on('resize', utils.debounce(resize, 250));
            scope.$watch('data', function (data) {
                if (data) {
                    instance.update(data[attrs.key]);
                }
            });
        }

        return {
            restrict: 'EA',
            require: '?ngModel',
            priority: Number.MAX_VALUE,
            link: main,
            scope: {
                data: '=lpWealthAggregatedView'
            }
        };
    };
});
