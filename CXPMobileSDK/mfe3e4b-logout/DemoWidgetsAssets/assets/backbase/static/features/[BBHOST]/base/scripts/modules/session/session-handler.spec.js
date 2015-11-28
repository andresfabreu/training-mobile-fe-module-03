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
    describe('Session handler instance', function() {
        var sessionHandler = Session.getInstance();
        console.log(sessionHandler);
        it('should export an object', function() {
            expect(sessionHandler).toBeObject();
        });
        it('should be a function', function() {
            expect(sessionHandler.init).toBeFunction();
            expect(sessionHandler.logout).toBeFunction();
            expect(sessionHandler.startPolling).toBeFunction();
            expect(sessionHandler.ping).toBeFunction();
            expect(sessionHandler.makeSessionRequest).toBeFunction();
            expect(sessionHandler.handleStateResponse).toBeFunction();
            expect(sessionHandler.logError).toBeFunction();
            expect(sessionHandler.handleNetworkError).toBeFunction();
            expect(sessionHandler.startSessionWarning).toBeFunction();
            expect(sessionHandler.clearSessionWarning).toBeFunction();
        });
        it('should be false', function() {
            expect(sessionHandler.hasSession).toBeFalse();
            expect(sessionHandler.isPollingStarted).toBeFalse();
        });
    });
});



