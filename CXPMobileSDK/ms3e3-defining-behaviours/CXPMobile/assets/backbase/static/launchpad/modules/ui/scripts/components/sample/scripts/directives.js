define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.lpSample = function(lpCoreUtils) {

        function ctrlFn(ctrl, el, attrs, ngModelCtrl) {

            ctrl.triggerAction = function(ev) {
                ctrl.data = lpCoreUtils.uniqueId('unique-');
                ctrl.onAction({$event: ev, params: {foo: 'bar'} });
            };
        }

        function compileFn(){
            return ctrlFn;
        }

        function templateFn() {
            return [
                '<div>',
                    '<h3>Hello {{data}}</h3>',
                    '<button class="btn btn-default" ng-if="config.showButton" ng-click="triggerAction($event)">click me hard</button>',
                '</div>'
            ].join('');
        }

        return {
            restrict: 'EA',
            priority: Number.MAX_VALUE,
            //replace: false, DO NOT USE REPLACE  ([DEPRECATED!], will be removed in next major release)
            template: templateFn,
            compile: compileFn,
            require: '?ngModel',
            // bindToController: true 1.3
            scope: {
                data: '=ngModel',
                config: '=lpSample',
                onAction: '&'
            }
        };
    };
});
