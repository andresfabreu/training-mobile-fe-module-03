/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : index.spec.js
 *  Description: Sample component unit test
 *  ----------------------------------------------------------------
 */

'use strict';
// include the component
var component = require('../scripts/main');

require('angular-mocks');
/*----------------------------------------------------------------*/
/* Module testing
/*----------------------------------------------------------------*/
describe('ui.card testing suite', function() {

    it('should export an object', function() {
        expect(component).toBeObject();
    });

    describe('directive lp-card', function() {
        var $compile, $rootScope;

        beforeEach(window.module(component.name));

        beforeEach(window.inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));

        it('Replaces the element with the appropriate content', function() {
            var element = $compile('<lp-card></lp-card>')($rootScope);
            expect(element.html()).toContain('div');
        });
    });

});
