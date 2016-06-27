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
describe('Module estatements', function() {
    var estatementsProvider;
    /*----------------------------------------------------------------*/
    /* Mock modules/Providers
    /*----------------------------------------------------------------*/
    beforeEach(ngModule(main.name, function(lpEstatementsProvider) {
        estatementsProvider = lpEstatementsProvider;
    }));

    /*----------------------------------------------------------------*/
    /* Main Module
    /*----------------------------------------------------------------*/
    describe('Module', function() {
        it('should be an object', function() {
            expect(main).toBeObject();
        });

        it('should contain a provider', ngInject(function() {
            expect(estatementsProvider).toBeObject();
        }));

        it('should contain a provider service', ngInject(function(lpEstatements) {
            expect(lpEstatements).toBeObject();
        }));

        it('should contain a utils constant', ngInject(function(lpEstatementsUtils) {
            expect(lpEstatementsUtils).toBeDefined();
        }));
    });

});


