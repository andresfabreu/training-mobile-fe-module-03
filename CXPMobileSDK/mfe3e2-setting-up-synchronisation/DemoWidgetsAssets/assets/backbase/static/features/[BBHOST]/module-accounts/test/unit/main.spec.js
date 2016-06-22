/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : core.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

var main = require('../../scripts/main');

require('angular-mocks');

var ngModule = window.module;
var ngInject = window.inject;

/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/
describe('Module accounts', function() {
    var accountsProvider;

    /*----------------------------------------------------------------*/
    /* Mock modules/Providers
    /*----------------------------------------------------------------*/
    beforeEach(ngModule(main.name, function(lpAccountsProvider) {
        accountsProvider = lpAccountsProvider;
    }));

    /*----------------------------------------------------------------*/
    /* Main Module
    /*----------------------------------------------------------------*/
    describe('Accounts Main Module', function() {
        it('should be an object', function() {
            expect(main).toBeObject();
        });

        it('should contain an accounts provider', ngInject(function() {
            expect(accountsProvider).toBeObject();
        }));

        it('should contain an accounts provider service', ngInject(function(lpAccounts) {
            expect(lpAccounts).toBeObject();
        }));
    });
});
