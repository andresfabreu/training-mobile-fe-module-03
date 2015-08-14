define(function(require, exports, module) {
    'use strict';

    var angular = require('base').ng;
    var $ = window.jQuery;

    // Data shared between controllers
    // @ngInject
    exports.SharedData = function() {
        return {
            accountIds: [],
            categories: [],
            selectedAccountId: null,
            budgetEditMode: false
        };
    };

    // @ngInject
    exports.BudgetsManager = function(BudgetsResource, Budget, SharedData, AlertsManager, lpWidget, $timeout, lpCoreUtils, lpCoreBus) {
        var loadingInd;
        var budgets;
        var budgetTemplate = new Budget({ id: 'new', categoryIds: [], accountIds: [] });

        var loading = function() {
            return loadingInd;
        };
        var getBudgets = function() {
            return budgets;
        };

        var loadBudgets = function(accountIds) {
            return new BudgetsResource({ accountIds: accountIds }).get().$promise;
        };

        var resolveCurrency = function(budget) {
            //TODO: Change to call actual base system currency
            var account = SharedData.accountIds[budget.accountIds[0]];
            if (account !== undefined) {
                return SharedData.accountIds[budget.accountIds[0]].currency;
            } else {
                return null;
            }
        };

        var size = function(budget) {
            if (budget.id === 'new') {
                return 'small';
            }
            var budgetCopy = angular.copy(budgets);
            var sortedBudgets = budgetCopy.sort(function(b1, b2) {
                return b2.amount > b1.amount ? 1 : -1;
            });
            var sortedBudgetsSize = sortedBudgets.length - 1; // remove fake ('new') budget
            var numOfLarge = Math.ceil(sortedBudgetsSize * 0.33);
            var numOfMedium = Math.ceil((sortedBudgetsSize - numOfLarge) * 0.5);
            var ids = sortedBudgets.map(function(currentBudget) {
                return currentBudget.id;
            });
            ids.splice(ids.indexOf('new'), 1);

            var budgetIndex = ids.indexOf(budget.id);
            if (budgetIndex < numOfLarge) {
                return 'large';
            } else if (budgetIndex < numOfMedium + numOfLarge) {
                return 'medium';
            } else {
                return 'small';
            }
        };

        /*
         * Add budget modifications here if need be
         */
        var postprocess = function(rawBudgets) {
            var processedBudgets = [];
            lpCoreUtils.forEach(rawBudgets, function(value, key) {
                var budget = new Budget(value);
                budget.currency = resolveCurrency(budget);
                budget.size = size(budget);
                processedBudgets.push(budget);
            });
            return processedBudgets;
        };

        var changeOrder = function(array, oldIndex, newIndex) {
            return array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
        };

        var order = function(list) {
            var savedOrder = lpWidget.getPreference('budgetOrder').split(',');

            lpCoreUtils.forEach(savedOrder, function(budgetId, index) {
                var oldIndex = list.map(function(budget) { return budget.id; } ).indexOf(budgetId);
                changeOrder(list, oldIndex, index);
            });

            return list;
        };

        var load = function(accountIds) {
            loadingInd = true;
            loadBudgets(accountIds).then(function(data) {
                budgets = data;
                budgets.push(budgetTemplate);
                budgets = postprocess(data);
                budgets = order(budgets);
                loadingInd = false;
            });
        };

        var calculateBudgetSizes = function() {
            lpCoreUtils.forEach(budgets, function(budget, key) {
                budget.size = size(budget);
            });
        };

        var create = function(formData) {
            var budget = new Budget(formData);
            new BudgetsResource().create(budget,
                function(success) {
                    budget.id = success.id;
                    budget.newItem = true;
                    budget.currency = resolveCurrency(budget);
                    budget.spent = 0;

                    // Add to budget list if created budget belongs to selected account
                    if (SharedData.selectedAccountId === null ||
                        budget.accountIds.indexOf(SharedData.selectedAccountId) !== -1) {
                            budgets.push(budget);
                            calculateBudgetSizes();
                            $('.gridly').gridly('layout');
                    }
                }, function(error) {
                    AlertsManager.push('danger', 'budgetCreationFailed');
                }
            );
        };

        var update = function(budget) {
            return new BudgetsResource().update(budget, function(success) {
                calculateBudgetSizes();
                lpCoreBus.publish('launchpad-retail.budgets.reloadBudgets');
            }, function(error) {
                AlertsManager.push('danger', 'budgetUpdateFailed');
            });
        };

        var remove = function(budget) {
            budget.processing = true;
            new BudgetsResource().remove({ budgetId: budget.id }, function(success) {
                budget.processing = false;

                var budgetIds = budgets.map(function(curentBudget) {
                    return curentBudget.id;
                });
                var index = budgetIds.indexOf(budget.id);
                if(index > -1) {
                    budgets.splice(index, 1);
                }

                calculateBudgetSizes();

                lpCoreBus.publish('launchpad-retail.budgets.reloadBudgets');
            }, function(error) {
                budget.processing = false;
                AlertsManager.push('danger', 'budgetRemoveFailed');
            });
        };

        //Public API
        return {
            loading: loading,
            budgets: getBudgets,
            budgetTemplate: budgetTemplate,
            loadAll: load,
            createBudget: create,
            updateBudget: update,
            removeBudget: remove,
            resolveCurrency: resolveCurrency,
            size: size
        };
    };

    // @ngInject
    exports.Budget = function(BudgetsResource, SharedData) {

            function Budget(data) {
                var self = this instanceof Budget ? this : new Budget(data);

                self.id = data.id;
                self.partyId = data.partyId;
                self.name = data.name;
                self.spent = data.spent;
                self.amount = data.amount;
                self.accountIds = data.accountIds;
                self.categoryIds = data.categoryIds;
                self.currency = data.currency;
                self.image = data.image;
                self.dateFrom = new Date(data.dateFrom).getTime();
                self.dateTo = new Date(data.dateTo).getTime();

                return self;
            }

            Budget.prototype.exceeds = function() {
                if (this.spent !== null && this.spent !== undefined) {
                    return this.spent > this.amount;
                }
                return false;
            };

            Budget.prototype.spentPercentage = function() {
                var spentPercentage = 0;
                if (this.spent !== null && this.spent !== undefined) {
                    spentPercentage = Math.floor(this.spent * 100 / this.amount);
                    if (spentPercentage > 100) {
                        return 100;
                    }
                }
                return spentPercentage;
            };

            return Budget;
    };

    // @ngInject
    exports.BudgetsResource = function($resource, lpWidget, lpCoreUtils) {
        return function(header){
            var endpoint = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('budgetsDataSrc'));
            return $resource(endpoint, null, {
                'get': { method: 'GET', headers: header, isArray: true },
                'create': { method: 'POST'},
                'update': { method: 'PUT', params: { budgetId: '@id' }},
                'remove': { method: 'DELETE', params: { budgetId: '@budgetId' }}
            });
        };
    };

    // @ngInject
    exports.CategoriesResource = function($resource, lpWidget, lpCoreUtils) {
        return function(header) {
            var endpoint = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('categoriesDataSrc'));
            return $resource(endpoint, null, {
                'get': { method: 'GET', headers: header, isArray: true }
            });
        };
    };

    // @ngInject
    exports.AccountsResource = function($resource, lpWidget, lpCoreUtils) {
        var endpoint = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('accountsDataSrc'));
        return $resource(endpoint, null, {
            'get': { method: 'GET', isArray: true }
        });
    };

    // @ngInject
    exports.TransactionsResource = function($http, $q, lpWidget, lpCoreUtils) {
        var endpoint = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('transactionsDataSrc'));

        return {
            get: function(queryParams) {
                var deferred = $q.defer();

                $http.get(endpoint, {params: queryParams}).success(function(data, status, headers, config) {
                    deferred.resolve(data === 'null' ? [] : data);
                }).error(function(data, status, headers, config) {
                    return [];
                });

                return deferred.promise;
            }
        };
    };
});
