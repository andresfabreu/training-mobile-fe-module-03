'use strict';

// if the module has no dependencies, the above pattern can be simplified to
(function(root, factory) {
    var moduleName = 'bbCard';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // only CommonJS-like environments that support module.exports,
        module.exports = factory(moduleName, root.angular);
    } else {
        // Browser globals (root is window)
        root[moduleName] = factory(moduleName, root.angular);
    }
}(this, function(name, angular) {

    function template() {
        return ['<div class="card panel panel-default">',
                    '<div class="item item-divider panel-heading" ng-bind="ctrl.header|uppercase"></div>',
                    '<div class="item item-text-wrap panel-body">',
                        '<span>{{ctrl.message}}</span>',
                        '<ng-transclude></ng-transclude>',
                    '</div>',
                '</div>'].join('');
    }

    function Controller() {


    }

    return angular.module(name, [])
        .directive(name, function() {
            return {
                restrict: 'E',
                replace:true,
                template: template,
                controller: Controller,
                controllerAs: 'ctrl',
                transclude: true,
                scope: {},
                bindToController: {
                    header: '=header',
                    message: '=message'
                }
            };
    });

}));
