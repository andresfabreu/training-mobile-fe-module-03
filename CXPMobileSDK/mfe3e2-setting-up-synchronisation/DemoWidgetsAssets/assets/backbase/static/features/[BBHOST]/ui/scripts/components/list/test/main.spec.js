'use strict';
var main = require('../scripts/main');
/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/
describe('ui.list testing suit', function() {
    it('should export an object', function() {
        expect(main).toBeObject();
    });
});
