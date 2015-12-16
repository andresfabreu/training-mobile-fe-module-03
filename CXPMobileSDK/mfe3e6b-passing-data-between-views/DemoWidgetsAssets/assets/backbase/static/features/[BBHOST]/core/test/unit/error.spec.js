/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : core.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

var error = require('../../scripts/modules/error/main');
require('angular-mocks');
var inject = window.inject;
var module = window.module;
/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/
describe('Core::Modules::error', function() {
    var $controller, exception, CustomException;

    it('should be an object', function() {
        expect(error).toBeObject();
    });

    /*----------------------------------------------------------------*/
    /* Test controllers
    /*----------------------------------------------------------------*/
    function ThrowErrorCtrl(lpCoreError) {
        // Trigger common Error exception
        lpCoreError.throwException('Some Random Error');
    }
    // use custom exception
    function CaptureErrorCtrl(lpCoreError) {
        var someUnpredicableMethod = function() {
            exception = new CustomException('some error message!')
            lpCoreError.throwException( exception );
        };

        try{
            someUnpredicableMethod();
        } catch (e) {
            // Capture
            lpCoreError.captureException(e);
        }
    }
    /*----------------------------------------------------------------*/
    /* Main Error module
    /*----------------------------------------------------------------*/
    beforeEach(module(error.name, function($injector) {

    }));

    /*----------------------------------------------------------------*/
    /* Create spies and hooks
    /*----------------------------------------------------------------*/
    beforeEach(inject(function ( _lpCoreError_) {
        lpCoreError = _lpCoreError_;
        // create custom exception
        CustomException = lpCoreError.createException('Error');
    }));

    afterEach(inject(function () {
        CustomException = null
    }));

    /*----------------------------------------------------------------*/
    /* Test api
    /*----------------------------------------------------------------*/
    describe('lpCoreError handler', function() {
         it('should createException', inject(function($controller) {
           var eInst = new CustomException('Some error message');
            expect(CustomException).toBeFunction();
            expect(eInst.name).toBe('Error');
            expect(eInst.message).toBe('Some error message');
        }));

        it('should call throwException', inject(function($controller) {
            spyOn(lpCoreError, 'throwException');
            $controller(ThrowErrorCtrl);
            expect(lpCoreError.throwException).toHaveBeenCalledWith('Some Random Error');
        }));

        it('should call captureException', inject(function($controller) {
            spyOn(lpCoreError, 'captureException');
            $controller(CaptureErrorCtrl);
            expect(lpCoreError.captureException).toHaveBeenCalledWith(exception);
        }));

        it('should assert conditions', inject(function() {
            var assertingFn = function() { lpCoreError.assert(1 === 2, 'Assertion error message') };
            expect( assertingFn ).toThrowError('Assertion error message');
        }));

    });
});
