define(function(require, exports, module) {

    'use strict';

    var util = window.lp && window.lp.util; // to be refactored
    var angular = require('base').ng;
    var $ = window.jQuery;

    // @ngInject
    exports.P2PService = function($http, lpWidget) {

        var enrollmentEndpoint = lpWidget.getPreference('p2pEnrollmentEndpoint');

        var editEmailEndpoint = "/emails/";

        enrollmentEndpoint = util.replaceUrlVars(enrollmentEndpoint, {
            servicesPath: util.getServicesPath()
        });

        this.emailType = {
            primary: "PRIMARY",
            secondary: "SECONDARY"
        };

        this.emailStatus = {
            verified: "VERIFIED",
            unverified: "UNVERIFIED"
        };


        this.getUserEnrollmentDetails = function() {

            return $http.get(enrollmentEndpoint, null, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;'
                }
            });
        };

        //enroll user in P2P service based on details passed
        this.enrollUserForP2P = function(value) {

            return $http.post(enrollmentEndpoint, value, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;'
                }
            });
        };


        this.editP2PEnrollment = function(data) {


            return $http.put(enrollmentEndpoint, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;'
                }
            });
        };

        //modify registered users P2P details
        this.editP2PDepositAccount = function(value) {

            var data = {
                accountNumber: value
            };

            return $http.put(enrollmentEndpoint, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;'
                }
            });
        };

        //adds a secondary P2P Email address
        this.addP2PEmailAddress = function(emailAddress) {
            var data = {
                value: emailAddress
            };

            return $http.post(enrollmentEndpoint + editEmailEndpoint, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json;'
                }
            });
        };

        //edits a specific email, primary or secondary and email value
        this.editP2PEmailAddress = function(email) {
            var data = {
                value: email.value,
                type: email.type
            };

            return $http.put(enrollmentEndpoint + editEmailEndpoint + email.id, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;'
                }
            });

        };

        //edits the address type
        this.editP2PEmailAddressType = function(email) {
            var data = {
                type: email.type
            };

            return $http.put(enrollmentEndpoint + editEmailEndpoint + email.id, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;'
                }
            });
        };

        //deletes a specified email address
        this.deleteP2PEmailAddress = function(email) {

            return $http({method: 'DELETE', url: enrollmentEndpoint + editEmailEndpoint + email.id});
        };



        this.verifyCode = function(email, code) {

            var data = {
                verification: {
                    email: email,
                    code: code
                }
            };

            return $http.put(enrollmentEndpoint, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;'
                }
            });
        };
    };
});
