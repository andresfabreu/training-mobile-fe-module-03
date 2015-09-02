/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : index.spec.js
 *  Description: scrolling-hook unit test
 *  ----------------------------------------------------------------
 */
'use strict';

require('angular-mocks');

var component = require('../scripts/main');

describe('ui.scrolling-hook testing suite', function() {

    beforeEach(window.module(component.name));

    it('should be named launchpad.ui.scrolling-hook', function() {
        expect(component).toBeObject();
    });

});
