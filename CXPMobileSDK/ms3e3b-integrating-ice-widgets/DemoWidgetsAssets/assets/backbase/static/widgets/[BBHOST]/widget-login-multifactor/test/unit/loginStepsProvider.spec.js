/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : loginStepsProvider.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

var widget = require('../../scripts/main');

require('angular-mocks');

describe('loginStepsProvider test suite', function() {
    var providerConfig;
    var provider;
    var stepName = 'testStep';
    var stepBack = stepName + 'Back';
    var stepNext = stepName + 'Next';
    var steps = [stepBack, stepName, stepNext];
    var routes = {};
    routes[stepBack] = {
        back: jasmine.createSpy('back'),
        next: stepName
    };
    routes[stepName] = {
        back: stepBack,
        next: stepNext
    };
    routes[stepNext] = {
        back: stepName,
        next: jasmine.createSpy('next')
    };

    var getProvider = function(routes, initialStep) {
        if (routes) {
            providerConfig.setRoutes(routes);
        }
        if (initialStep) {
            providerConfig.setInitialStep(initialStep);
        }

        return providerConfig.$get(window.setTimeout);
    };

    var setSteps = function() {
        for(var i = 0, len = steps.length; i < len; i++) {
            provider.addStep(steps[i]);
        }
    };

    beforeEach(window.module(widget.name, function(loginStepsProvider) {
        providerConfig = loginStepsProvider;
        provider = getProvider();
    }));

    it('should exist', inject(function() {
        expect(providerConfig).not.toBeUndefined();
        expect(provider).not.toBeUndefined();
    }));

    describe('when add step', function() {
        it('should raise an exception when no step provided', inject(function() {
            var error = new Error('You must provide an id for the step');
            expect(function() { provider.addStep(); }).toThrow(error);
        }));

        it('should create a new step', inject(function() {
            provider.addStep(stepName);
            expect(provider.steps[stepName]).not.toBeUndefined();
        }));

        it('should create a new step configured with options', inject(function() {
            var options = {
                shown: true,
                onShow: function() {},
                onHide: function() {},
                back: function() {},
                next: function() {}
            };

            provider.addStep(stepName, options);
            expect(provider.steps[stepName]).toEqual(options);
        }));

        it('should put preconfigured routes in the step', inject(function() {
            provider = getProvider(routes);
            provider.addStep(stepName);
            expect(provider.steps[stepName].back).toEqual(stepBack);
            expect(provider.steps[stepName].next).toEqual(stepNext);
        }));
    });

    describe('when moving forward', function() {
        it('should navigate to next step', inject(function() {
            provider = getProvider(routes, stepName);
            setSteps();
            provider.to = jasmine.createSpy('to');
            provider.next();
            expect(provider.to).toHaveBeenCalledWith(stepNext);
        }));

        it('should execute next handler if is a function', inject(function() {
            provider = getProvider(routes, stepNext);
            setSteps();
            provider.next()
            expect(routes[stepNext].next).toHaveBeenCalled();
        }));
    });

    describe('when moving back', function() {
        it('should navigate to back step', inject(function() {
            provider = getProvider(routes, stepName);
            setSteps();
            provider.to = jasmine.createSpy('to');
            provider.back();
            expect(provider.to).toHaveBeenCalledWith(stepBack);
        }));

        it('should execute back handler if is a function', inject(function() {
            provider = getProvider(routes, stepBack);
            setSteps();
            provider.back()
            expect(routes[stepBack].back).toHaveBeenCalled();
        }));
    });

    describe('when navigating to a step', function() {
        beforeEach(inject(function() {
            provider = getProvider(routes, stepName);
            setSteps();
        }));

        it('should update the current step', inject(function() {
            provider.to(stepNext);
            expect(provider.getCurrent()).toEqual(stepNext);
        }));

        it('should hide rest of steps', inject(function() {
            provider.to(stepNext);
            expect(provider.steps[stepName].shown).toBeFalse();
            expect(provider.steps[stepBack].shown).toBeFalse();
        }));

        it('should show the current step', inject(function() {
            provider.to(stepNext);
            expect(provider.steps[provider.getCurrent()].shown).toBeTrue();
        }));
    });

    describe('when initialize', function() {
        it('should show the current step', inject(function() {
            provider = getProvider(routes, stepName);
            setSteps();
            provider.initialize();
            setTimeout(function() {
                expect(provider.steps[provider.getCurrent()].shown).toBeTrue();
            })
        }));
    });
});
