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

widget.value('lpWidget', require('./widgetMock'));
require('angular-mocks');

var promiseMock = function(success, doneResponse, failResponse) {
    return function() {
        return {
            then: function(done, fail) {
                success ? done(doneResponse) : fail(failResponse);
                return {
                    finally: function(fin) {
                        fin();
                    }
                };
            }
        };
    };
};

/*----------------------------------------------------------------*/
/* Login Multifactor widget test suite
/*----------------------------------------------------------------*/
describe('Login Multifactor widget test suite', function() {
    /*----------------------------------------------------------------*/
    /* Main Module
    /*----------------------------------------------------------------*/
    describe('Module', function() {
        it('should have a createResource function', function() {
            expect(widget).toBeObject();
        });
    });

    /*----------------------------------------------------------------*/
    /* Controllers
    /*----------------------------------------------------------------*/
    describe('Controllers', function() {
        var createController, scope, ctrl;

        var testLoadingStates = function() {
            it('should start loading when submitting', function() {
                spyOn(scope, '$emit');
                ctrl.submit();
                expect(scope.$emit).toHaveBeenCalledWith('start-loading');
            });

            it('should stop loading after receiving an lpUsersAuthentication successful response', inject(function(lpUsersAuthentication) {
                spyOn(scope, '$emit');

                lpUsersAuthentication.setSuccess(true);
                ctrl.submit();
                expect(scope.$emit).toHaveBeenCalledWith('stop-loading');
            }));

            it('should stop loading after receiving an lpUsersAuthentication error response', inject(function(lpUsersAuthentication) {
                spyOn(scope, '$emit');

                lpUsersAuthentication.setSuccess(false);
                ctrl.submit();
                expect(scope.$emit).toHaveBeenCalledWith('stop-loading');
            }));
        };

        /*----------------------------------------------------------------*/
        /* Mock modules/Providers
        /*----------------------------------------------------------------*/
        beforeEach(window.module(widget.name, function($provide) {
            $provide.provider('loginSteps', function() {
                this.$get = function() {
                    return {
                        initialize: jasmine.createSpy('initialize'),
                        addStep: jasmine.createSpy('addStep'),
                        next: jasmine.createSpy('next'),
                        back: jasmine.createSpy('back')
                    };
                };
            });

            $provide.provider('lpUsersAuthentication', function() {

                var initiateError = {
                    code: null
                };

                this.$get = function() {
                    var config = {
                        success: true
                    };
                    return {
                        ERROR_CODE: {},
                        setSuccess: function(val) {
                            config.success = val;
                        },
                        setConfig: function() {
                            // config.success = val;
                        },
                        setErrorCode: function(code) {
                            initiateError.code = code;
                        },
                        initiate: jasmine.createSpy('initiate').and.callFake(promiseMock(config, null, initiateError)),
                        verifyOTP: jasmine.createSpy('initiate').and.callFake(promiseMock(config)),
                        isInitiated: jasmine.createSpy('isInitiated').and.callFake(function() {
                            return true;
                        }),
                        isVerified: jasmine.createSpy('isVerified')
                    };
                };
            });
        }));

        beforeEach(inject(function($controller, $rootScope) {
            scope = $rootScope.$new();
            createController = function(ctrlName) {
                return $controller(ctrlName, {
                    $scope: scope
                });
            };
        }));

        // MainCtrl
        describe('MainCtrl', function() {
            beforeEach(function(){
                ctrl = createController('MainCtrl');
            });

            it('should exists', function() {
                expect(ctrl).toBeObject();
            });

            it('should put loading state when receiving the start-loading event', function() {
                scope.$emit('start-loading');
                expect(ctrl.loading).toBeTrue();
            });

            it('should remove loading state when receiving the stop-loading event', function() {
                scope.$emit('start-loading');
                scope.$emit('stop-loading');
                expect(ctrl.loading).toBeFalse();
            });

            xit('should handle errors', inject(function($timeout) {
                var errorMessage = 'Test error';
                scope.$emit('error', { message: errorMessage });
                $timeout.flush();
                expect(ctrl.errorMessage).toEqual(errorMessage);
            }));

            xit('should clean handled errors', inject(function($timeout) {
                var errorMessage = 'Test error';
                scope.$emit('error', { message: errorMessage });
                $timeout.flush();
                scope.$emit('error-clean');
                $timeout.flush();
                expect(ctrl.errorMessage).toBeNull();
            }));
        });

        // Login Controller
        describe('LoginController', function() {
            beforeEach(function() {
                ctrl = createController('LoginCtrl');
            });

            it('should exists', function() {
                expect(ctrl).toBeObject();
            });

            it('should store login data internally', function() {
                expect(ctrl.data).toBeObject();
            });

            it('should add itself as a step', inject(function(loginSteps, STEPS) {
                expect(loginSteps.addStep).toHaveBeenCalledWith(STEPS.LOGIN, jasmine.any(Object));
            }));

            it('should not be locked', function() {
                expect(ctrl.locked).toBeFalse();
            });

            testLoadingStates();
        });

        // OTP Controller
        describe('One Time Password Controller', function() {
            beforeEach(function() {
                ctrl = createController('OtpCtrl');
                ctrl.data.otpcode = '123456';
            });

            it('should exists', function() {
                expect(ctrl).toBeObject();
            });

            it('should store login data internally', function() {
                expect(ctrl.data).toBeObject();
            });

            it('should add itself as a step', inject(function(loginSteps, STEPS) {
                expect(loginSteps.addStep).toHaveBeenCalledWith(STEPS.OTP, jasmine.any(Object));
            }));

            it('should validate that otp code is numeric', function() {
                spyOn(scope, '$emit');
                ctrl.data.otpcode = 'test';
                ctrl.submit();
                expect(scope.$emit).toHaveBeenCalledWith('error', { message: 'Code must contain only digits' });
            });

            it('should go back when canceling', inject(function(loginSteps) {
                ctrl.cancel();
                expect(loginSteps.back).toHaveBeenCalled();
            }));

            xit('should raise an error when finishing the timer', inject(function($timeout) {
                spyOn(scope, '$emit');
                ctrl.finish();
                $timeout.flush();
                expect(scope.$emit).toHaveBeenCalledWith('error', { message: 'Time has expired' });
            }));

            testLoadingStates();
        });

        // Privacy
        describe('Privacy Controller', function() {
            beforeEach(function(){
                ctrl = createController('PrivacyCtrl');
            });

            it('should exists', function() {
                expect(ctrl).toBeObject();
            });

            it('should store login data internally', function() {
                expect(ctrl.data).toBeObject();
            });

            it('should add itself as a step', inject(function(loginSteps, STEPS) {
                expect(loginSteps.addStep).toHaveBeenCalledWith(STEPS.PRIVACY, jasmine.any(Object));
            }));

            it('should go to next step on submit', inject(function(loginSteps) {
                ctrl.submit();
                expect(loginSteps.next).toHaveBeenCalled();
            }));
        });

    });
});

