/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function($scope) {
        var ctrl = this;
        ctrl.viewState = 'view.list';

        $scope.$on('a2aExternalTransfers.viewStateChange', function(event, args) {
            ctrl.viewState = args.view;
            ctrl.model = args.account;
            ctrl.errors = [];
        });

        $scope.$on('a2aExternalTransfers.errorOccured', function(event, args) {
            ctrl.errors = args.errors;
        });

    };

    // @ngInject
    exports.ListController = function($scope, ExtAccountsSharedData, ExternalAccountsModel, lpCoreUtils) {
        var ctrl = this;
        ctrl.sharedData = ExtAccountsSharedData;
        ctrl.accStatus = ExternalAccountsModel.accountStatusEnum;

        ctrl.add = function(account) {
            $scope.$emit('a2aExternalTransfers.viewStateChange',
                         { view: 'view.edit', account: new ExternalAccountsModel(account) });
        };

        ctrl.loadData = function() {
            ctrl.loading = true;
            ctrl.error = false;

            ExtAccountsSharedData.init();
            ExternalAccountsModel.getAll()
                .then(function(accounts) {
                    lpCoreUtils.forEach(accounts, function(value, key) {
                        ExtAccountsSharedData.accounts[value.group].push(value);
                    });
                }, function(error){
                    ctrl.error = true;
                })['finally'](function() {
                    ctrl.loading = false;
                });
        };

        var init = function() {
            ctrl.loadData();
        };

        init();
    };

    // @ngInject
    exports.EditController = function($scope, ExternalAccountsModel) {
        var ctrl = this;
        ctrl.model = new ExternalAccountsModel();
        ctrl.model.$categories().then(function(categories) {
            ctrl.categories = categories;
        });

        ctrl.submit = function(account) {
            ctrl.loading = true;
            ExternalAccountsModel.createOrUpdate(account).then(function(success) {
                $scope.$emit('a2aExternalTransfers.viewStateChange', { view: 'view.list' });
            }, function(error) {
                $scope.$emit('a2aExternalTransfers.errorOccured', { errors: error.data.errors });
            })['finally'](function() {
                ctrl.loading = false;
            });
        };

        ctrl.cancel = function() {
            $scope.$emit('a2aExternalTransfers.viewStateChange', { view: 'view.list' });
        };
    };

    // @ngInject
    exports.ActivationController = function($scope, ExternalAccountsModel) {
        var ctrl = this;
        ctrl.model = new ExternalAccountsModel();

        ctrl.activate = function(account) {
            ctrl.loading = true;
            ctrl.model.$activate().then(function(success) {
                $scope.$emit('a2aExternalTransfers.viewStateChange', { view: 'view.list' });
            }, function(error) {
                $scope.$emit('a2aExternalTransfers.errorOccured', { errors: error.data.errors });
            })['finally'](function() {
                ctrl.loading = false;
            });
        };

        ctrl.cancel = function() {
            $scope.$emit('a2aExternalTransfers.viewStateChange', { view: 'view.list' });
        };

    };

    // @ngInject
    exports.RemoveConfirmationCtrl = function($scope, $timeout, $modalInstance, account, ExtAccountsSharedData, ExternalAccountsModel) {
        $scope.error = { isError: false, message: ''};
        $scope.account = account;

        $scope.remove = function() {
            $modalInstance.close($scope.account);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
});
