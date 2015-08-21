define(function(require, exports, module) {

    'use strict';
    var base = require('base');
    var utils = base.utils;

    // @ngInject
    exports.WizardController = function( $scope) {
        var ctrl = this,
            wizardSteps = ctrl.wizardSteps = $scope.wizardSteps = [];
        ctrl.instance = 0;

        ctrl.select = function(selectedStep) {

            utils.forEach(wizardSteps, function(step) {

                step.active = false;
                if(selectedStep.stepIndex > step.stepIndex) {
                    step.completed = true;
                } else {
                    step.completed = false;
                }
            });
            selectedStep.active = true;
        };

        ctrl.addStep = function addStep(step) {
            wizardSteps.push(step);
            if (wizardSteps.length === 1) {
                step.active = true;
            } else if (step.active) {
                ctrl.select(step);
            }
        };

        ctrl.goToStep = function(index) {
            index--;
            if(index < $scope.currentStepIndex) {
                ctrl.select(wizardSteps[index]);
                $scope.currentStepIndex = index;
            }
        };
    };
});
