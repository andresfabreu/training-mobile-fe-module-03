/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : utils.is.spec.js
 *  Description:
 *  Unit tests for module utils.is
 *  ----------------------------------------------------------------
 */

var is = require('../../scripts/modules/utils/is');

/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/

describe('Core::Utils::is ', function() {

    it('should be an object', function() {
        expect(is).toBeObject();
    });

    //test isValidUUID function
    describe('#isValidUUID', function() {
        it('should return true if string is a valid UUID', function() {
            var values = [
                '17f1a59d-582c-4cf4-8203-04736f47be8a',
                'fe8a82f6-36d5-11e5-a151-feff819cdc9f',
                '9c456dca-1937-4e37-9f63-c400c7ed249e',
                'aaea35d7-6125-48c0-ace2-082ff2eeb9e3',
                '2eb7450d-a98c-43ac-9b30-93a267b06c33',
                '896d773f-7a93-40e9-9872-275fb4a5cd58',
                '5787c774-36d6-11e5-a151-feff819cdc9f',
                '5787c878-36d6-11e5-a151-feff819cdc9f'
            ];

            values.forEach(function(value) {
                expect(is.isValidUUID(value)).toBe(true);
            });
        });

        it('should return false if string is not a valid UUID', function() {
            var values = [
                '5787c878-36d6-11e5-a151-feff819cdc9',
                'test',
                123,
                null,
                undefined,
                '',
                function() {}
            ];

            values.forEach(function(value) {
                expect(is.isValidUUID(value)).toBe(false);
            });
        });
    });
});
