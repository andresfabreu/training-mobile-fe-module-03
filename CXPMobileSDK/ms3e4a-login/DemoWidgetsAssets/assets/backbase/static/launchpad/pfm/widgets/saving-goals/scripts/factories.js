define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.state = function() {
        return {
            view: 'list', // [list, editor:create, editor:update]
            accountList: [], // fetched from saving accounts endpoint
            savingGoals: [],
            editorSavingGoal: {}
        };
    };

    // @ngInject
    exports.SavingAccounts = function($resource, lpWidget, lpCoreUtils) {
        var savingAccountsDataSrc = lpCoreUtils.resolvePortalPlaceholders(
            lpWidget.getPreference('savingAccountsDataSrc')
        );

        return $resource(savingAccountsDataSrc, {});

    };

    // @ngInject
    exports.SavingGoal = function($resource, lpWidget, lpCoreUtils) {
        var savingGoalsDataSrc = lpCoreUtils.resolvePortalPlaceholders(
            lpWidget.getPreference('savingGoalsDataSrc')
        );

        var defaultHeaders = {
            'Content-Type': 'application/json'
        };

        return $resource(savingGoalsDataSrc, {savingId: '@savingId'}, {
            'query': {method: 'GET', isArray: true},
            'save': {method: 'POST', headers: defaultHeaders},
            'update': {method: 'PUT', headers: defaultHeaders}
        });
    };

    // @ngInject
    exports.SavingGoalService = function($q, $timeout, SavingGoal, lpCoreUtils) {
        var statusType = function(status) {
            return {
                'AHEAD_OF_PLAN': 'success',
                'ON_TRACK': 'success',
                'OVERDUE': 'warning'
            }[status];
        };

        var transformSaving = function(savingGoal) {
            savingGoal.saved = savingGoal.saved || 0;
            savingGoal.type = statusType(savingGoal.status);
            savingGoal.percentageSaved = Math.round(savingGoal.saved * 100 / savingGoal.amount);
            savingGoal.targetDate = Date.parse(savingGoal.targetDate);

            return savingGoal;
        };

        return {
            getAll: function() {
                var deferred = $q.defer();

                SavingGoal.query({}, function(goals) {
                    var savingGoals = lpCoreUtils.transform(goals, function(result, savingGoal) {
                        result.push(transformSaving(savingGoal));
                    });

                    deferred.resolve(savingGoals);
                }, function(error) {
                    deferred.reject('Could not load saving goals');
                });

                return deferred.promise;
            },
            create: function(savingGoal) {
                var deferred = $q.defer();
                var saving = new SavingGoal(savingGoal);

                lpCoreUtils.assign(saving, {
                    targetDate: saving.targetDate.toISOString()
                });

                saving.$save(function(resp) {
                    // Different saving goals providers might return their own ID
                    lpCoreUtils.assign(saving, { id: resp.id });
                    deferred.resolve(transformSaving(saving));
                }, function(error) {
                    deferred.reject('Could not create Saving Goal');
                });

                return deferred.promise;
            },

            update: function(savingGoal) {
                var deferred = $q.defer();

                SavingGoal.update({savingId: savingGoal.id}, savingGoal, function(resp) {
                    deferred.resolve(savingGoal);
                });

                return deferred.promise;
            },
            remove: function(id) {
                var deferred = $q.defer();

                SavingGoal.remove({savingId: id}, function(resp) {
                    deferred.resolve(true);
                });

                return deferred.promise;
            }
        };
    };
});
