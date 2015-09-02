'use strict';
var input = require('./input');

describe('UI images utility', function() {
    it('should export a function', function() {
        expect(input).toBeObject();
    });

    it('getSelectionPositionOfInput', function() {
        expect(input.getSelectionPositionOfInput).toBeFunction();
    });

    it('getNewCaretPosition', function() {
        expect(input.getNewCaretPosition).toBeFunction();
    });

    it('setCaretPositionOfInput', function() {
        expect(input.setCaretPositionOfInput).toBeFunction();
    });

});
