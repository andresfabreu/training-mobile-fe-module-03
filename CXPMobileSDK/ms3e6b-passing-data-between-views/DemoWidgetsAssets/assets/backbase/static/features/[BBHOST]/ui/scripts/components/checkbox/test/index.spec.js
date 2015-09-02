/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : index.spec.js
 *  Description: Checkbox unit test
 *  ----------------------------------------------------------------
 */
'use strict';
// include the component
var component = require('../scripts/main');

require('angular-mocks');
/*----------------------------------------------------------------*/
/* Module testing
/*----------------------------------------------------------------*/
describe('ui.checkbox testing suite', function() {
    it('should export an object', function() {
        expect(component).toBeObject();
    });
});
