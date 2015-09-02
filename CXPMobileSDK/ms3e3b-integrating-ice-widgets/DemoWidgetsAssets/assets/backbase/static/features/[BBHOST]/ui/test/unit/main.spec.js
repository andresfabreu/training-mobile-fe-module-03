/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

// TODO: need to fix dependencies issues

var main = require('../../scripts/main');
/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/
describe('UI foundation main module ', function() {
    it('should have the correct module name', function() {
        expect(main.name).toBe('launchpad.ui');
    });
});
