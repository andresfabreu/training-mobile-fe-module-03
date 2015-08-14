define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.ExternalAccountsController = function($scope, lpWidget, $timeout, FinancialInstituteModel, i18nUtils, lpCoreUtils, lpCoreBus) {
        var initialize = function () {
            //NB!!! fi = financial institute
            $scope.fiModel = FinancialInstituteModel.getInstance({
                financialInstitutesEndpoint: lpWidget.getPreference('financialInstitutionsSrc'),
                membershipRequestsEndpoint: lpWidget.getPreference('membershipRequestsSrc')
            });

            $scope.partialsDir = lpCoreUtils.getWidgetBaseUrl(lpWidget) + '/partials/';

            $scope.increment = parseInt(lpWidget.getPreference('amountToLoad'), 10) || 5;
            $scope.searchIndex = 1;

            $scope.typeFilters = {
                'all': {
                    label: 'All',
                    code: '',
                    selected: true
                },
                'loan': {
                    label: 'Loans',
                    code: 'LOAN',
                    selected: false
                },
                'credit-cards': {
                    label: 'Credit Cards',
                    code: 'CREDIT_CARD',
                    selected: false
                },
                'checking': {
                    label: 'Checking/Savings',
                    code: 'CHECKING,SAVINGS',
                    selected: false
                }
            };

            $scope.search = {
                name: '',
                typeFilter: ''
            };

            $scope.contextLabel = 'All';

            i18nUtils.loadMessages(lpWidget, $scope.locale).success(function(bundle) {
                $scope.messages = bundle.messages;
            });

            //load initial list with empty search
            $scope.fiModel.isConnecting = true;
            $scope.fiModel.searchFinancialInstitutes({
                f: $scope.searchIndex,
                l: $scope.increment,
                name: '',
                accountTypes: []
            }).then(function() {
                //increment the searchIndex for next load
                $scope.searchIndex = $scope.searchIndex + $scope.increment;
            })['finally'](function() {
                $scope.fiModel.isConnecting = false;
            });
        };

        $scope.restartWizard = function() {

            $scope.reset();
            $scope.goToWizardStep(1);
        };

        $scope.reset = function() {

            $scope.fiModel.isConnecting = false;
            $scope.fiModel.selectedMembership = {};
            $scope.fiModel.clearErrors();
            $scope.fiModel.clearWarnings();
        };

        $scope.loadAccounts = function() {
            $scope.reset();
            $timeout(function() {
                //$scope.fiModel.selected.isConnecting = false;
            }, 2000);

        };

        $scope.close = function() {

            lpCoreBus.publish('launchpad-retail.closeActivePanel');
        };

        initialize();

    };

    // @ngInject
    exports.FinancialInstitutionListController = function($scope, $element, $timeout, lpCoreUtils) {

        $scope.noMoreFIs = false;

        /**
         * Sets the passed financial institute as the currently selected one
         * @param fi
         */
        $scope.selectFI = function(fi, $event) {

            if($event.which === 13 || $event.type === 'click') {

                $scope.fiModel.setSelected(fi);
                $scope.fiModel.isConnecting = true;

                var promise = $scope.fiModel.getRequiredCredentials();

                promise.then(function (response) {

                    var credential;
                    for (var i = 0; i < $scope.fiModel.selected.requiredUserCredentials.length; i++) {
                        credential = $scope.fiModel.selected.requiredUserCredentials[i];
                        credential.fieldValue = '';
                    }
                    $scope.fiModel.isConnecting = false;
                    $scope.wizardNextStep();
                }, function () {

                    $scope.fiModel.isConnecting = false;
                });

            }

        };

        $scope.searchForFinancialInstitute = function(loadMore) {

            $scope.fiModel.isConnecting = true;

             return $scope.fiModel.searchFinancialInstitutes({
                f: $scope.searchIndex,
                l: $scope.increment,
                name: $scope.search.name,
                accountTypes: $scope.search.typeFilter
            }, loadMore).then(function(response) {

                $scope.fiModel.isConnecting = false;
                //if the response is smaller than increment then there aren't any results left
                if(response.length < $scope.increment) {
                    $scope.noMoreFIs = true;
                } else {
                    $scope.searchIndex = $scope.searchIndex + $scope.increment;
                }
            }, function() {

                $scope.fiModel.isConnecting = false;
            });

        };

        $scope.resetSearchIndex = function() {

            $scope.searchIndex = 1;
            $scope.noMoreFIs = false;
        };

        $scope.searchForFIByKeyword = lpCoreUtils.debounce(function() {
            $scope.resetSearchIndex();
            $scope.searchForFinancialInstitute();
        }, 500);


        /**
         * Function to prevent default action on enter key pressed
         * fixes ie10 issue (LPES-2861)
         * @param  {object} $event angular key event
         */
        $scope.disableEnterSubmit = function($event) {
            if($event && $event.which === 13) {
                $event.preventDefault();
                return;
            }
        };

        $scope.filterFIsByType = function(type, $event) {

            if($event && $event.which !== 13) {
                return;
            }

            $scope.resetSearchIndex();
            //set the type filter and active state
            lpCoreUtils.forEach($scope.typeFilters, function(filter) {
                filter.selected = false;
            });
            $scope.search.typeFilter = $scope.typeFilters[type].code;
            $scope.typeFilters[type].selected = true;

            //set the type filter label
            $scope.contextLabel = type ? $scope.typeFilters[type].label : 'All';
            $scope.searchForFinancialInstitute();
        };

    };

    // @ngInject
    exports.CredentialsViewController = function($scope, $timeout) {

        $scope.pollCount = 0;

        $scope.authenticateWithSelectedFI = function() {

            $scope.fiModel.clearErrors();
            $scope.fiModel.isConnecting = true;

            var promise;

            //if we are re-handling auth, the membership will have already been created
            if($scope.fiModel.selectedMembership.id) {
                promise = $scope.fiModel.updateMembershipRequest($scope.fiModel.selectedMembership);
            } else {
                //create membership
                promise = $scope.fiModel.createMembershipRequest($scope.fiModel.selected);
            }

            promise.then(function(response) {

                $scope.handleAuthenticationResponse(response);
            }, function() {

                $scope.fiModel.isConnecting = false;
            });
        };

        $scope.updateRequiredCredentials = function(membership) {

            $scope.fiModel.addWarning({captionCode: 'extraAuth'});
            $scope.fiModel.selected.requiredUserCredentials = membership.credentials;
            $scope.fiModel.isConnecting = false;
        };

        $scope.pollForAuth = function(membershipId) {


            $timeout(function() {

                if($scope.pollCount < 10) {
                    var promise = $scope.fiModel.loadMembershipRequestByID(membershipId);

                    promise.then(function(membership) {
                        $scope.handleAuthenticationResponse(membership);
                        $scope.pollCount++;
                    }, function() {

                        $scope.fiModel.isConnecting = false;
                        $scope.pollCount = 0;
                    });
                } else {
                    $scope.fiModel.addError({captionCode: 'badConnection'});
                    $scope.pollCount = 0;
                }

            }, 2000);
        };

        $scope.handleAuthenticationResponse = function(data) {

            switch(data.status) {
                case 'CREATED':
                    $scope.wizardNextStep();
                    $scope.loadAccounts();
                    break;
                case 'CHALLENGE':
                    $scope.fiModel.selected.extraAuthRequired = true;
                    $scope.updateRequiredCredentials(data);
                    break;
                case 'PENDING':
                    $scope.pollForAuth(data.id);
                    break;
            }
        };

    };
});
