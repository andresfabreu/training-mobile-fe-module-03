/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : utils.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

var requireWidget = require('../../scripts/require-widget');

/*----------------------------------------------------------------*/
/* Unit testing with jasmine
/*----------------------------------------------------------------*/
describe('Require widget function', function() {
    it('should export a function', function() {
        expect(requireWidget).toBeFunction();
    });
});



