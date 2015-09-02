/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : index.spec.js
 *  Description: nav-icon unit test
 *  ----------------------------------------------------------------
 */

'use strict';

require('angular-mocks');

var component = require('../scripts/main');

describe('ui.nav-icon testing suite', function() {

    var $rootScope, $injector, $compile;

    beforeEach(window.module(component.name));

    beforeEach(window.inject(function(_$rootScope_, _$injector_) {
        $rootScope = _$rootScope_;
        $injector = _$injector_;
        $compile = $injector.get('$compile');
    }));

    it('should export an object', function() {
        expect(component).toBeObject();
    });

    it('should replace element with span with proper class', function() {
        var $element = $compile('<div nav-icon="\'star-empty\'"></div>')($rootScope);
        $rootScope.$digest();

        expect($element[0].tagName).toBe('SPAN');
        expect($element.hasClass('glyphicon-star-empty')).toBe(true);

    });

    it('should support legacy icon attribute', function() {

        var $element = $compile('<div nav-icon="\'refresh\'" icon="\'chevron-left\'"></div>')($rootScope);
        $rootScope.$digest();

        expect($element.hasClass('glyphicon-chevron-left')).toBe(true);

    });

});
