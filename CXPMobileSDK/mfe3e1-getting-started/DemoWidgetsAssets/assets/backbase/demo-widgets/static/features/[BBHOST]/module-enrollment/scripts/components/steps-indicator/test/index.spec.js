/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : index.spec.js
 *  Description: steps-indicator unit test
 *  ----------------------------------------------------------------
 */

'use strict';

require('angular-mocks');

var component = require('../scripts/main');

describe('steps-indicator testing suite', function() {

    beforeEach(window.module(component.name));

    it('should export an object', function() {
        expect(component).toBeObject();
    });

});
