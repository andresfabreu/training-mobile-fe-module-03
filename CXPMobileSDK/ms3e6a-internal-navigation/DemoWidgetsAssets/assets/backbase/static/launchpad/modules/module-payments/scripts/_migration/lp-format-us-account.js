define(function(require, exports, module) {
    'use strict';

    /**
     * Angular directive to hook filter into ng-model
     */

    // @ngInject
    exports.lpFormatUsAccount = function($filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {

                var addSeperator = function(input) {

                    //filter input with spaces
                    var filtered = $filter('addSeperator')(input);

                    if(filtered !== input) {

                        ctrl.$setViewValue(filtered);
                        ctrl.$render();
                    }

                    return filtered;
                };

                ctrl.$parsers.push(addSeperator);
            }
        };
    };
});