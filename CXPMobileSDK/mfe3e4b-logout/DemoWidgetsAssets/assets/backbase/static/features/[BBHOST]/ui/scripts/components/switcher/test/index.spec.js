/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : index.spec.js
 *  Description: switcher unit test
 *  ----------------------------------------------------------------
 */
'use strict';
// include the component
var component = require('../scripts/main');

require('angular-mocks');
/*----------------------------------------------------------------*/
/* Module testing
/*----------------------------------------------------------------*/
describe('ui.switcher testing suite', function() {

    it('should export an object', function() {
        expect(component).toBeObject();
    });

    describe('directive lp-enable-disable-toggle', function() {
        var $compile, $rootScope;

        // Load the component module, which contains the directive
        beforeEach(window.module(component.name));

        // Store references to $rootScope and $compile
        // so they are available to all tests in this describe block
        beforeEach(window.inject(function(_$compile_, _$rootScope_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        it('Replaces the element with the appropriate content', function() {
            // Compile a piece of HTML containing the directive
            var element = $compile('<div lp-enable-disable-toggle="true"></div>')($rootScope);
            $rootScope.$digest();

            // Check that the compiled element contains the templated content
            expect(element.html()).toContain('Enabled');
        });
    });

});

