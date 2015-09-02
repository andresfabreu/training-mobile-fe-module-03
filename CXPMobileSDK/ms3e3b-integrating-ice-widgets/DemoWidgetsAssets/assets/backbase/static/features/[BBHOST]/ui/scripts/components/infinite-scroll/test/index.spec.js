/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : index.spec.js
 *  Description: Focus unit test
 *  ----------------------------------------------------------------
 */
'use strict';

require('angular-mocks');

var component = require('../scripts/main');

describe('ui.infinite-scroll testing suit', function() {

    // var $rootScope, $injector, $compile, $compiled;

    beforeEach(window.module(component.name));

    beforeEach(window.inject(function(_$rootScope_, _$injector_) {
        // $rootScope = _$rootScope_;
        // $injector = _$injector_;
        // $compile = $injector.get('$compile');
    }));

    beforeEach(function() {
        //$compiled = $compile('<div lp-infinite-scroll=""></div>')($rootScope);
    });

    it('should export an object', function() {
        expect(component).toBeObject();
    });
});
