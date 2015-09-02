/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

var main = require('../../scripts/main');

require('angular-mocks');

var sampleMock = require('./sample.mock');
var ngModule = window.module;
var ngInject = window.inject;

/*----------------------------------------------------------------*/
/* Module testing
/*----------------------------------------------------------------*/
describe('Module Users ', function() {
    var usersAuthenticationProvider;

    beforeEach(ngModule(main.name, function(lpUsersAuthenticationProvider) {
        usersAuthenticationProvider = lpUsersAuthenticationProvider;
    }));

    /*----------------------------------------------------------------*/
    /* Main Module
    /*----------------------------------------------------------------*/
    describe('Module', function() {
        it('should be an object', function() {
            expect(main).toBeObject();
        });

        it('should contain a provider', ngInject(function() {
            expect(usersAuthenticationProvider).toBeObject();
        }));
    });

    describe('Authentication service', function() {
        var usersAuthentication;

        beforeEach(ngInject(function(lpUsersAuthentication) {
            usersAuthentication = lpUsersAuthentication;
        }));

        it('should be an object', function() {
            expect(usersAuthentication).toBeObject();
        });

        it('should verify session status', function() {
            expect(usersAuthentication.isVerified).toBeDefined();

            // mock status
            usersAuthentication.MOCKABLE.session.status = 'verified';
            expect(usersAuthentication.isVerified()).toBeTrue();

            // check again with uppercase.
            usersAuthentication.MOCKABLE.session.status = 'VERIFIED';
            expect(usersAuthentication.isVerified()).toBeTrue();
        });
    });
});

