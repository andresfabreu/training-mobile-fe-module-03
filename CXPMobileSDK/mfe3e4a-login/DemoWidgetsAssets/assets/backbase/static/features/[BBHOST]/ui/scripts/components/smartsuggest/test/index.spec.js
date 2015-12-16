'use strict';
var main = require('../scripts/main');

describe('ui.smartsuggest testing suite', function() {
    it('should export an object', function() {
        expect(main).toBeObject();
    });
});
