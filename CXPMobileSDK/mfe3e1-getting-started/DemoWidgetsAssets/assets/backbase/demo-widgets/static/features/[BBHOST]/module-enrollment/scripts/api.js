define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpEnrollment = function() {
        var config = {
            enrollmentVerifyEndpoint: '/mock/v1/user-enrollment-validation',
            enrollmentVerifyPassword: '/mock/v1/user-enrollment/password-validation',
            enrollmentVerifyUsername: '/mock/v1/user-enrollment/username-validation',
            enrollmentSendEmailCode: '/mock/v1/user-enrollment/email-code-send',
            enrollmentSendPhoneCode: '/mock/v1/user-enrollment/phone-code-send',
            enrollmentVerifyEmailCode: '/mock/v1/user-enrollment/email-code-verification',
            enrollmentVerifyPhoneCode: '/mock/v1/user-enrollment/phone-code-verification',
            enrollmentUser: '/mock/v1/user-enrollment-orchestration',
            sessionInactivityDuration: '10'
        };

        // @ngInject
        this.$get = function($http, $q, lpCoreUtils, lpCoreError, lpCoreBus) {
            var registerDevice, deviceDnaData;

            // Do we want to register device?
            lpCoreBus.subscribe('lp-enrollment:device:register', function (flag) {
                registerDevice = flag;
            });

            // Prepare Device DNA data
            lpCoreBus.subscribe('widget-device-dna:data:ready', function (data) {
                if (lpCoreUtils.isPlainObject(data)) {
                    deviceDnaData = data;
                }
            });

            // Data object decorator (for device registering purposes)
            var decorateDataWithDeviceDna = function (params) {
                if (registerDevice === true && deviceDnaData) {
                    lpCoreUtils.assign(params, deviceDnaData);
                }
                return params;
            };

            var postData = function(endpoint, params) {
                var d = $q.defer();

                $http.post(endpoint, params)
                    .then(function(response) {
                        if (response.data) {
                            d.resolve(response.data);
                        } else {
                            d.reject('Server response is invalid!');
                        }
                    }, function (error) {
                        if (error.data && error.data['valid']) {
                            d.resolve(error.data);
                        } else {
                            d.reject(error);
                        }
                    });

                return d.promise;
            };

            function API() {

                var EnrollmentModel = function() {};

                // verify client's input (preliminary account check)
                EnrollmentModel.prototype.verifyAccount = function(params) {
                    var d = $q.defer();

                    $http.post(config.enrollmentVerifyEndpoint, params)
                        .then(function(response) {
                            if (response.data) {
                                d.resolve(response.data['valid'] === 'true' || response.data['valid'] === true);
                            } else {
                                d.reject('Server response is invalid!');
                            }
                        }, function (error) {
                            if (error.data && error.data['valid']) {
                                d.resolve(false);
                            } else {
                                d.reject(error);
                            }
                        });

                    return d.promise;
                };

                // verify client's password
                EnrollmentModel.prototype.verifyPassword = function(params) {
                    return postData(config.enrollmentVerifyPassword, params);
                };

                // verify client's username
                EnrollmentModel.prototype.verifyUsername = function(params) {
                    return postData(config.enrollmentVerifyUsername, params);
                };

                // send code to user's EMAIL
                EnrollmentModel.prototype.sendEmailCode = function(params) {
                    return postData(config.enrollmentSendEmailCode, params);
                };

                // send code to user's PHONE
                EnrollmentModel.prototype.sendPhoneCode = function(params) {
                    if (params.phone) {
                        params['telephoneNumber'] = params.phone;
                        delete params.phone;
                    }
                    return postData(config.enrollmentSendPhoneCode, params);
                };

                // verify code, sent to user's EMAIL
                EnrollmentModel.prototype.verifyEmailCode = function(params) {
                    if (params['eMailVerificationCode']) {
                        params['code'] = params['eMailVerificationCode'];
                        delete params['eMailVerificationCode'];
                    }
                    return postData(config.enrollmentVerifyEmailCode, decorateDataWithDeviceDna(params));
                };

                // verify code, sent to user's PHONE
                EnrollmentModel.prototype.verifyPhoneCode = function(params) {
                    if (params['phoneVerificationCode']) {
                        params['code'] = params['phoneVerificationCode'];
                        delete params['phoneVerificationCode'];
                    }
                    return postData(config.enrollmentVerifyPhoneCode, decorateDataWithDeviceDna(params));
                };

                // Enroll user
                EnrollmentModel.prototype.enrollUser = function(params) {
                    if (params.phone) {
                        params['telephoneNumber'] = params.phone;
                        delete params.phone;
                    }
                    return postData(config.enrollmentUser, params);
                };

                return new EnrollmentModel();
            }

            return {
                setConfig: function(options) {
                    config = lpCoreUtils(options).chain()
                        .mapValues(lpCoreUtils.resolvePortalPlaceholders)
                        .defaults(config)
                        .value();
                    return this;
                },

                getConfig: function(prop) {
                    if (prop && lpCoreUtils.isString(prop)) {
                        return config[prop];
                    } else {
                        return config;
                    }
                },

                api: API
            };
        };
    };
});
