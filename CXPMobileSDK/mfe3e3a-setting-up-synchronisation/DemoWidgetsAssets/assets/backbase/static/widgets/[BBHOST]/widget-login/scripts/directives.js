define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.autofill = function() {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {
                scope.$on('autofill:update', function() {
                    ngModel.$setViewValue(element.val());
                });
            }
        };
    };
});
