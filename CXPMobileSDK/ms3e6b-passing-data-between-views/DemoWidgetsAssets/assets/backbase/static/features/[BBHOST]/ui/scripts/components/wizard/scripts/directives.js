define(function(require, exports, module) {
    'use strict';

    var base = require('base');

    var utils = base.utils;

    // @ngInject
    exports.lpWizard = function() {
        return {
            restrict: 'A',
            transclude: true,
            replace: true,
            scope: {
                wizard: '=lpWizard',
                title: '@title'
            },
            controller: 'WizardController',
            link: function(scope, element, attrs) {

                scope.wizard = scope.wizard || {};

                scope.currentStepIndex = 0;
                // create functions in the parent scope of directive

                scope.wizard.nextStep = function() {
                    if (scope.wizardSteps[scope.currentStepIndex + 1]) {
                        scope.wizardSteps[++scope.currentStepIndex].active = true;
                    }
                };

                scope.wizard.getActiveStep = function() {
                    return scope.currentStepIndex + 1;
                };

                scope.wizard.previousStep = function() {
                    if (scope.wizardSteps[scope.currentStepIndex - 1]) {
                        scope.wizardSteps[--scope.currentStepIndex].active = true;
                    }
                };

                scope.wizard.goToStep = function(index) {
                    --index;

                    if (scope.wizardSteps[index]) {
                        scope.currentStepIndex = index;
                        scope.wizardSteps[scope.currentStepIndex].active = true;
                    }
                };

                // not needed if we passing wizard="wizard"
                scope.$parent.$parent[attrs.nextStep] = scope.wizard.nextStep;
                scope.$parent.$parent[attrs.getActiveStep] = scope.wizard.getActiveStep;
                scope.$parent.$parent[attrs.previousStep] = scope.wizard.previousStep;
                scope.$parent.$parent[attrs.goToStep] = scope.wizard.goToStep;

            },
            template: '<div class="wizard-wrapper">' +
                    '	<div class="panel panel-default wizard-header text-center" tabindex="0" aria-labelledby="{{wizardSteps[currentStepIndex].uniqueId}}">' +
                    '		<div class="panel-heading">' +
                    '			<h3 class="wizard-header-title" ng-show="title">{{title}}</h3>' +
                    '			<div class="clearfix wizard-steps text-center" role="navigation" ng-transclude></div>' +
                    '		</div>' +
                    '	</div>' +
                    '	<div>' +
                    '		<div class="wizard-views">' +
                    '			<div ng-repeat="step in wizardSteps" class="wizard-view" ng-show="step.active" lp-wizard-content-transclude="step"></div>' +
                    '		</div>' +
                    '	</div>' +
                    '</div>'
        };
    };
    // @ngInject
    exports.lpWizardStep = function($parse) {
        return {
            require: '^lpWizard',
            restrict: 'A',
            replace: true,
            template: '<div class="wizard-step-container">' +
                    '	<i ng-if="stepIndex !== 1" class="glyphicon glyphicon-arrow-right pull-left wizard-step-arrow"></i>' +
                    '	<div class="wizard-step pull-left" ng-class="{\'wizard-active-step\': active}" lp-wizard-heading-transclude="">' +
                    '		<span class="wizard-step-number cursor-pointer" ng-click="goToStep(stepIndex)" ng-class="{\'wizard-step-number-active\': active, \'wizard-step-done\': completed, \'text-muted\': !completed && !active}">{{stepIndex}}</span>' +
                    '		<span id="{{uniqueId}}" class="wizard-step-heading visible-xs-block visible-sm-inline visible-md-inline visible-lg-inline" ng-class="{\'wizard-active-step\': active, \'hidden-sm hidden-xs\': !active,\'text-muted\': !completed && !active}">{{heading}}</span>' +
                    '	</div>' +
                    '</div>',
            transclude: true,
            scope: {
                active: '=?',
                heading: '@'
            },
            controller: function() {
            },
            compile: function(element, attribs, transclude) {
                return function postLink(scope, elm, attrs, wizardCtrl) {
                    scope.uniqueId = 'wizardStep-' + (wizardCtrl.instance++) + '-' + Math.floor(Math.random() * 10000);
                    scope.stepIndex = wizardCtrl.instance;
                    scope.$watch('active', function(active) {
                        if (active) {
                            wizardCtrl.select(scope);
                        }
                    });
                    scope.goToStep = wizardCtrl.goToStep;
                    wizardCtrl.addStep(scope);
                    scope.$transcludeFn = transclude;
                };
            }
        };
    };

    // @ngInject
    exports.lpWizardHeadingTransclude = function() {
        return {
            restrict: 'A',
            require: '^lpWizardStep',
            link: function(scope, elm, attrs, wizardCtrl) {
                scope.$watch('headingElement', function updateHeadingElement(heading) {
                    if (heading) {
                        elm.html('');
                        elm.append(heading);
                    }
                });
            }
        };
    };

    // @ngInject
    exports.lpWizardContentTransclude = function() {
        return {
            restrict: 'A',
            require: '^lpWizard',
            link: function(scope, elm, attrs) {
                var step = scope.$eval(attrs.lpWizardContentTransclude);
                step.$transcludeFn(step.$parent, function(contents) {
                    utils.forEach(contents, function(node) {
                        elm.append(node);
                    });
                });
            }
        };
    };


});
