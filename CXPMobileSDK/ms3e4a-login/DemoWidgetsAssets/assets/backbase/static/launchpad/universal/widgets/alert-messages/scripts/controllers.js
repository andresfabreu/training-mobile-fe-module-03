/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    /**
     * MainCtrl description.
     */
    // @ngInject
    exports.MainCtrl = function($scope, $window, lpAccounts, lpAutomation, lpCoreUtils) {

        var ctrl = this;
        var initialModel = function() { return { filters: [], counterForSelectors: 0, counterForTriggers: 0, counterForActions: 0, channelSelected: []}; };

        /**
         * Go to step, defined with stepName
         *
         * @param stepName
         */
        ctrl.goTo = function(stepName) {
            $scope.currentStep = stepName;
            $scope.selectStep[$scope.currentStep] = 1;
        };

        /**
         * Hiding a step or several steps (if stepName is a comma-separated list of step names)
         *
         * @param stepName
         */
        ctrl.hideStep = function(stepsToHide) {
            if (typeof stepsToHide === 'string') {
                stepsToHide.split(',').forEach(function(step) {
                    $scope.selectStep[step] = false;
                });
            }
        };

        /**
         * Get trigger name
         *
         * @param trigger
         * @returns {AutomationModel.recipes.triggerDefinition.name|*|string}
         */
        $scope.getTriggerName = function(trigger) {
            if (!trigger || !trigger.triggerDefinition) {
                return false;
            } else {
                return trigger.triggerDefinition.name;
            }
        };

        /**
         * Helper function to know if the given number is the last step
         * of filling the form
         *
         * @param stepsArr
         * @param currentStep
         * @returns {boolean}
         */
        $scope.isCurrentStep = function(currentStep) {
            return $scope.currentStep === currentStep;
        };

        /**
         * get the form back to specified step
         *
         * @param step
         * @param stepsToHide
         */
        $scope.backStep = function(step, stepsToHide) {
            if (step && stepsToHide) {

                // exception for selectors step
                if (step === 'chooseSelectors' && $scope.inputModel.counterForSelectors < 1) {
                    step = 'selectTrigger';
                }

                ctrl.hideStep(stepsToHide);
                ctrl.goTo(step);
            }
        };

        /**
         * Helper function to know if the given number is listed in the array
         *
         * @param stepsArr
         * @param currentStep
         * @returns {boolean}
         */
        $scope.isListedStep = function(stepsObj, currentStep) {
            return stepsObj[currentStep] === 1;
        };

        // Pre-fill initial structure
        var initialize = function() {
            $scope.locale = lpAutomation.getAttribute('locale');
            $scope.title = lpAutomation.getAttribute('title');
            $scope.currencySymbol = $scope.locale === 'en-US' ? '$' : '€';

            $scope.accountsModel = {};
            $scope.automationsModel = {
                automations: [],
                recipes: [],
                amountDirection: [
                    {
                        'name': 'Less than',
                        'value': 'lt'
                    },
                    {
                        'name': 'Less than or Equal',
                        'value': 'lte'
                    },
                    {
                        'name': 'Equal',
                        'value': 'eq'
                    },
                    {
                        'name': 'More than or Equal',
                        'value': 'gte'
                    },
                    {
                        'name': 'More than',
                        'value': 'gt'
                    }
                ]
            };

            // Load accounts to be used in selectors
            lpAccounts.load().then(function(accounts) {
                $scope.accountsModel.accounts = accounts;
            });

            // Get stored automations list
            lpAutomation.loadAutomations().then(function(automations) {
                $scope.automationsModel.automations = automations;
            });

            // Get recipes list
            lpAutomation.loadRecipes().then(function(recipes) {
                $scope.automationsModel.recipes = recipes;
            });

            // pre-configs
            $scope.implementedSelectors = ['accountId'];

            // Steps list (named)
            $scope.selectStep = {};
            $scope.currentStep = '';

            // Temporary model for input values
            $scope.inputModel = initialModel();

            // new automation container
            $scope.currentAutomationObject = null;
        };

        // cancel the form
        // -----------------------------------
        // here we clear the all form fields
        $scope.cancelAddingNewAutomation = function() {
            $scope.selectStep = {};
            $scope.currentStep = '';
            $scope.counterForSelectors = 0;
            $scope.accountsModel.selected = null;
            $scope.inputModel = initialModel();
            $scope.currentAutomationObject = null;
            $scope.fillingAutomationProgress = false;
            $scope.$broadcast('lpAutomationsShowList');
        };

        // Step 0: UPDATE automation
        $scope.updateAutomation = function(automation, justPrefill) {
            var inputModel = initialModel();
            var currentAutomationObject = {
                isNew: false,
                id: automation.id,
                parent: automation.parent
            };

            // PRE-FILL: get clear schemas
            var myRecipe = lpCoreUtils.clone(lpCoreUtils.find($scope.automationsModel.recipes, function(recipe) {
                return $scope.getTriggerName(recipe) === automation.trigger.id;
            }));
            var clearFilters = lpCoreUtils.clone(myRecipe.filters);

            // PRE-FILL: trigger
            currentAutomationObject.trigger = lpCoreUtils.assign(myRecipe, automation.trigger);
            ctrl.updateBackup = {
                selectedTriggerId: $scope.getTriggerName(currentAutomationObject.trigger),
                automation: lpCoreUtils.clone(automation)
            };

            // PRE-FILL: selected account (if any)
            $scope.accountsModel.selected = lpCoreUtils.find($scope.accountsModel.accounts, function(account) {
                return account.id === automation.trigger.selectors.accountId;
            });

            // PRE-FILL: filters
            lpCoreUtils.forEach(clearFilters, function(filter, index) {
                inputModel.filters[index] = {};

                lpCoreUtils.forEach(myRecipe.filters, function(f) {
                    var key = lpCoreUtils.keys(f)[0];
                    if (filter.name === key) {
                        inputModel.filters[index][key] = {};
                        inputModel.filters[index][key].value = f[key][0].value;
                        inputModel.filters[index][key].condition = lpCoreUtils.find($scope.automationsModel.amountDirection, function(dir) {
                            return dir.value === f[key][0].condition;
                        });
                    }
                });
            });
            currentAutomationObject.trigger.filters = clearFilters;

            // PRE-FILL: actions
            inputModel.channelSelected = [];
            currentAutomationObject.data = { actions: [] };
            lpCoreUtils.forEach(myRecipe.actions, function(action, index) {
                var selected = lpCoreUtils.pluck(automation.actions, 'type');
                if (lpCoreUtils.indexOf(selected, action.type) > -1) {
                    inputModel.channelSelected[index] = true;
                    currentAutomationObject.data.actions.push(lpCoreUtils.find(automation.actions, function(a) {
                        return a.type === action.type;
                    }));
                } else {
                    inputModel.channelSelected[index] = false;
                }
            });

            // PRE-FILL: if active
            inputModel.enable = automation.isActive;

            // PRE-FILL: name
            inputModel.automationName = automation.name;

            if (justPrefill) {
                // to display details we need just prefils
                return {
                    current: currentAutomationObject,
                    model: inputModel
                };
            } else {
                $scope.fillingAutomationProgress = true;
                $scope.currentAutomationObject = currentAutomationObject;
                $scope.inputModel = inputModel;
                $scope.$broadcast('lpAutomationsHideList');
                ctrl.goTo('selectTrigger');
            }
        };

        // Step 0: create NEW automation
        $scope.createAutomation = function() {
            $scope.$broadcast('lpAutomationsHideList');
            $scope.fillingAutomationProgress = true;
            $scope.currentAutomationObject = {
                isNew: true
            };

            ctrl.goTo('selectTrigger');
        };

        // Step 1: select trigger
        $scope.selectTrigger = function(trigger, clickSelected) {
            if (clickSelected) { return; }
            var newTriggerSelected = !!trigger;
            var automation = $scope.currentAutomationObject;
            trigger = trigger || automation.trigger;

            // if we select new trigger, we should clear filters, which are related to
            // previous trigger and clear selectors counter
            if (newTriggerSelected) {
                $scope.inputModel.filters = [];
                $scope.inputModel.counterForSelectors = 0;

                // restore data if we selected 'ours' trigger again
                if (!automation.isNew && ctrl.updateBackup.selectedTriggerId === $scope.getTriggerName(trigger)) {
                    $scope.updateAutomation(ctrl.updateBackup.automation);
                    return;
                }
            }

            automation.trigger = lpAutomation.normalizeTrigger(trigger);
            automation.data = automation.data || { actions: [] };
            automation.parent = automation.parent || trigger.id;
            $scope.inputModel.counterForTriggers = $scope.inputModel.counterForTriggers || 1;
            $scope.inputModel.counterForSelectors = $scope.inputModel.counterForSelectors || 0;

            // TRICK: check if we have selectors to be shown (decide to skip the 'selectors' step)
            var listOfAllowedSelectors = lpCoreUtils.intersection(lpCoreUtils.pluck(automation.trigger.selectors, 'name'), $scope.implementedSelectors);
            if (listOfAllowedSelectors.length > 0) {
                ctrl.goTo('chooseSelectors');
            } else {
                ctrl.goTo('selectFilters');
            }
        };

        // Step 2: leave Selectors
        $scope.goToFilters = function() {

            // Update: at least one selector chosen
            if (!$scope.currentAutomationObject.isNew && $scope.accountsModel.selected) {
                $scope.inputModel.counterForSelectors += 1;
            }

            ctrl.goTo('selectFilters');
        };

        // Step 2.1: select account
        $scope.selectAccount = function() {
            var automation = $scope.currentAutomationObject;
            automation.data.accountId = $scope.accountsModel.selected.id;
            $scope.inputModel.counterForSelectors += 1;
        };

        // Step 3: select filters
        $scope.selectFilterValue = function(form) {
            var automation = $scope.currentAutomationObject;

            if (form.$invalid || automation === null) {
                $scope.form3submitInvalid = true;
                return;
            } else {
                $scope.form3submitInvalid = false;
            }

            automation.data.filters = $scope.inputModel.filters;

            ctrl.goTo('selectChannel');
        };

        // Step 4: select channel
        $scope.selectChannel = function(action) {
            var automation = $scope.currentAutomationObject;
            var actions = automation.data.actions;
            var isAddedActionIndex = false;

            actions.forEach(function(act, index) {
                if (act.type === action.type) { isAddedActionIndex = index; }
            });

            // add selected action to list (if not added before)
            if (isAddedActionIndex === false) {
                automation.data.actions.push(action);
            } else {
                actions.splice(isAddedActionIndex, 1);
            }
        };

        // Step 4: go to next step
        $scope.goToTransport = function() {
            var automation = $scope.currentAutomationObject;
            var actions = automation.data.actions;

            // clear values
            if (automation.isNew) {
                actions.forEach(function(action, index) {
                    var key = lpCoreUtils.keys(action.location)[0];
                    action.location[key] = '';
                });
            }

            ctrl.goTo('selectTransport');
        };

        // Step 5: select e-mail or phone number (or another transport)
        $scope.selectLocation = function(isInvalid) {
            if (isInvalid) {
                $scope.form5submitInvalid = true;
                return;
            } else {
                $scope.form5submitInvalid = false;
            }

            ctrl.goTo('saveAutomation');
        };

        // Step 6: saving automation
        $scope.saveAutomation = function(isInvalid) {
            var automation = $scope.currentAutomationObject;

            automation.data.enabled = $scope.inputModel.enable;
            automation.data.name = $scope.inputModel.automationName;

            if (automation.isNew) {
                lpAutomation.create(automation).then(function(response) {

                    // success adding: add to list
                    if (response && response.data.id) {
                        response.result.id = response.data.id;
                        $scope.automationsModel.automations.unshift(response.result);
                    }

                    // empty current model
                    automation = null;
                });
            } else {
                lpAutomation.update(automation).then(function(result) {
                    lpCoreUtils.forEach($scope.automationsModel.automations, function(auto, i) {
                        if (auto.id === result.id) {
                            $scope.automationsModel.automations[i] = result;
                        }
                    });
                    automation = null;
                });
            }

            $scope.cancelAddingNewAutomation();
        };

        // Delete Automation
        $scope.deleteAutomation = function(id, index) {
            lpAutomation.remove(id).then(function(response) {
                $scope.automationsModel.automations.splice(index, 1);
            });
        };

        // Change status of the automation
        $scope.toggleAutomationStatus = function(automation) {
            $scope.toggleAutomationStatusHideButton = true;
            lpAutomation.toggleStatus(automation).then(function(response) {
                automation.isActive = !automation.isActive;
                $scope.toggleAutomationStatusHideButton = false;
            });
        };

        // Compose automation details object
        $scope.composeAutomationDetails = function(automation) {
            var result = [];
            var preFill = $scope.updateAutomation(automation, true);

            // trigger name
            result.push({
                label: 'Trigger name',
                value: preFill.current.trigger.name
            });

            // Selectors (account)
            var accountId = preFill.current.trigger.selectors.accountId;
            if (accountId && $scope.accountsModel.selected) {
                result.push({
                    label: 'Account selected',
                    value: $scope.accountsModel.selected.alias + ' (' + $scope.accountsModel.selected.identifier + ')'
                });
            }

            // Filters
            var filtersLayout = preFill.current.trigger.filters;
            var filtersData = preFill.model.filters;
            filtersLayout.forEach(function(fl) {
                var fName = fl.name;
                filtersData.forEach(function(fd) {
                    if (fd[fName]) {
                        var cond = fd[fName].condition && accountId ? fd[fName].condition : '';
                        var val = fd[fName].value ? fd[fName].value : '';

                        if (val) {
                            result.push({
                                label: fl.label || 'Filter',
                                value: (cond.name ? cond.name : cond) + ' ' + val
                            });
                        }
                    }
                });
            });

            // Actions
            var actions = preFill.current.data.actions;
            actions.forEach(function(a) {
                result.push({
                    label: 'Action ' + a.type,
                    value: lpCoreUtils.values(a.location)[0]
                });
            });

            return result;
        };

        initialize();
    };
});
