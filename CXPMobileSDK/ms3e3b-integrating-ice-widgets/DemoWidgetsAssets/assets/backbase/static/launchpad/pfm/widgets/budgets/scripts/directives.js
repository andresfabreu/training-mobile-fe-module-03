define(function(require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    // @ngInject
    exports.budget = function(BudgetsManager, $timeout, SharedData, TransactionsResource, AlertsManager, widget, lpCoreUtils, lpCoreBus) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                budget: '='
            },
            templateUrl: lpCoreUtils.getWidgetBaseUrl(widget) + '/partials/budget.html',
            controller: function($scope, CategoriesResource, $q) {
                $scope.shared = SharedData;
                $scope.partialsDir = lpCoreUtils.getWidgetBaseUrl(widget) + '/partials'; // Used for template includes
                $scope.error = false;

                this.loadTransactions = function() {
                    $scope.transactions = [];
                    $scope.budget.processing = true;

                    var queryParams = {
                        accountIds: $scope.budget.accountIds.toString(),
                        categoryIds: $scope.budget.categoryIds.toString()
                    };

                    if($scope.budget.dateFrom) { queryParams.df = $scope.budget.dateFrom; }
                    if($scope.budget.dateTo) { queryParams.dt = $scope.budget.dateFrom; }

                    TransactionsResource.get(queryParams).then(
                        function(data) {
                            lpCoreUtils.forEach(data, function(value, index) {
                                var categoryColor = lpCoreUtils.result(
                                    lpCoreUtils.find(SharedData.categories, function(category) {
                                        return category.id === value.categoryId;
                                    }), 'color'
                                );

                                $scope.transactions.push({
                                    color: categoryColor,
                                    categoryId: value.categoryId,
                                    title: value.transactionType,
                                    amount: value.transactionAmount,
                                    currency: value.transactionCurrency
                                });
                            });
                            $scope.budget.processing = false;
                        }, function(error) {
                            AlertsManager.push('danger', 'budgetGetTransactionsFailed');
                            $scope.budget.processing = false;
                        }
                    );
                };

                $scope.remove = function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    BudgetsManager.removeBudget($scope.budget);
                };

                $scope.size = function() {
                    return BudgetsManager.size($scope.budget);
                };
            },
            link: function(scope, elem, attrs, controller) {
                scope.mode = scope.budget.id === 'new' ? 'new' : 'view';
                scope.currentMode = scope.mode;

                // Click on gridly tile
                $(document).on('click touchend', '.gridly .brick#' + scope.budget.id + '.closed', function(event) {
                    scope.$apply(function() {
                        scope.openBudget();
                    });
                });

                var resize = function(el) {
                    var valueX, valueY;
                    if (el.hasClass('small')) { valueX = 140; valueY = 140; }
                    if (el.hasClass('medium')) { valueX = 300; valueY = 140; }
                    if (el.hasClass('large') || el.hasClass('edit') || scope.currentMode === 'inspect') { valueX = 300; valueY = 300; }
                    el.data('width', valueX);
                    el.data('height', valueY);
                    lpCoreBus.publish('launchpad-retail.budgets.reloadBudgets');
                };

                var editBudget = function() {
                    elem.addClass('edit');
                    resize(elem);
                    $timeout(function() {
                        scope.currentMode = 'edit';
                    }, 300);
                };

                scope.openBudget = function() {
                    if ((scope.currentMode === 'view' && SharedData.budgetEditMode) ||
                        scope.currentMode === 'new') {
                        // Switch to -> Create/Update view
                        lpCoreBus.publish('launchpad-retail.budgets.closeBudgetEditing');
                        editBudget();
                    } else if (!SharedData.budgetEditMode && scope.currentMode === 'view'){
                        // Switch to -> Inspect view
                        controller.loadTransactions();
                        lpCoreBus.publish('launchpad-retail.budgets.closeBudgetEditing');
                        elem.addClass('edit');
                        scope.currentMode = 'inspect';
                        resize(elem);
                    }
                };

                scope.close = function(event) {
                    if (event !== undefined) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    var brick = $('.gridly .brick#' + scope.budget.id + '.edit');
                    if (brick !== null) {
                        scope.currentMode = scope.mode; // Reset mode to original
                        brick.removeClass('edit');
                        resize(brick);
                    }
                };

                lpCoreBus.subscribe('launchpad-retail.budgets.closeBudgetEditing', function() {
                    scope.close();
                });

            }
        };
    };

    // @ngInject
    exports.reloadBudgets = function(lpCoreBus) {
        return function(scope, element, attrs) {
            if (scope.$last) {
                lpCoreBus.publish('launchpad-retail.budgets.reloadBudgets');
            }
        };
    };

    // @ngInject
    exports.amountPicker = function($interval, widget, lpCoreUtils) {
        return {
            restrict: 'E',
            scope: { model: '=value' },
            templateUrl: lpCoreUtils.getWidgetBaseUrl(widget) + '/partials/amount-picker.html',
            link: function(scope, elem, attrs) {

                var promise;
                //TODO: change to use class and elem. find
                $(document).on('touchstart', '#increase-control', function(event) {
                    scope.increase();
                });
                $(document).on('touchend touchcancel', '#increase-control', function(event) {
                    scope.cancel();
                });

                $(document).on('touchstart', '#decrease-control', function(event) {
                    scope.decrease();
                });

                $(document).on('touchend touchcancel', '#decrease-control', function(event) {
                    scope.cancel();
                });

                scope.increase = function() {
                    if (scope.model === undefined) {
                        scope.model = 0;
                    }
                    promise = $interval(function () { scope.model = scope.model + 1; }, 50);
                };

                scope.decrease = function() {
                    promise = $interval(function () { scope.model = scope.model - 1; }, 50);
                };

                scope.cancel = function() {
                    $interval.cancel(promise);
                };
            }
        };
    };

    // @ngInject
    exports.gridClick = function() { //TODO check if still needed
        return {
            restrict: 'A',
            require: '^budget',
            scope: { gridClick: '&' },
            link: function(scope, elem, attrs, budgetCtrl) {
                elem.on('click touchend', function(event) {
                    scope.$apply(function() {
                        scope.gridClick({event: event});
                    });
                });
            }
        };
    };
});
