define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpFormatPaymentReference = function($filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ctrl) {

                var addSeperatorAndRF = function(input) {
                    //automatically add RF to start of reference if not present
                    if(input && input.length > 2) {
                        var sub = input.substring(0, 2);

                        if(sub !== "RF") {
                            input = "RF" + input;
                        }
                    }

                    //filter input with spaces
                    var filtered = $filter('addSeperator')(input);

                    if(filtered !== input) {

                        ctrl.$setViewValue(filtered);
                        ctrl.$render();
                    }

                    return filtered;
                };

                ctrl.$parsers.push(addSeperatorAndRF);
            }
        };
    };

    // @ngInject
    var ctrlFn = function($scope) {

        var initialize = function() {
            $scope.paymentReference = "";
            $scope.paymentDescription = "";

            $scope.showInfoMessage = false;

            $scope.paymentRefDisabled = false;
            $scope.paymentDescDisabled = false;
        };

        initialize();
    };
});
