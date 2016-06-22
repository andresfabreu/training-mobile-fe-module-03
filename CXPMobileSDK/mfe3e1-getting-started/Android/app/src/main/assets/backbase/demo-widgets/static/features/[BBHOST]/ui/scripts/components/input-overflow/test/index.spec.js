/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : index.spec.js
 *  Description: input-overflow unit test
 *  ----------------------------------------------------------------
 */

'use strict';

require('angular-mocks');

var component = require('../scripts/main');

describe('ui.input-overflow testing suit', function() {

    var $rootScope, $injector, $compile, $compiled;

    beforeEach(window.module(component.name));

    beforeEach(window.inject(function(_$rootScope_, _$injector_) {
        $rootScope = _$rootScope_;
        $injector = _$injector_;
        $compile = $injector.get('$compile');
    }));

    beforeEach(function() {
        $compiled = $compile('<input ng-model="testModel" type="text" lp-input-overflow />')($rootScope);
    });

    it('should export an object', function() {
        expect(component).toBeObject();
    });

    it('should compile directive and wrap it properly', function() {

        var $parent = $compiled.parent(),
            $children = $parent.children();

        expect($parent[0].className).toBe('lp-input-overflow');
        expect($children[0].className).toBe('lp-input-overflow-indicator');
        expect($children[1].className).toBe('lp-input-overflow-input-text');
    });

});
