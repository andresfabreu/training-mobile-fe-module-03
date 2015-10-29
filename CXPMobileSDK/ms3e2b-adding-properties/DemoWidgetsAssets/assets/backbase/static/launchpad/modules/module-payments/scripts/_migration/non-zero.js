define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.nonZero =function() {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$parsers.unshift(function(value) {
                    ngModelCtrl.$setValidity("nonZero", parseInt(value, 10) !== 0);
                    return value;
                });
            }
        };
    };
});
