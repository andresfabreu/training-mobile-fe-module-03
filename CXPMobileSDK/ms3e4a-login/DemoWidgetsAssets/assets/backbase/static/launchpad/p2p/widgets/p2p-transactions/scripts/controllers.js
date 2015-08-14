define(function(require, exports, module) {
    'use strict';

    // Helper function
    function applyScope($scope) {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    // @ngInject
    exports.P2PTransactionsController = function($scope, $element, $timeout, lpWidget, P2PService, P2PTransactionsModel, lpCoreBus, lpCoreUtils) {
        var bus = lpCoreBus;
        var initializeP2PTransactions = function(accountId) {
            var params = {
                transactionsEndpoint: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('transactionsDataSrc')),
                transactionMessagesEndpoint: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('messageSrc')),
                pageSize: 10,
                locale: $scope.locale
            };

            $scope.transactionsModel = P2PTransactionsModel.getInstance(params);
            // loadTransactions parameter is an array to later support aggregated view
            $scope.transactionsModel.loadTransactions([accountId]).then(function(response) {
                applyScope($scope);
            });
        };

        var initialize = function() {

            $scope.locale = lpWidget.getPreference('locale');
            $scope.title = lpWidget.getPreference('title');

            $scope.userEnrolledForP2P = false;

            P2PService.getUserEnrollmentDetails().then(function(response) {
                $scope.userEnrolledForP2P = true;
                initializeP2PTransactions(response.data.accountId);
            }, function(response) {
                if (response.status === 404) {
                    //user not enrolled
                    $scope.userEnrolledForP2P = false;
                }
            });

        };



        $scope.loadMoreTransactions = function() {
            if ($scope.transactionsModel.allowMoreResults()) {
                $scope.transactionsModel.loadMoreTransactions();
            }
        };

        $scope.transferMoney = function() {
            bus.publish('launchpad-retail.requestMoneyTransfer');

            bus.publish('launchpad-retail.requestMoneyTransfer.setTab', {
                tab: 'P2P_EMAIL'
            });

        };

        $scope.enroll = function() {
            bus.publish('launchpad-retail.openP2PEnrollment');
        };

        bus.subscribe('launchpad-retail.p2pTransactions.newTransferSubmitted', function() {
            // For demo purposes adding a 3 sec delay
            $timeout(function() {
                $scope.transactionsModel.clearTransactionsList();
                $scope.transactionsModel.loadMoreTransactions();
            }, 3000);
        });

        initialize();
    };
});
