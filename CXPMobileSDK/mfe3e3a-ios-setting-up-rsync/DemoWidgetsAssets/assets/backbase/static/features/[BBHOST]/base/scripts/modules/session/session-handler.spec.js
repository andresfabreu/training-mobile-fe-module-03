/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : session-handler.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */
'use strict';

var Session = require('./session-handler');

describe('Session handler', function() {

    it('should export an object', function() {
        expect(Session).toBeObject();
    });
    it('should export a function', function() {
        expect(Session.getInstance).toBeFunction();
    });
});



