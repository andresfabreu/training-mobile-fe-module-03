/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : http.spec.js
 *  Description:
 *  Module http unit testing
 *  ----------------------------------------------------------------
 */

var http = require('../../scripts/modules/http/main');

require('angular-mocks');
var inject = window.inject;
var module = window.module;

/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/

describe('Core::Modules::http ', function() {

    var httpProviderMock;

    beforeEach(module(http.name, function($httpProvider, $injector) {
        httpProviderMock = $httpProvider;

    }));

    beforeEach(inject(function(_lpCoreHttpInterceptor_) {
        lpCoreHttpInterceptor = _lpCoreHttpInterceptor_;
    }));

    var mockReq, mockRes;

    beforeEach(inject(function() {
        mockReq = {
            url: '/path/to/resource',

        };
        mockRes = {
            status: 500,
            response: { }
        };
    }));


    /*----------------------------------------------------------------*/
    /* Module
    /*----------------------------------------------------------------*/
    it('Should be an object', function() {
        expect(http).toBeObject();
    });

    /*----------------------------------------------------------------*/
    /* lpCoreHttpInterceptor
    /*----------------------------------------------------------------*/
    describe('lpCoreHttpInterceptor Tests', function() {

        it('Should be defined', function() {
            expect(lpCoreHttpInterceptor).toBeDefined();
        });

        it('should have the httpInterceptor as an interceptor', function() {
            expect(httpProviderMock.interceptors).toContain('lpCoreHttpInterceptor');
        });
    });

    /*----------------------------------------------------------------*/
    /* Request tests
    /*----------------------------------------------------------------*/
    describe('RequestInterceptor Tests', function() {
        describe('when interpolating url parameters', function() {
            var originalUrl, expectedUrl, param;

            beforeEach(inject(function() {
                originalUrl = '/path/to/service/$(id)/action';
                expectedUrl = '/path/to/service/1/action';
                param = {
                    id: 1
                };
            }));

            it('should replace parameters from data', inject(function($http, $httpBackend) {
                $httpBackend.expectGET(expectedUrl).respond(mockRes.status, mockRes.response);
                $http({
                    url: originalUrl,
                    data: param
                });
                $httpBackend.flush();
            }));

            it('should replace parameters from params', inject(function($http, $httpBackend) {
                $httpBackend.expectGET(expectedUrl).respond(mockRes.status, mockRes.response);
                $http({
                    url: originalUrl,
                    params: param
                });
                $httpBackend.flush();
            }));

            it('should replace parameters from data first', inject(function($http, $httpBackend) {
                $httpBackend.expectGET(expectedUrl + '?id=2').respond(mockRes.status, mockRes.response);
                $http({
                    url: originalUrl,
                    data: param,
                    params: {
                        id: 2
                    }
                });
                $httpBackend.flush();
            }));

            it('should remove interpolated property from data', inject(function($http, $httpBackend) {
                $httpBackend.expect('GET', expectedUrl, {}).respond(mockRes.status, mockRes.response);
                $http({
                    url: originalUrl,
                    data: param
                });
                $httpBackend.flush();
            }));

            it('should remove interpolated property from params', inject(function($http, $httpBackend) {
                $httpBackend.expectGET(expectedUrl + '?test=true').respond(mockRes.status, mockRes.response);
                $http({
                    url: originalUrl,
                    params: {
                        id: 1,
                        test: true
                    }
                });
                $httpBackend.flush();
            }));
        });
    });

    /*----------------------------------------------------------------*/
    /* Error response tests
    /*----------------------------------------------------------------*/
    describe('ErrorInterceptor Tests', function() {

        beforeEach(function() {
            lpCoreHttpInterceptor.configureNotifications({
                ignore: [mockReq.url]
            });
        });

        it('should call the error callback ', inject(function($http, $httpBackend) {

            var successCallback = jasmine.createSpy('success');
            var errorCallback = jasmine.createSpy('error');

            $httpBackend.expectGET(mockReq.url).respond(mockRes.status, mockRes.response);
            $http(mockReq).success(successCallback).error(errorCallback);
            // flush pending requests.
            $httpBackend.flush();

            expect(successCallback).not.toHaveBeenCalled();
            expect(errorCallback).toHaveBeenCalled();
        }));

        it('should return the default errors object if response is empty', inject(function($http, $httpBackend) {

            var errorCallback = jasmine.createSpy('error');
            var successCallback = jasmine.createSpy('success');
            $httpBackend.expectGET(mockReq.url).respond(mockRes.status, mockRes.response);
            $http(mockReq).success(successCallback).error(errorCallback);
            $httpBackend.flush();

            var errResponse = errorCallback.calls.argsFor(0);
            var errors = errResponse[0].errors;
            expect(errors).toBeArray();
            expect(errors[0]).toBeObject();
            expect(errors[0].code).toBe(500);
            expect(errors[0].message).toBeString();
        }));

        it('should return an array of errors if responseErr.data is string', inject(function($http, $httpBackend) {

            var errorCallback = jasmine.createSpy('error');
            var successCallback = jasmine.createSpy('success');
            $httpBackend.expectGET(mockReq.url).respond(mockRes.status,  'Some weird string output from some weird endpont');
            $http(mockReq).success(successCallback).error(errorCallback);
            $httpBackend.flush();

            var errResponse = errorCallback.calls.argsFor(0);
            var errors = errResponse[0].errors;
             expect(errors).toBeArray();
        }));

    });

    /*----------------------------------------------------------------*/
    /* Success response tests
    /*----------------------------------------------------------------*/
    xdescribe('ResponseInterceptor Tests', function() {
        // TODO
    });

    /*----------------------------------------------------------------*/
    /* Headers test
    /*----------------------------------------------------------------*/
    describe('Headers Tests', function() {
        it('should send configured headers', inject(function($http, $httpBackend) {
            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };

            $httpBackend.expectGET(mockReq.url, headers).respond(mockRes.status, mockRes.response);
            $httpBackend.expectPOST(mockReq.url, {}, headers).respond(mockRes.status, mockRes.response);
            $httpBackend.expectPUT(mockReq.url, {}, headers).respond(mockRes.status, mockRes.response);
            $httpBackend.expectDELETE(mockReq.url, headers).respond(mockRes.status, mockRes.response);
            $http(mockReq);
            $http.post(mockReq.url);
            $http.put(mockReq.url);
            $http.delete(mockReq.url);
            $httpBackend.flush();
        }));
    });
});
