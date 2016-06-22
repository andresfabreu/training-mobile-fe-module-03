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
describe('Module automation', function() {
    /*----------------------------------------------------------------*/
    /* Mock modules/Providers
    /*----------------------------------------------------------------*/
    beforeEach(ngModule(main.name, function(lpAutomationProvider) {
    }));

    /*----------------------------------------------------------------*/
    /* Main Module
    /*----------------------------------------------------------------*/
    describe('Module', function() {
        it('should be an object', function() {
            expect(main).toBeObject();
        });

        it('should contain a provider service', ngInject(function(lpAutomation) {
            expect(lpAutomation).toBeObject();
        }));
    });
});

