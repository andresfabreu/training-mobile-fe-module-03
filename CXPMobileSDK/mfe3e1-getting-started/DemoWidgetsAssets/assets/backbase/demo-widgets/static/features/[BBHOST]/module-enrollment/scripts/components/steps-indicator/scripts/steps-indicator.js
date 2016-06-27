define(function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpEnrollmentStepsIndicator = function($templateCache, lpCoreUtils) {

        $templateCache.put('$lpEnrollmentStepsIndicator.html',
            '<div class="lp-enrollment-steps-indicator text-center">' +
            '   <div class="dot" ng-repeat="step in steps" ng-class="{\'current-step\': (step + 1).toString() === currentStep}">&middot;</div>' +
            '</div>'
        );

        return {
            restrict: 'AE',
            template: $templateCache.get('$lpEnrollmentStepsIndicator.html'),
            scope: {
                totalSteps: '@',
                currentStep: '@'
            },
            link: function (scope, element, attrs) {

                // Creating a range array to iterate over
                scope.steps = lpCoreUtils.range(parseInt(scope.totalSteps));
            }
        };
    };

    // @ngInject
    exports.lpEnrollmentStepsIndicatorDesktop = function($templateCache, lpCoreUtils) {

        $templateCache.put('$lpEnrollmentStepsIndicatorDesktop.html',
            '<div class="lp-enrollment-steps-indicator-desktop">' +
            '   <div class="dot" ng-repeat="step in steps" ng-class="{\'marked-step\': (step + 1).toString() <= currentStep, \'not-first-step\': step !== 0}"><span class="dot-number">{{ step + 1 }}</span></div>' +
            '</div>'
        );

        return {
            restrict: 'AE',
            template: $templateCache.get('$lpEnrollmentStepsIndicatorDesktop.html'),
            scope: {
                totalSteps: '@',
                currentStep: '@'
            },
            link: function (scope, element, attrs) {

                // Creating a range array to iterate over
                scope.steps = lpCoreUtils.range(parseInt(scope.totalSteps));
            }
        };
    };
});

