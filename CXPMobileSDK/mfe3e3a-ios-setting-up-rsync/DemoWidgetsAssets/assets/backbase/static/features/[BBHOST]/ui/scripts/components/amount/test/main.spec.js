'use strict';

var main = require('../scripts/main');
/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/
describe('ui.amount testing suite', function() {
    it('should export an object', function() {
        expect(main).toBeObject();
    });
});
