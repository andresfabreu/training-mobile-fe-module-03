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

describe('ui.focus testing suite', function() {

    var lpFocus;

    beforeEach(window.module(component.name));

    beforeEach(window.inject(function(_lpFocus_) {
        lpFocus = _lpFocus_;
    }));

    it('should be named launchpad.ui.focus', function() {
        expect(component.name).toBe('launchpad.ui.focus');
    });

    it('should define lpFocus service', function() {
        expect(typeof lpFocus).toBe('function');
    });

});
