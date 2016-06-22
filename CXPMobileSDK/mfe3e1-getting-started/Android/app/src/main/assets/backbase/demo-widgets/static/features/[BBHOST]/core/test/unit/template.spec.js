/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : template.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

var template = require('../../scripts/modules/template/main');
/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/
describe('lpCoreTemplate Test suite', function() {
     it('Should be an object', function(){
        expect(template).toBeObject();
    });
});
