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
    var enrollmentProvider, api, utils, idle;
    
    /*----------------------------------------------------------------*/
    /* Mock modules/Providers
    /*----------------------------------------------------------------*/
    beforeEach(ngModule(main.name, function(lpEnrollmentProvider) {
        enrollmentProvider = lpEnrollmentProvider;
    }));

    beforeEach(ngInject(function(lpEnrollment, lpEnrollmentUtil){
        api = lpEnrollment.api();
        utils = lpEnrollmentUtil;
    }));

    /*----------------------------------------------------------------*/
    /* Main API Module
    /*----------------------------------------------------------------*/
    describe('Module Enrollment', function() {
        it('should be an object', function() {
            expect(main).toBeObject();
        });

        it('should contain a provider', ngInject(function() {
            expect(enrollmentProvider).toBeObject();
        }));

        it('provider should have $get', ngInject(function() {
            expect(enrollmentProvider.$get).toBeFunction();
        }));

        it('provider should have API', ngInject(function() {
            expect(api).toBeObject();
        }));

        it('API should have [verifyPassword] method', ngInject(function() {
            expect(api.verifyPassword).toBeFunction();
        }));

        it('API should have [verifyUsername] method', ngInject(function() {
            expect(api.verifyUsername).toBeFunction();
        }));

        it('API should have [sendEmailCode] method', ngInject(function() {
            expect(api.sendEmailCode).toBeFunction();
        }));

        it('API should have [sendPhoneCode] method', ngInject(function() {
            expect(api.sendPhoneCode).toBeFunction();
        }));

        it('API should have [verifyEmailCode] method', ngInject(function() {
            expect(api.verifyEmailCode).toBeFunction();
        }));

        it('API should have [verifyPhoneCode] method', ngInject(function() {
            expect(api.verifyPhoneCode).toBeFunction();
        }));
        
        it('API should have [enrollUser] method', ngInject(function() {
            expect(api.enrollUser).toBeFunction();
        }));
    });

    /*----------------------------------------------------------------*/
    /* Util Module
    /*----------------------------------------------------------------*/
    describe('Util Enrollment', function() {
        
        it('Utils should be an object', function() {
            expect(utils).toBeObject();
        });

        it('Mask test #1', function() {
            expect(utils.maskStringMaker()('123456')).toBe('***456');
        });

        it('Mask test #2', function() {
            expect(utils.maskStringMaker()('123')).toBe('123');
        });

        it('Mask test #3', function() {
            expect(utils.maskStringMaker('text', 2, 'x')('123456')).toBe('xxxx56');
        });

        it('ISO date test #1', function() {
            expect(utils.getISODate('11/20/2001', 'mm/dd/yyyy')).toBe('2001-11-20');
        });

        it('ISO date test #2', function() {
            expect(utils.getISODate('20.11.2001', 'dd.mm.yyyy')).toBe('2001-11-20');
        });

        it('ISO date test #3', function() {
            expect(utils.getISODate('20-11-2001', 'dd-mm-yyyy')).toBe('2001-11-20');
        });
        
        it('getByName test', function() {
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
            expect(utils.getByName('two', obj)).toBeObject();
            expect(utils.getByName('two', obj).id).toBe('2');
        });

        it('getSpecifiedValues test', function() {
            var obj = {
                one: [{
                    id: '1',
                    name: 'one1',
                    value: '111'
                }],
                two: [{
                    id: '2',
                    name: 'two2',
                    value: '222'
                }],
                three: [{
                    id: '3',
                    name: 'three3',
                    mirror: 'one',
                    value: '333'
                }]
            };
            var res = utils.getSpecifiedValues(obj, ['two2', 'three3']);
            expect(res.one1).toBe(undefined);
            expect(res.two2).toBe('222');
            expect(res.three3).toBe('333');
        });
    });

});
