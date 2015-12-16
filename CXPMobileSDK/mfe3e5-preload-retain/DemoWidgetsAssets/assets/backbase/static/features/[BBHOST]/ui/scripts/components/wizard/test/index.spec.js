
/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : index.spec.js
 *  Description: wizard unit test
 *  ----------------------------------------------------------------
 */
'use strict';
// use angular mocks because it is an angular component
require('angular-mocks');
var angular = window.angular;
// include the component
var component = require('../scripts/main');

/*----------------------------------------------------------------*/
/* Module testing
/*----------------------------------------------------------------*/
describe('ui.wizard testing suite', function() {

    it('should export an object', function() {
        expect(component).toBeObject();
    });

    describe('lpWizard directive', function() {

        var scope, $element, steps, views, $heading;

        beforeEach(window.module(component.name));

        beforeEach(window.inject(function(_$compile_, _$rootScope_) {

            scope = _$rootScope_.$new();

            $element = _$compile_(
                '<div lp-wizard="wizard" next-step="wizardNextStep" get-active-step="getActiveWizardStep" title="Some wizard title">' +
                    '<div heading="Step 1" lp-wizard-step=""></div>' +
                    '<div heading="Step 2" lp-wizard-step=""></div>' +
                '</div>'
            )(scope);
            scope.$digest();

            steps = $element[0].querySelector('div.wizard-steps');
            views = $element[0].querySelector('div.wizard-views');
            $heading = $element.find('h3');
        }));


        it('Should bind step titles', function() {
            var headings = steps.querySelectorAll('.wizard-step-heading');
            expect(headings[0].textContent.trim()).toBe('Step 1');
            expect(headings[1].textContent.trim()).toBe('Step 2');
        });

        it('Should bind wizard heading', function() {
            expect($heading.text()).toBe('Some wizard title');
        });

        it('Should return active step index', function() {

            expect(scope.getActiveWizardStep()).toEqual(1);

            scope.wizardNextStep();
            scope.$apply();

            expect(scope.getActiveWizardStep()).toEqual(2);
        });

        it('Step 1 should be selected by default', function() {

            var step = steps.querySelector('.wizard-step');
            expect(angular.element(step).hasClass('wizard-active-step')).toBe(true);

            var viewsDivs = views.querySelectorAll('.wizard-view');
            expect(angular.element(viewsDivs[0]).hasClass('ng-hide')).toBe(false);
            expect(angular.element(viewsDivs[1]).hasClass('ng-hide')).toBe(true);
        });
    });

});
