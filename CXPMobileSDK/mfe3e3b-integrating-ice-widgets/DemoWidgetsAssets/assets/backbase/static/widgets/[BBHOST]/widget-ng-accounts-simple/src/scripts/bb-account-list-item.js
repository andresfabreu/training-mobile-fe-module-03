'use strict';

// if the module has no dependencies, the above pattern can be simplified to
(function(root, factory) {
    var moduleName = 'bbAccountListItem';
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
        return ['<a class="item item-icon-left item-icon-right list-group-item">',
                    '<i class="icon ion-card"></i>',
                    '<span ng-bind="ctrl.account.alias">...loading cards...</span>',
                    '<span class="item-note pull-right" ng-bind="ctrl.account.availableBalance"></span>',
                    '<i class="icon ion-ios-arrow-right"></i>',
                '</a>'].join('');
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
                    account: '=account'
                }
            };
        });

}));
