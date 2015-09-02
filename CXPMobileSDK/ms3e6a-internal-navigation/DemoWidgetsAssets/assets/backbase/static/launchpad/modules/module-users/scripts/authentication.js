define(function (require, exports, module) {
    'use strict';

    var ERRORS = {
        MISSING_USERNAME: 'Please fill in your username',
        MISSING_PASSWORD: 'Please fill in your password',
        MISSING_OTP: 'You must provide otp code',
        CANNOT_AUTHENTICATE: 'Sorry, we could not authenticate you with these credentials',
        MAX_ATTEMPTS_EXCEEDED: 'Number of login attempts exceeded',
        ACCOUNT_BLOCKED: 'Your account has been blocked',
        NOT_FOUND: 'Resource not found',
        UNKNOWN_ERROR: 'There was an error processing your request. Contact your administrator',
        DISCONNECTED: 'Unable to connect. Please check your connection',
        FORBIDDEN: 'Access has been denied due to security reasons'
    };

    var ERROR_CODE = {
        UNKNOWN_ERROR: 'UNKNOWN_ERROR',
        NOT_FOUND: 'NOT_FOUND',
        BAD_REQUEST: 'BAD_REQUEST',
        CANNOT_AUTHENTICATE: 'CANNOT_AUTHENTICATE',
        MAX_ATTEMPTS_EXCEEDED: 'MAX_ATTEMPTS_EXCEEDED',
        DISCONNECTED: 'DISCONNECTED',
        FORBIDDEN: 'FORBIDDEN'
    };

    var STATUS = {
        INITIATED: 'Initiated',
        VERIFIED: 'Verified'
    };

    // @ngInject
    exports.lpUsersAuthentication = function(lpCoreUtils) {

        var session = {};

        var isEmptyString = function(string) {
            return !(lpCoreUtils.isString(string) && lpCoreUtils.trim(string).length);
        };

        var verifyOptions = function(options) {
            if (!lpCoreUtils.isObject(options)){
                throw new Error('Argument `options` should be an object instead ' + typeof options);
            }
        };

        var handleSuccess = function(deferred) {
            return function(response) {
                lpCoreUtils.extend(session, response.session);
                deferred.resolve(response);
            };
        };

        var unknownError = {
            code: ERROR_CODE.UNKNOWN_ERROR,
            message: ERRORS[ERROR_CODE.UNKNOWN_ERROR]
        };

        var parseError = function(response) {
            var code, message;
            var errors = response.errors;

            if (errors && errors.length) {
                code = errors[0].code;
                if (code !== ERROR_CODE.UNKNOWN_ERROR){
                    message = errors[0].message;
                }
            }

            return {
                code: code || unknownError.code,
                message: message || unknownError.message
            };
        };

        var handleError = function(deferred) {
            return function(response, code) {
                var error;

                switch(code) {
                    case 0:
                        error = {
                            code: ERROR_CODE.DISCONNECTED,
                            message: ERRORS[ERROR_CODE.DISCONNECTED]
                        };
                    break;
                    case 400:
                        error = {
                            code: ERROR_CODE.BAD_REQUEST,
                            message: response.message
                        };
                    break;
                    case 401:
                        error = {
                            code: ERROR_CODE.CANNOT_AUTHENTICATE,
                            message: ERRORS[ERROR_CODE.CANNOT_AUTHENTICATE]
                        };
                    break;
                    case 403:
                        error = {
                            code: ERROR_CODE.FORBIDDEN,
                            message: ERRORS[ERROR_CODE.FORBIDDEN]
                        };
                    break;
                    case 404:
                        error = {
                            code: ERROR_CODE.NOT_FOUND,
                            message: ERRORS[ERROR_CODE.NOT_FOUND]
                        };
                    break;
                    default:
                        error = parseError(response);
                }
                deferred.reject(error);
            };
        };

        var formHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        // @ngInject
        this.$get = function($http, $q, $window) {

            var API = {
                ERROR_CODE: ERROR_CODE
            };

            var config = {
                initiateEndPoint: '',
                otpEndPoint: '',
                serverRootPath: '',
                portalName: '',
                pageName: ''
            };

            API.getConfig = function() {
                return config;
            };

            API.setConfig = function(options) {
                config = lpCoreUtils(options).chain()
                    .mapValues(lpCoreUtils.resolvePortalPlaceholders)
                    .defaults(config)
                    .value();
                return this;
            };

            lpCoreUtils.forEach(STATUS, function(status) {
                API['is' + lpCoreUtils.capitalize(status)] = function() {
                    return session.status && (session.status.toLowerCase() === status.toLowerCase());
                };
            });

            API.initiate = function(options) {
                var deferred = $q.defer();
                var error;

                verifyOptions(options);

                if (isEmptyString(options.username)) {
                    error = ERRORS.MISSING_USERNAME;
                } else if (isEmptyString(options.password)) {
                    error = ERRORS.MISSING_PASSWORD;
                }

                if (error) {
                    deferred.reject(new Error(error));
                } else {
                    $http({
                        method: 'POST',
                        url: config.initiateEndPoint,
                        data: lpCoreUtils.buildQueryString(options),
                        headers: formHeaders
                    })
                    .success(handleSuccess(deferred))
                    .error(handleError(deferred));
                }

                return deferred.promise;
            };

            API.securityCheck = function() {
                var deferred = $q.defer();
                var options = {
                    'j_username': session.username,
                    'j_password': session.id,
                    'portal_name': config.portalName,
                    'page_name': config.pageName
                };

                $http({
                    method: 'POST',
                    url: config.serverRootPath + '/j_spring_security_check' + '?rd=' + new Date().getTime(),
                    data: lpCoreUtils.buildQueryString(options),
                    headers: formHeaders
                })
                .success(handleSuccess(deferred))
                .error(handleError(deferred));

                return deferred.promise;
            };

            API.verifyOTP = function(options) {
                var deferred = $q.defer();

                verifyOptions(options);

                if (isEmptyString(options.otpCode)) {
                    deferred.reject(new Error(ERRORS.MISSING_OTP));
                } else {
                    $http({
                        method: 'POST',
                        url: config.otpEndPoint.replace('{id}', session.id),
                        data: lpCoreUtils.buildQueryString({
                            'otp_code': options.otpCode
                        }),
                        headers: formHeaders
                    })
                    .success(handleSuccess(deferred))
                    .error(handleError(deferred));
                }

                return deferred.promise;
            };

            API.handleVerifiedResponse = function(response) {
                //TODO: why do i get a success view? how can i force a reload?
                if($window.location.protocol.indexOf('file:') === 0) {
                    response.successView = null;
                }

                if (response.successView) {
                    // Redirect
                    //TODO: paramaterize the context path
                    $window.location.replace(config.serverRootPath + response.successView);
                } else {
                    var currentLocation;
                    // Refresh
                    if($window.location.protocol.indexOf('file:') === 0) {
                        //need to strip out url to state when running on the files system
                        currentLocation =
                        $window.location.pathname.split('//')[0] + $window.location.search + $window.location.hash;
                    } else {
                        currentLocation = $window.location.href;
                    }
                    $window.location.replace(currentLocation);
                }
            };

            // Expose private vars for mocking.
            API.MOCKABLE = {
                session: session
            };

            return API;
        };
    };

    // Deprecated
    // exports.authentication = exports.lpUsersAuthentication;

});
