define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var _ = base.utils;
    var angular = base.ng;

    function savingGoalIconMap() {
        var names = [
            'car', 'college', 'computer', 'house', 'payoffloan',
            'pension', 'phone', 'rainyday', 'trip'
        ];

        return _.transform(names, function(result, name) {
            result[name] = 'icon-icons-goals_' + name;
        }, {});
    }

    function addMonthsToDate(inputDate, months) {
        var srcDate = new Date(inputDate);
        var futureDate = new Date().setMonth(srcDate.getMonth() + months);
        return new Date(futureDate);
    }

    // @ngInject
    exports.SavingGoalAppCtrl = function(lpWidget, state, SavingAccounts, lpCoreUtils) {
        var vm = this; // view model
        var partials = lpCoreUtils.getWidgetBaseUrl(lpWidget) + '/partials';

        vm.state = state;

        SavingAccounts.query(function(accounts) {
            vm.state.accountList = accounts;
        });

        vm.templates = {
            editor: partials + '/savingGoalEditor.html',
            list: partials + '/savingGoalList.html'
        };
    };

    // @ngInject
    exports.SavingGoalListCtrl = function(state, SavingGoalService) {
        var vm = this; // view model

        vm.state = state;
        vm.iconMap = savingGoalIconMap();

        vm.fetchSavingGoalList = function() {
            vm.loading = true;
            vm.error = false;

            SavingGoalService.getAll().then(function(savingGoals) {
                vm.state.savingGoals = vm.state.savingGoals.concat(savingGoals);
                vm.loading = false;
            }, function(reason) {
                vm.loading = false;
                vm.error = true;
            });
        };

        vm.fetchSavingGoalList();

        vm.addSavingGoal = function() {
            window.scroll(0, 0);
            vm.state.view = 'editor:create';
            vm.state.editorSavingGoal = {};
        };

        vm.updateSavingGoal = function(savingGoal) {
            vm.state.view = 'editor:update';
            vm.state.editorSavingGoal = savingGoal;
        };
    };

    // @ngInject
    exports.SavingGoalEditorCtrl = function($scope, state, lpWidget, SavingGoalService) {
        var vm = this; // view model
        vm.state = state;
        vm.loading = false;
        vm.iconMap = savingGoalIconMap();
        vm.showAccountSelect = lpWidget.getPreference('showAccountSelect');

        var cfgMinMonths = parseInt(lpWidget.getPreference('minMonths'), 10) || 1;
        var cfgMinTargetDate = addMonthsToDate(new Date(), cfgMinMonths);
        vm.showTargetDateCalendar = false;

        $scope.$watch(function() { return vm.state.editorSavingGoal; }, function(newVal, oldVar) {
            vm.savingGoal = angular.copy(newVal);

            if(vm.state.view === 'editor:create') {
                vm.minTargetDate = cfgMinTargetDate;
                vm.savingGoal.targetDate = vm.minTargetDate;
            } else {
                //HACK: angular-ui datepicker fails at comparing Unix time
                vm.savingGoal.targetDate = new Date(vm.savingGoal.targetDate);
                vm.minTargetDate = vm.savingGoal.targetDate;
            }
        });

        vm.create = function(savingGoal) {
            $scope.goalForm.title.$setValidity('duplicate', !_.isObject(
                _.find(vm.state.savingGoals, function(goal) {
                    return goal.title === savingGoal.title;
                })
            ));

            if($scope.goalForm.$invalid) {
                $scope.goalForm.$setDirty();
                return;
            }

            vm.loading = true;

            SavingGoalService.create(savingGoal).then(function(createdSavingGoal) {
                vm.loading = false;
                vm.state.savingGoals.push(createdSavingGoal);
                vm.state.view = 'list';
            }, function(reason) {
                vm.loading = false;
            });
        };

        vm.update = function(savingGoal) {
            SavingGoalService.update(savingGoal).then(function(updatedSavingGoal) {
                angular.copy(vm.savingGoal, vm.state.editorSavingGoal);
            });

            $scope.goalForm.$setPristine();
            vm.state.view = 'list';
        };

        vm.remove = function(savingGoalId) {
            SavingGoalService.remove(savingGoalId).then(function() {
                vm.state.savingGoals = _.without(vm.state.savingGoals, vm.state.editorSavingGoal);
                vm.state.view = 'list';
            });

            $scope.goalForm.$setPristine();
        };

        vm.cancel = function() {
            $scope.goalForm.$setPristine();
            vm.state.view = 'list';
        };


        vm.openCalendar = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.showTargetDateCalendar = true;
        };
    };
});
