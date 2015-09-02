/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : core.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

var core = require('../../scripts/main');

/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/
describe('Core-Module test suite ', function() {
    it('Should be an object', function(){
        expect(core).toBeObject();
    });
});
