define(function (require, exports, module) {

    'use strict';

    /**
     * Angular Module & Controller
     */

    // @ngInject
    exports.P2PEnrollmentController = function ($scope, lpWidget, AccountsModel, P2PService, ProfileContactService, lpCoreBus, lpCoreUtils) {

        /**
         * Enroll the user
         */
        function doP2PEnrollment () {

            if (!$scope.options.email.valid || !$scope.terms.doesAgreeWithTerms) {
                $scope.errorOccurred = true;
                return;
            } else {
                //send request to back end
                $scope.p2pService.enrollUserForP2P({
                    email: $scope.options.email.value,
                    accountNumber: $scope.accountsModel.findById($scope.options.depositAccount.value).identifier
                }).then(function (response) {
                    //success
                    if (response.status === 201) {
                        //move to next step
                        $scope.wizardNextStep();
                        //let other widgets know the user is enrolled
                        lpCoreBus.publish('launchpad-retail.userP2PEnrolled', {
                            enrolled: true,
                            enrollment: {
                                account: $scope.accountsModel.findById($scope.options.depositAccount.value),
                                email: $scope.options.email
                            }
                        });
                    }
                }, function () {
                    $scope.errorOccurred = true;
                    $scope.enrollmentError = true;
                });
            }
        }

        function doP2PVerification () {

            $scope.p2pService.error = false;

            $scope.p2pService.verifyCode($scope.options.email.value, $scope.verification.code).then(function (response) {
                if (response.status === 200) {
                    //success
                    $scope.wizardNextStep();
                    lpCoreBus.publish('launchpad-retail.userP2PVerified', {
                        verified: true
                    });
                }
            }, function (response) {
                //error
                if (response.status === 409) {
                    $scope.errorOccurred = true;
                    $scope.verification.error = true;
                } else {
                    $scope.p2pService.error = true;
                }
            });
        }

        // Initialize
        var initialize = function () {


            P2PService.getUserEnrollmentDetails().then(function (response) {
                $scope.userEnrolled = true;
            }, function (response) {
                $scope.userEnrolled = false;

                if (response.status !== 404) {
                    $scope.errorOccurred = false;
                }
            });

            $scope.p2pService = P2PService;

            $scope.errorOccurred = false;

            /**
             * Manages enrollment form
             * @type {{email: {value: string, valid: boolean}, depositAccount: {value: string, options: Array}}}
             */
            $scope.options = {
                email: {
                    value: '',
                    valid: false
                },
                depositAccount: {
                    value: '',
                    options: []
                }
            };

            ProfileContactService.read().success(function (response) {

                $scope.options.email.value = response.emailAddress === [] ? '' : response.emailAddress;
                $scope.validateEmail($scope.options.email.value);
            });

            //initialize accounts
            $scope.accountsModel = AccountsModel;
            $scope.accountsModel.setConfig({
                accountsEndpoint: lpWidget.getPreference('accountsDataSrc')
            });

            $scope.accountsModel.load().then(function () {

                //set the options and default selection of the accounts dropdown
                $scope.options.depositAccount.options = $scope.accountsModel.accounts;
                $scope.options.depositAccount.value = $scope.accountsModel.accounts[0].id;
            });

            /**
             * manages verification of email address
             * @type {{code: string, error: boolean}}
             */
            $scope.verification = {
                code: '',
                error: false
            };

            $scope.terms = {
                doesAgreeWithTerms: false
            };
        };

        /**
         * validates email using regex and assigns it to the email error
         * @param email
         */
        $scope.validateEmail = function (email) {
            $scope.errorOccurred = false;
            $scope.options.email.valid = lpCoreUtils.isValidEmail(email);
        };

        /**
         * move to the next step
         */
        $scope.toNextStep = function (event) {

            event.preventDefault();
            event.stopPropagation();

            $scope.errorOccurred = false;

            if ($scope.getActiveWizardStep() === 1) {
                doP2PEnrollment();
            } else if ($scope.getActiveWizardStep() === 2) {
                doP2PVerification();
            } else if ($scope.getActiveWizardStep() === 3) {
                $scope.openP2PTransfers();
            }
        };

        /**
         * publish a message to open the P2P Preferences widget
         */
        $scope.openP2PTransfers = function () {
            lpCoreBus.publish('launchpad-retail.p2pEnrollmentComplete', {
                verified: true
            });

            lpCoreBus.publish('launchpad-retail.openP2PTransactions');
        };

        $scope.$watch('terms.doesAgreeWithTerms', function (newValue, oldValue) {

            if (newValue && $scope.options.email.valid) {
                $scope.errorOccurred = false;
            }
        });

        initialize();

    };

});
