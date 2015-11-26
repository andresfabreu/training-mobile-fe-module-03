/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

var widget = require('../../scripts/main');

/**
 * Widget unit tests
 */
describe('Function based widget testing suit', function () {

    /**
     * Main module.
     */
    describe('${widget.name} testing suite', function () {

        it('should return function', function () {
            expect(widget).toBeFunction();
        });

    });

});

