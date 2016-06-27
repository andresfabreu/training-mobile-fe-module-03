/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : util.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

var main = require('../../scripts/main');

require('angular-mocks');

var ngModule = window.module;
var ngInject = window.inject;

describe('EBilling utils service', function() {
    var utils;

    it('Pass test', function() {
        expect(utils).toBeUndefined();
    });

    // beforeEach(ngModule(main.name, ['EBill.utils', function(ebillUtils) {
    //     utils = ebillUtils;
    // }]));

    // it('should be an object', ngInject(function() {
    //     expect(utils).toBeObject();
    // }));
});
