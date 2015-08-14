define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.P2PPreferencesController = function($scope, $templateCache, lpCoreUtils, $timeout, lpWidget, AccountsModel, P2PService, i18nUtils, lpCoreBus) {

        var bus = lpCoreBus;
        // Initialize
        var initialize = function () {
            var partialsDir = lpCoreUtils.getWidgetBaseUrl(lpWidget) + '/templates';

            $scope.locale = lpWidget.getPreference('locale');

            //p2p service details
            $scope.p2pService = P2PService;

            $scope.p2pProvider = {
                name: 'Backbase P2P Service',
                icon: 'lp-icon-bb-logo'
            };

            $scope.p2pUserDetails = {
                depositAccount: {},
                emails: []
            };

            $scope.emailErrors = {
                messages: {
                    'invalid_email': 'Invalid Email'
                },
                errors: []
            };


            //find out whether or not the user is enrolled
            $scope.p2pService.getUserEnrollmentDetails().then(function(response) {

                //they are
                $scope.userEnrolled = true;

                //set the respective user details based on response from backend
                $scope.p2pUserDetails.depositAccount = {
                    value: response.data.accountNumber,
                    options: []
                };

                $scope.p2pUserDetails.emails = [{value: response.data.email, primary: true, verified: response.data.emailVerified}];

            }, function(response) {

                //they're not!
                bus.subscribe('launchpad-retail.userP2PEnrolled', function(data) {
                    $scope.$apply(function() {
                        $scope.userEnrolled = data.enrolled;

                        //set enrollment details
                        $scope.p2pUserDetails.depositAccount.value = data.enrollment.account.iban;
                        $scope.p2pUserDetails.emails.push({
                            value: data.enrollment.email.value,
                            primary: true,
                            verified: false
                        });
                    });
                });

                $scope.userEnrolled = false;

                if(response.status !== 404) {
                    $scope.p2pService.error = true;
                }
            });

            //initialize accounts
            $scope.accountsModel = AccountsModel;
            $scope.accountsModel.setConfig({
                accountsEndpoint: lpWidget.getPreference('accountsDataSrc')
            });

            $scope.accountsModel.load().then(function() {
                //once accounts have been loaded, apply them as options for the deposit account dropdown
                $scope.p2pUserDetails.depositAccount.options = $scope.accountsModel.accounts;
            });

            $scope.currentEmail = {};

            //object managing address verification
            $scope.verify = {
                validationError: false,
                verificationCode: '',
                modalShown: false
            };

            $scope.templates = {
                verify: partialsDir + '/verify-email.html'
            };

        };

        /**
         * Email manipulation
         */
        $scope.validateEmail = function(email) {
            //regular expression for valid email
            var result = lpCoreUtils.isValidEmail(email);

            if(!result) {
                //return specific error message
                return 'invalid_email';
            } else {
                return true;
            }
        };

        $scope.saveEmail = function(index, email) {

            if(!email.value) {
                email.value = '';
            }

            //if the email is being edited
            email.verified = false;
            $scope.p2pService.editP2PEnrollment({
                email: email.value
            });

            bus.publish('launchpad-retail.userP2PVerification.unverified');
        };


        /**
         * Set current email and open verification modal
         * @param emailAddress
         */
        $scope.beginVerification = function(emailAddress) {

            $scope.currentEmail = emailAddress;
            $scope.verify.modalShown = true;
        };

        /**
         * make a request to verify an email and handle it's response
         */
        $scope.handleEmailVerification = function() {

            //send verification request
            $scope.p2pService.verifyCode($scope.currentEmail.value, $scope.verify.verificationCode).then(function(response) {

                if(response.status === 200) {
                    //close modal, set current email status and clear validation errors
                    $scope.currentEmail.verified = true;
                    $scope.verify.modalShown = false;
                    $scope.verify.verificationCode = '';
                    $scope.verify.validationError = false;
                }
            }, function(response) {

                if(response.status === 409) {
                    //set validation error
                    $scope.verify.validationError = true;
                }
            });
        };

        /**
         * Close the verification modal
         */
        $scope.closeVerifyModal = function() {

            $scope.verify.modalShown = false;
            $scope.verify.verificationCode = '';
            $scope.verify.validationError = false;
        };

        /**
         * Account manipulation
         */

        /**
         * Save the newly selected Account
         * @param accountNo
         */
        $scope.saveAccount = function(accountNo) {

            $scope.p2pService.editP2PEnrollment({
                accountNumber: accountNo
            });
        };

        $scope.enroll = function() {
            bus.publish('launchpad-retail.openP2PEnrollment');
        };

        initialize();
    };

});
