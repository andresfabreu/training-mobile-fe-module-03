/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : index.spec.js
 *  Description: steps-indicator unit test
 *  ----------------------------------------------------------------
 */

'use strict';

require('angular-mocks');

var component = require('../scripts/main');
var ngInject = window.inject;

describe('labeled-input testing suite', function() {
    var utils;

    beforeEach(window.module(component.name));

    beforeEach(ngInject(function(lpLabeledInputUtil){
        utils = lpLabeledInputUtil;
    }));

    it('should export an object', function() {
        expect(component).toBeObject();
    });

    it('Mirror field test', function() {
        var obj = [
            {
                id: '1',
                name: 'one'
            },
            {
                id: '2',
                name: 'two'
            },
            {
                id: '3',
                name: 'three',
                mirror: 'one'
            }
        ];
        utils.updateByMirrors(obj);
        expect(obj[2].mirror).toBeObject();
        expect(obj[2].mirror.id).toBe('1');
    });

    it('Regexp escape test', function() {
        expect(utils.escapeRegExp('.+') === '\\.\\+').toBeTrue();
    });

});
