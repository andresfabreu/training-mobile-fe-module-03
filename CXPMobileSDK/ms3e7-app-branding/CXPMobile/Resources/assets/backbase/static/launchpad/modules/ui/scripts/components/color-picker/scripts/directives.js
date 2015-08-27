define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpColorPicker = function($timeout, COLORS) {
        function lpColorPickerCtrl(scope, el, attrs) {
            scope.colors = COLORS;

            // focus first color
            $timeout(function() {
                el.find('li')[0].focus();
            }, 0);

            scope.keyDown = function(event, color) {
                if (event.which === 13 || event.which === 32) {
                    event.preventDefault();
                    event.stopPropagation();

                    scope.selectColor(color);
                }
            };
        }

        var tmpl = [
            '<ul class="color-picker clearfix">',
                '<li ng-repeat="color in colors" tabIndex="0" class="color cursor-pointer" title="{{color.name}}" ng-click="selectColor(color.value)" ng-keydown="keyDown($event, color.value)">',
                    '<div ng-style="{\'background-color\':color.value}"></div>',
                '</li>',
            '</ul>'
        ].join('');

        function compileFn() {
            return lpColorPickerCtrl;
        }

        return {
            scope: {
                selectColor: '='
            },
            restrict: 'AE',
            compile: compileFn,
            template: tmpl
        };
    };
});
