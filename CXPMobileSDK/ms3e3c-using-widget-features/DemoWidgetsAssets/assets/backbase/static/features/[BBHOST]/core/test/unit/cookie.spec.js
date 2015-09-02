/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : utils.cookie.spec.js
 *  Description:
 *  Cookie helper function tests
 *  ----------------------------------------------------------------
 */

var cookie = require('../../scripts/modules/utils/cookie');

/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/

describe('Core::Utils::cookie ', function() {

    it('should be an object', function() {
        expect(cookie).toBeObject();
    });

    //test getCookie function
    describe('#getCookie', function() {
        it('should return undefined if name is not a string', function() {
            var values = [null, undefined, '', 0, false, true, [], 9, function() {}];

            values.forEach(function(value) {
                expect(cookie.getCookie(value)).not.toBeDefined();
            });
        });

        it('should return correct cookie value', function() {
            var cookieName = 'bbCookieTest';
            var cookieValue = 'BBtestString';

            document.cookie = cookieName + "=" + cookieValue;

            expect(cookie.getCookie(cookieName)).toEqual(cookieValue);
        });
    });
});
