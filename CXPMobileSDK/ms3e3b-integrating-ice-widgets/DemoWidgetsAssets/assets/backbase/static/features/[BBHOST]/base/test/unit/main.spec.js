/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

var base = require('../../scripts/main');

/*----------------------------------------------------------------*/
/* Unit testing with jasmine
/*----------------------------------------------------------------*/
describe('Base Resource public API ', function() {

    it('should export createModule', function() {
        var dummyModule = base.createModule('dummy',[]);
        expect(base.createModule).toBeFunction();
        expect(dummyModule.name).toContain('launchpad');
    });

    it('should export angular.boostrap', function() {
        expect(base.bootstrap).toBeFunction();
    });

    it('should export angular inject helper', function() {
        expect(base.inject).toBeFunction();
        expect(base.inject('$http')).toBeFunction();
    });
});
