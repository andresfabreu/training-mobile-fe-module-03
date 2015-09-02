'use strict';
var widget = require('./widget');

describe('widget', function() {
    it('should export an object', function() {
        expect(widget).toBeFunction();
    });
});
