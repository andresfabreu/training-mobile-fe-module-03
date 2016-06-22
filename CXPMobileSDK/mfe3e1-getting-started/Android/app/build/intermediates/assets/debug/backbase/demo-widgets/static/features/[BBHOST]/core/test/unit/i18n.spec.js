/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : i18n.spec.js
 *  Description:
 *  Module i18n unit testing
 *  ----------------------------------------------------------------
 */

var i18n = require('../../scripts/modules/i18n/main');
require('angular-mocks');

var inject = window.inject;
var module = window.module;

describe('Core::Modules::i18n ', function() {

    it('should be an object', function() {
        expect(i18n).toBeObject();
    });


    /*----------------------------------------------------------------*/
    /* Main Error module
    /*----------------------------------------------------------------*/

    beforeEach(module(i18n.name, function($provide) {

    }));


    describe('lpCoreI18nUtils', function() {
        it('i18n Utils', inject(function($injector) {
            var i18nUtils = $injector.get('lpCoreI18nUtils');
        }));

    });

});
