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
var main = require('../scripts/main');

describe('ui.touch testing suite', function() {
    it('should export an object', function() {
        expect(main).toBeObject();
    });
});
