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
describe('Provider', function() {
    var devicesProvider;
    /*----------------------------------------------------------------*/
    /* Mock modules/Providers
    /*----------------------------------------------------------------*/
    beforeEach(ngModule(main.name, function(lpDevicesProvider) {
        devicesProvider = lpDevicesProvider;
    }));

    /*----------------------------------------------------------------*/
    /* Main Module
    /*----------------------------------------------------------------*/
    describe('Module Devices', function() {
        it('should be an object', function() {
            expect(main).toBeObject();
        });

        it('should contain a provider', ngInject(function() {
            expect(devicesProvider).toBeObject();
        }));

        it('provider should have $get', ngInject(function() {
            expect(devicesProvider.$get).toBeFunction();
        }));

    });

});
