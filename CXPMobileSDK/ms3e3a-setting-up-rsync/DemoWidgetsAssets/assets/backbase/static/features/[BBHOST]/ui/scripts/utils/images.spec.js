'use strict';
var images = require('./images');

describe('UI images utility', function() {
    it('should export a function', function() {
        expect(images).toBeObject();
    });

    it('extractInitials', function() {
        expect(images.extractInitials).toBeFunction();
    });

    it('getColorFromInitials', function() {
        expect(images.getColorFromInitials).toBeFunction();
    });

    it('getDefaultProfileImage', function() {
        expect(images.getDefaultProfileImage).toBeFunction();
    });

    it('decodePhotoUrl', function() {
        expect(images.getColorFromInitials).toBeFunction();
    });

});
