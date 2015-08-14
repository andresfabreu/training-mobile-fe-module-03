/**
 * Controllers
 * @module controllers
 */
define(function(require, exports) {

    'use strict';

    // @ngInject
    exports.CategorySpendingsChartCtrl = function($scope, $q, CategorySpendingsResource, CategoriesResource, lpCoreBus, lpCoreUtils) {
        var bus = lpCoreBus;
        var utils = lpCoreUtils;

        $scope.accountId = null;
        $scope.fromDate = null;
        $scope.toDate = null;

        $scope.viewLoading = true;
        $scope.missingData = false;
        $scope.showChart = false;

        $scope.$watchCollection('[viewLoading,missingData]', function(newVals, oldVals) {
            var viewLoading = newVals[0];
            var missingData = newVals[1];
            $scope.showChart = !viewLoading && !missingData;
        });

        /**
         * Updates both categories and spending data, based on changed
         * query values for CategorySpendingsResource
         */
        $scope.updateData = function() {
            $q.all({
                spendings: CategorySpendingsResource.get({
                        accountIds: $scope.accountId,
                        start: $scope.fromDate,
                        end: $scope.toDate
                    }).$promise,
                categories: CategoriesResource.get().$promise
            }).then(function(result) {
                if(result.spendings.categoriesSpendings.length === 0) {
                    $scope.missingData = true;
                    $scope.viewLoading = false;
                    return;
                }

                $scope.viewLoading = false;
                $scope.missingData = false;

                bus.publish('launchpad-retail.spendingDataUpdated', {
                    spendings: result.spendings,
                    categories: result.categories
                });
            }, function(error) {
                $scope.viewLoading = false;
                $scope.missingData = true;
            });
        };

        //Listen for user account selection
        bus.subscribe('launchpad-retail.accountSelected', function(params) {
            $scope.accountId = params.accountId;
            $scope.updateData();
        });

        //Listen for user accounts data load
        bus.subscribe('launchpad-retail.accountsLoaded', function(accounts) {
            var accountIds = [];

            utils.forEach(accounts, function(account) {
                accountIds.push(account.id);
            });

            $scope.accountId = accountIds.join(',');
            $scope.updateData();
        });

        //Listen for transaction filtering by date
        bus.subscribe('launchpad-retail.transactionsDateSearch', function(params) {
            $scope.fromDate = params.fromDate;
            $scope.toDate = params.toDate;
            $scope.updateData();
        });
    };
});
