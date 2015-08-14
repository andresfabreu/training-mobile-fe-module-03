define(function(require, exports, module) {
    'use strict';

    var $ = window.jQuery;
    var angular = require('base').ng;

    // @ngInject
    exports.BudgetsController = function($scope, lpWidget, i18nUtils, BudgetsManager, SharedData, Budget, AccountsResource, CategoriesResource, $timeout, Gridly, AlertsManager, lpCoreUtils, lpCoreBus) {
        $scope.shared = SharedData;
        $scope.partialsDir = lpCoreUtils.getWidgetBaseUrl(lpWidget) + '/partials'; // Used for template includes
        $scope.alerts = AlertsManager;
        $scope.budgetsManager = BudgetsManager;

        AccountsResource.get(function(data) {
            var accounts = {};
            lpCoreUtils.forEach(data, function(value, key) {
                accounts[value.id] = value;
            });
            $scope.load();
            SharedData.accountIds = accounts;
        }, function(error) {
            AlertsManager.push('danger', 'noBankAccounts');
        });

        $scope.load = function(accountIds) {
            BudgetsManager.loadAll(accountIds);
        };

        $scope.toggleEditMode = function() {
            this.shared.budgetEditMode = !this.shared.budgetEditMode;
            lpCoreBus.publish('launchpad-retail.budgets.closeBudgetEditing');
        };

        this.loadCategories = function() {
            new CategoriesResource({ accountIds: [SharedData.selectedAccountId] }).get(
                function(data) {
                    SharedData.categories = data;
                }, function(error) {
                    AlertsManager.push('danger', 'noCategories');
                    SharedData.categories = [];
                });
        };

        // Listen to account selection change events
        lpCoreBus.subscribe('launchpad-retail.accountSelected', function(params) {
            $scope.shared.selectedAccountId = params.accountId;
            $scope.budgetsManager.budgetTemplate.accountIds = params.accountId;
            $scope.load(params.accountId);
        });

        this.loadCategories();

        Gridly.init();

        // Since SpringBoard does not support lazyloading this is needed to adjust
        // Gridly width size
        var springboardWidth = $('.lp-springboard-container').width();
        if (springboardWidth !== null) {
            $('.gridly').width(springboardWidth);
            $('.gridly').resize();
        }

    };

    // @ngInject
    exports.BudgetEditController = function($scope, $timeout, $q, BudgetsManager, SharedData, lpCoreUtils) {

        $scope.budgetImages = ['shopping', 'food', 'coffee', 'house', 'car', 'drinks', 'phone', 'bag', 'trip'];

        $scope.init = function() {
            $scope.goToWizardStep(1);
            $scope.form = angular.copy($scope.budget);
            $scope.categories = angular.copy(SharedData.categories);
            $scope.error = false;
            if (SharedData.selectedAccountId !== null) {
                $scope.form.accountIds = [SharedData.selectedAccountId];
            }
        };

        /* Wizard navigation */
        $scope.next = function(event) {
            if ($scope.getActiveWizardStep() === 1) {
                if ($scope.form.categoryIds.length === 0) {
                    $scope.error = true;
                } else {
                    $scope.error = false;
                    $scope.wizardNextStep();
                    $timeout(function() {
                        $('#amount').focus();
                    }, 0);

                }
            } else if($scope.getActiveWizardStep() === 2) {
                if ($scope.form.amount === undefined ||
                    $scope.form.amount === null ||
                    $scope.form.amount === 0) {
                    $scope.error = true;
                } else {
                    $scope.error = false;
                    $scope.wizardNextStep();
                    $timeout(function() {
                        $('#name').focus();
                    }, 0);

                }
            } else if($scope.getActiveWizardStep() === 3) {
                if ($scope.form.name === undefined ||
                    $scope.form.name === null ||
                    $scope.form.name === '') {
                    $scope.error = true;
                } else {
                    $scope.error = false;
                    $scope.save(event);
                }
            }
        };

        $scope.back = function(event) {
            $scope.error = null;
            if ($scope.getActiveWizardStep() === 1) {
                $scope.close(event);
            }
            $scope.wizardPreviousStep();
        };

        $scope.save = function(event) {
            if ($scope.mode === 'new') {
                if (SharedData.selectedAccountId === null) {
                    var ids = [];
                    for (var id in SharedData.accountIds) ids.push(id);
                    $scope.form.accountIds = ids;
                } else {
                    $scope.form.accountIds = [SharedData.selectedAccountId];
                }
                BudgetsManager.createBudget($scope.form);
            } else {
                $scope.budget.processing = true;
                $q.all(BudgetsManager.updateBudget($scope.form)).then(function(){
                    $scope.budget.processing = false;
                    angular.copy($scope.form, $scope.budget);
                });
            }
            $scope.close(event);
        };

        $scope.selectCategory = function(category) {
            category.selected = !category.selected;
            if (category.selected) {
                if ($scope.form.categoryIds.length === 0) {
                    $scope.form.name = category.name;
                }
                $scope.form.categoryIds.push(category.id);
            } else {
                $scope.form.categoryIds.splice(lpCoreUtils.indexOf($scope.form.categoryIds, category.id), 1);
            }
        };

        $scope.isCategorySelected = function(category) {
            if (category.selected === undefined) {
                category.selected = lpCoreUtils.indexOf($scope.form.categoryIds, category.id) > -1;
            }
            return category.selected;
        };

        $scope.chooseImage = function(image) {
            $scope.form.image = image;
        };

        $timeout(function() { $scope.init(); }, 0);
    };
});
