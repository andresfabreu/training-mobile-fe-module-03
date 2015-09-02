/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : utils.url.spec.js
 *  Description:
 *  Url utility functions tests
 *  ----------------------------------------------------------------
 */

var url = require('../../scripts/modules/utils/url');

/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/

describe('Core::Utils::url ', function() {
    describe('#parseQuerystring', function() {
        it('should return empty object if the param is not a string', function() {
            var values = [null, false, true, undefined, [], {}, 0, 9, function() {}];

            values.forEach(function(value) {
                expect(url.parseQuerystring(value)).toEqual({});
            });
        });

        it('should return empty object when empty string is supplied', function() {
            expect(url.parseQuerystring('')).toEqual({});
        });

        it('should return an object with one property when one param is supplied', function() {
            expect(url.parseQuerystring('test=1')).toEqual({ test: '1' });
        });

        it('should return an object with all the properties', function() {
            var str = 'param1=1&param2=2';
            var obj = {
                param1: '1',
                param2: '2'
            };

            expect(url.parseQuerystring(str)).toEqual(obj);
        });

        it('should parse arrays correctly', function() {
            var str = 'param=1&param=2&param=3&test=true';
            var obj = {
                param: ['1', '2', '3'],
                test: 'true'
            };

            expect(url.parseQuerystring(str)).toEqual(obj);
        });
    });

    describe('#buildQueryString', function() {
        it('should return an empty string if param is not an object', function() {
            var values = [null, undefined, '', 0, false, true, [], 'test', 9, function() {}];

            values.forEach(function(value) {
                expect(url.buildQueryString(value)).toEqual('');
            });
        });

        it('should build a correct querystring', function() {
            expect(url.buildQueryString({ param: 1})).toEqual('param=1');
            expect(url.buildQueryString({ param1: 1, param2: 2})).toEqual('param1=1&param2=2');
        });

        it('should handle arrays correctly', function() {
            expect(url.buildQueryString({ param: [1, 2, 3] })).toEqual('param=1&param=2&param=3');
        });
    });
});
