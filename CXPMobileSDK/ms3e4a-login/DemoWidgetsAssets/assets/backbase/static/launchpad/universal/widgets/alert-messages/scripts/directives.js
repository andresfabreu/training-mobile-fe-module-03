/**
 * Directives
 * @module directives
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * Directive to show the 'Create New' button
     */
    // @ngInject
    exports.lpAutomationsNewButton = function($templateCache) {

        $templateCache.put('lp-automations-new-button.html',
            '<div class="lp-automations-new-button-wrapper text-right">' +
                '<button class="btn btn-primary create-new-button" ng-class="{\'disabled ng-hide\': fillingAutomationProgress, \'disabled\': !automationsModel.recipes.length}" ng-click="createAutomation()">' +
                    '<div class="create-button-text-full-view" lp-i18n="Create Alert"></div>' +
                    '<div class="create-button-text-mobile-view"><span class="glyphicon glyphicon-plus">&nbsp;</span></div>' +
                '</button>' +
            '</div>'
        );

        return {
            restrict: 'A',
            template: $templateCache.get('lp-automations-new-button.html')
        };
    };


    /**
     * Directive to show the list of saved automations
     */
    // @ngInject
    exports.lpAutomationsList = function($templateCache, $modal) {

        $templateCache.put('lp-automations-current-list.html',
            '<div class="lp-automations-list-wrapper" >' +
                '<div class="lp-automations-list-hide-show" ng-click="toggleListView()">' +
                    '<div class="main-item" lp-i18n="Toggle list" translate-values="{action: model.action}"></div>' +
                    '<div class="secondary-item glyphicon glyphicon-chevron-{{ model.direction }}"></div>' +
                '</div>' +
                '<div ng-show="model.show" ng-if="!automationsModel.automations.length" class="no-automations-stored">' +
                    '<span lp-i18n="No Automations Stored Yet..."></span><button ng-click="createAutomation()" ng-class="{\'disabled\': fillingAutomationProgress, \'disabled\': !automationsModel.recipes.length}" class="btn btn-link" lp-i18n="Create one!"></button>' +
                '</div>' +
                '<div ng-show="model.show">' +
                    '<div ng-repeat="automation in automationsModel.automations track by $index">' +
                        '<div class="row automation-row">' +
                            '<div class="col-xs-2 col-sm-2 col-md-2 cell switcher">' +
                                '<div lp-enable-disable-toggle="automation.isActive" ng-click="toggleAutomationStatus(automation)"></div>' +
                            '</div>' +
                            '<div class="col-xs-6 col-sm-6 col-md-6 cell" ng-click="(showAutomationDetails = !showAutomationDetails)">' +
                                '<div class="view-details-link" title="{{\'Click to view details\'|translate}}">{{ automation.name }}</div>' +
                            '</div>' +
                            '<div class="col-xs-2 col-sm-2 col-md-2 cell text-right">' +
                                '<div ng-click="updateAutomation(automation)" class="btn btn-info glyphicon glyphicon-pencil">' +
                                    '<div class="button-content" lp-i18n="Update"></div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="col-xs-2 col-sm-2 col-md-2 cell text-right" ng-class="{\'delete-cell\': automation.deleteQuestionOn}">' +
                                '<div lp-confirm-delete="automation.deleteQuestionOn" callback="deleteAutomation(automation.id, $index)"></div>' +
                            '</div>' +
                            '<div ng-show="automation.deleteQuestionOn || toggleAutomationStatusHideButton" class="step-overlay"></div>' +
                        '</div>' +
                        '<div ng-show="showAutomationDetails" automation-show-details="showAutomationDetails" layout="composeAutomationDetails(automation)"></div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        return {
            restrict: 'A',
            template: $templateCache.get('lp-automations-current-list.html'),
            link: function($scope) {
                $scope.model = {};
                $scope.model.action = 'hide';
                $scope.model.direction = 'up';
                $scope.model.show = true;

                $scope.hideList = function() {
                    $scope.model.action = 'show';
                    $scope.model.direction = 'down';
                    $scope.model.show = false;
                };

                $scope.showList = function() {
                    $scope.model.action = 'hide';
                    $scope.model.direction = 'up';
                    $scope.model.show = true;
                };

                $scope.toggleListView = function() {
                    if ($scope.model.action === 'hide') {
                        $scope.hideList();
                    } else {
                        $scope.showList();
                    }
                };

                $scope.$on('lpAutomationsShowList', $scope.showList);
                $scope.$on('lpAutomationsHideList', $scope.hideList);
            }
        };
    };

    // @ngInject
    exports.automationShowDetails = function($templateCache) {
        $templateCache.put('automation-show-details.html',
            '<div class="automation-show-details-wrapper">' +
                '<div class="row">' +
                    '<div ng-repeat="detail in details" class="col-xs-12 col-sm-6 col-md-6 cell">' +
                        '<label>{{ detail.label }}:</label>' +
                        '<div class="property-value">{{ detail.value }}</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        return {
            scope: {
                trigger: '=automationShowDetails',
                layout: '&',
                showAutomationDetails: '='
            },
            restrict: 'AC',
            template: $templateCache.get('automation-show-details.html'),
            link: function($scope) {
                $scope.$watch('trigger', function(value) {
                    if (value) {
                        $scope.details = $scope.layout();
                    }
                });
            }
        };
    };

    /**
     * Confirm delete button (reusable)
     *
     */
    // @ngInject
    exports.lpConfirmDelete = function($templateCache) {
        $templateCache.put('lp-confirm-delete.html',
            '<div ng-show="!trigger" title="Delete Automation" ng-click="(trigger = true)" class="btn btn-danger glyphicon glyphicon-remove">' +
                '<div class="button-content" lp-i18n="Delete"></div>' +
            '</div>' +
            '<div ng-hide="!trigger" ng-class="{\'animated bounceInRight yesNoSure\': trigger}">' +
                '<div class="btn btn-link glyphicon glyphicon-chevron-left" title="Cancel deleting" ng-click="(trigger = false)">' +
                    '<div class="button-content" lp-i18n="Cancel"></div>' +
                '</div>' +
                '<div class="btn btn-danger yesNoSure glyphicon glyphicon-trash" title="Really Delete" ng-click="callback()">' +
                    '<div class="button-content" lp-i18n="Delete!"></div>' +
                '</div>' +
            '</div>'
        );

        return {
            scope: {
                trigger: '=lpConfirmDelete',
                callback: '&'
            },
            restrict: 'AC',
            template: $templateCache.get('lp-confirm-delete.html')
        };
    };

    /**
     * ------------------------------------------------
     *   MAIN Directive to show the 'Create New' form
     * ------------------------------------------------
     */
    // @ngInject
    exports.lpCreateNewAutomation = function($templateCache) {

        $templateCache.put('lp-automations-new-form.html',
            '<div class="lp-automations-new-form-wrapper">' +
                '<div select-automation-trigger="" class="form-step"></div>' +
                '<div select-automation-selectors="" class="form-step"></div>' +
                '<div select-automation-filters="" class="form-step"></div>' +
                '<div select-automation-channel="" class="form-step"></div>' +
                '<div select-automation-transport="" class="form-step"></div>' +
                '<div automation-save="" class="form-step"></div>' +
            '</div>'
        );

        return {
            restrict: 'A',
            template: $templateCache.get('lp-automations-new-form.html')
        };
    };

    /**
     * STEP - 1: Directive to select TRIGGER
     */
    // @ngInject
    exports.selectAutomationTrigger = function($templateCache) {

        $templateCache.put('lp-automations-select-trigger.html',
            '<div ng-show="isListedStep(selectStep, \'selectTrigger\')" class="lp-automations-select-wrapper">' +
                '<h5 lp-i18n="Choose a trigger for the automation:"></h5>' +
                '<ul class="row">' +
                    '<li ng-repeat="recipe in automationsModel.recipes track by $index" class="col-xs-12 col-sm-4 col-md-3">' +
                        '<div ng-class="{\'selected\': getTriggerName(currentAutomationObject.trigger) === getTriggerName(recipe)}" class="btn btn-default btn-block btn-automation" ng-click="selectTrigger(recipe, getTriggerName(currentAutomationObject.trigger) === getTriggerName(recipe))">' +
                            '{{recipe.name}}' +
                        '</div>' +
                    '</li>' +
                '</ul>' +
                '<div ng-show="isCurrentStep(\'selectTrigger\')" class="text-right">' +
                    '<button ng-click="cancelAddingNewAutomation()" class="btn btn-link" lp-i18n="Cancel"></button>' +
                    '<button class="btn btn-primary text-right go-next" ng-click="selectTrigger()" lp-i18n="Next"></button>' +
                '</div>' +
                '<div ng-show="!isCurrentStep(\'selectTrigger\')" class="step-overlay"></div>' +
            '</div>'
        );

        return {
            restrict: 'A',
            template: $templateCache.get('lp-automations-select-trigger.html')
        };
    };

    /**
     * STEP - 2: Directive to choose SELECTORS
     */
    // @ngInject
    exports.selectAutomationSelectors = function($templateCache) {

        $templateCache.put('lp-automations-choose-selector.html',
            '<div ng-show="isListedStep(selectStep, \'chooseSelectors\')" class="lp-automations-select-wrapper">' +
                '<div ng-repeat="selector in currentAutomationObject.trigger.selectors">' +
                    '<div ng-if="selector.name === \'accountId\'">' +
                        '<div class="select-automation-selectors-account"></div>' +
                    '</div>' +
                '</div>' +
                '<div ng-show="isCurrentStep(\'chooseSelectors\')" class="text-right"><br />' +
                    '<button ng-click="cancelAddingNewAutomation()" class="btn btn-link" lp-i18n="Cancel"></button>' +
                    '<button ng-click="backStep(\'selectTrigger\', \'chooseSelectors\')" class="btn btn-link" lp-i18n="Back"></button>' +
                    '<button ng-class="{\'disabled\': inputModel.counterForSelectors === 0 && currentAutomationObject.isNew && !accountsModel.selected}" class="btn btn-primary text-right go-next" ng-click="goToFilters()" lp-i18n="Next"></button>' +
                '</div>' +
                '<div ng-show="!isCurrentStep(\'chooseSelectors\')" class="step-overlay"></div>' +
            '</div>'
        );

        return {
            restrict: 'A',
            template: $templateCache.get('lp-automations-choose-selector.html')
        };
    };


    /**
     * STEP - 2.1: Directive to choose SELECTORS:ACCOUNT
     */
    // @ngInject
    exports.selectAutomationSelectorsAccount = function($templateCache) {

        $templateCache.put('lp-automations-choose-selector-account.html',
            '<h5 lp-i18n="Select an account:"></h5>' +
            '<div class="row">' +
            '<div class="col-xs-12 col-sm-8">' +
                '<div lp-accounts-select="lp-accounts-select" designated-class="lp-normal-account-select-size" ng-model="accountsModel.selected" lp-accounts="accountsModel.accounts" name="accountId" class="lp-accounts-header" ng-change="selectAccount()"></div>' +
            '</div>'
        );

        return {
            restrict: 'AC',
            template: $templateCache.get('lp-automations-choose-selector-account.html')
        };
    };


    /**
     * STEP - 3: Directive to fill in FILTERS
     */
    // @ngInject
    exports.selectAutomationFilters = function($templateCache) {

        $templateCache.put('lp-automations-select-rule.html',
            '<div ng-show="isListedStep(selectStep, \'selectFilters\')" class="lp-automations-select-wrapper">' +
                '<form ng-submit="selectFilterValue(step3Form)" name="step3Form" novalidate>' +
                    '<div ng-repeat="filter in currentAutomationObject.trigger.filters">' +
                        '<div>' +
                            '<h5>{{filter.label}}:</h5>' +
                            '<div class="row" style="margin-bottom: 10px">' +
                                '<div ng-if="filter.type === \'amount\'">' +
                                    '<div class="select-automation-filter-amount"></div>' +
                                '</div>' +
                                '<div ng-if="filter.type === \'string\'">' +
                                    '<div class="select-automation-filter-string"></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +

                    '</div>' +
                    '<div ng-show="isCurrentStep(\'selectFilters\')" class="text-right">' +
                        '<div ng-click="cancelAddingNewAutomation()" class="btn btn-link" lp-i18n="Cancel"></div>' +
                        '<div ng-click="backStep(\'chooseSelectors\', \'selectFilters\')" class="btn btn-link" lp-i18n="Back"></div>' +
                        '<button class="btn btn-primary text-right" type="submit" lp-i18n="Next"></button>' +
                    '</div>' +
                '</form>' +
                '<div ng-show="!isCurrentStep(\'selectFilters\')" class="step-overlay"></div>' +
            '</div>'
        );

        return {
            restrict: 'A',
            template: $templateCache.get('lp-automations-select-rule.html')
        };
    };

    /**
     * STEP - 3.1: Directive to select FILTER:AMOUNT
     */
    // @ngInject
    exports.selectAutomationFilterAmount = function($templateCache) {

        $templateCache.put('lp-automations-filter-amount.html',
            '<div class="col-xs-4 col-sm-4 col-md-2">' +
                '<div dropdown-select="dropdown-select" empty-placeholder-text="More then" ng-model="inputModel.filters[$index][filter.name].condition" ng-options="val as val.name for val in automationsModel.amountDirection"></div>' +
            '</div>' +
            '<div class="col-xs-8 col-sm-8 col-md-8">' +
                '<div class="row">' +
                    '<div class="col-xs-6 col-sm-6 col-md-6">' +
                        '<input name="paymentAmount" required="required" type="number" min="1" ng-model="inputModel.filters[$index][filter.name].value" class="form-control" placeholder="{{filter.placeholder}}" />' +
                    '</div>' +
                    '<div class="col-xs-6 col-sm-6 col-md-6 currency-filter">' +
                        '<input class="form-control" placeholder="{{\'Formatted amount\'|translate}}" disabled value="{{inputModel.filters[$index][filter.name].value | currency: currencySymbol || \'€\'}}" />' +
                    '</div>' +
                '</div>' +
                '<div ng-show="step3Form.paymentAmount.$error.required === true && form3submitInvalid" class="has-error" lp-i18n="The field is required"></div>' +
                '<div ng-show="step3Form.paymentAmount.$error.number === true && form3submitInvalid" class="has-error" lp-i18n="Follow the currency format"></div>' +
                '<div ng-show="step3Form.paymentAmount.$error.min === true && form3submitInvalid" class="has-error" lp-i18n="Only positive numbers allowed"></div>' +
            '</div>'
        );

        return {
            restrict: 'AC',
            template: $templateCache.get('lp-automations-filter-amount.html')
        };
    };

    /**
     * STEP - 3.2: Directive to select FILTER:STRING
     */
        // @ngInject
    exports.selectAutomationFilterString = function($templateCache) {

        $templateCache.put('lp-automations-filter-string.html',
            '<div class="col-xs-12 col-sm-12 col-md-12">' +
                '<input name="text" required="required" type="text" ng-model="inputModel.filters[$index][filter.name].value" class="form-control" placeholder="{{filter.placeholder}}" />' +
                '<div ng-show="step3ShowErrorMessage" class="has-error" lp-i18n="The field is required"></div>' +
            '<div ng-show="step3Form.text.$error.required === true && form3submitInvalid" class="has-error" lp-i18n="The field is required"></div>' +
            '</div>'
        );

        return {
            restrict: 'AC',
            template: $templateCache.get('lp-automations-filter-string.html')
        };
    };

    /**
     * STEP - 4: Directive to select CHANNEL
     */
    // @ngInject
    exports.selectAutomationChannel = function($templateCache) {

        $templateCache.put('lp-automations-select-channel.html',
            '<div ng-show="isListedStep(selectStep, \'selectChannel\')" class="lp-automations-select-wrapper">' +
                '<h5 lp-i18n="Choose an action for the trigger:"></h5>' +
                '<ul class="row">' +
                    '<li ng-click="markChannelSelected($index)" ng-repeat="action in currentAutomationObject.trigger.actions track by $index" class="col-xs-12 col-sm-4 col-md-3">' +
                        '<div ng-class="{\'selected\': inputModel.channelSelected[$index]}" class="btn btn-default btn-block btn-automation" ng-click="selectChannel(action)">{{action.type}}</div>' +
                    '</li>' +
                '</ul>' +
                '<div ng-show="isCurrentStep(\'selectChannel\')" class="text-right">' +
                    '<button ng-click="cancelAddingNewAutomation()" class="btn btn-link" lp-i18n="Cancel"></button>' +
                    '<button ng-click="backStep(\'selectFilters\', \'selectChannel\')" class="btn btn-link" lp-i18n="Back"></button>' +
                    '<button ng-class="{\'disabled\': currentAutomationObject.data.actions.length < 1}" class="btn btn-primary" ng-click="goToTransport()" lp-i18n="Next"></button>' +
                '</div>' +
                '<div ng-show="!isCurrentStep(\'selectChannel\')" class="step-overlay"></div>' +
            '</div>'
        );

        return {
            restrict: 'A',
            template: $templateCache.get('lp-automations-select-channel.html'),
            link: function($scope) {
                $scope.markChannelSelected = function(index) {
                    if ($scope.inputModel.channelSelected[index]) {
                        $scope.inputModel.channelSelected[index] = false;
                    } else {
                        $scope.inputModel.channelSelected[index] = true;
                    }
                };
            }
        };
    };

    /**
     * STEP - 5: Directive to select TRANSPORT
     */
        // @ngInject
    exports.selectAutomationTransport = function($templateCache) {

        $templateCache.put('lp-automations-select-transport.html',
            '<div ng-show="isListedStep(selectStep, \'selectTransport\')" class="lp-automations-select-wrapper">' +
                '<form ng-submit="selectLocation(step5Form.$invalid)" name="step5Form" novalidate>' +
                    '<div ng-repeat="action in currentAutomationObject.data.actions">' +
                        '<div ng-if="action.type === \'email\'">' +
                            '<div class="select-automation-transport-email"></div>' +
                        '</div>' +
                        '<div ng-if="action.type === \'sms\'">' +
                            '<div class="select-automation-transport-phone"></div>' +
                        '</div>' +
                    '</div>' +
                    '<div ng-show="isCurrentStep(\'selectTransport\')" class="text-right">' +
                        '<div ng-click="cancelAddingNewAutomation()" class="btn btn-link" lp-i18n="Cancel"></div>' +
                        '<div ng-click="backStep(\'selectChannel\', \'selectTransport\')" class="btn btn-link" lp-i18n="Back"></div>' +
                        '<button class="btn btn-primary" type="submit" lp-i18n="Next"></button>' +
                    '</div>' +
                '</form>' +
                '<div ng-show="!isCurrentStep(\'selectTransport\')" class="step-overlay"></div>' +
            '</div>'
        );

        return {
            restrict: 'A',
            template: $templateCache.get('lp-automations-select-transport.html')
        };
    };

    /**
     * STEP - 5.1: Directive to select EMAIL
     */
    // @ngInject
    exports.selectAutomationTransportEmail = function($templateCache) {

        $templateCache.put('lp-automations-select-email.html',
            '<h5 lp-i18n="Enter recipient E-mail:"></h5>' +
            '<div class="row">' +
                '<div class="col-xs-12 col-sm-12 col-md-12">' +
                    '<input name="emailAddress" required="required" type="email" class="form-control" ng-model="action.location.emailAddress" placeholder="{{\'E-mail\'|translate}}" />' +
                    '<div ng-show="step5Form.emailAddress.$error.required === true  && form5submitInvalid" class="has-error" lp-i18n="The field is required"></div>' +
                    '<div ng-show="step5Form.emailAddress.$error.email === true  && form5submitInvalid" class="has-error" lp-i18n="The email input is invalid"></div>' +
                '</div>' +
            '</div>' +
            '<br />'
        );

        return {
            restrict: 'AC',
            template: $templateCache.get('lp-automations-select-email.html')
        };
    };

    /**
     * STEP - 5.2: Directive to select PHONE number
     */
    // @ngInject
    exports.selectAutomationTransportPhone = function($templateCache) {

        $templateCache.put('lp-automations-select-phone.html',
            '<h5 lp-i18n="Enter recipient Phone number:"></h5>' +
            '<div class="row">' +
                '<div class="col-xs-12 col-sm-12 col-md-12">' +
                    '<input name="phoneNumber" required="required" type="text" class="form-control" ng-model="action.location.phoneNumber" placeholder="{{\'Phone number\'|translate}}" />' +
                    '<div ng-show="step5Form.phoneNumber.$error.required === true && form5submitInvalid" class="has-error" lp-i18n="The field is required"></div>' +
                '</div>' +
            '</div>' +
            '<br />'
        );

        return {
            restrict: 'AC',
            template: $templateCache.get('lp-automations-select-phone.html')
        };
    };

    /**
     * STEP - 6: Directive to SAVE changes
     */
    // @ngInject
    exports.automationSave = function($templateCache) {

        $templateCache.put('lp-automations-save.html',
            '<div ng-show="isListedStep(selectStep, \'saveAutomation\')" class="lp-automations-select-wrapper">' +
                '<h5 lp-i18n="Enter a name for your automation:"></h5>' +
                '<form ng-submit="saveAutomation(step5Form.$invalid)" name="step6Form" novalidate>' +
                    '<div class="row">' +
                        '<div class="col-xs-12 col-sm-12">' +
                            '<input required="required" type="text" class="form-control" ng-model="inputModel.automationName" placeholder="{{\'Name\'|translate}}" />' +
                            '<div ng-show="step6ShowErrorMessage" class="has-error" lp-i18n="The field is empty or invalid."></div>' +
                        '</div>' +
                    '</div>' +
                    '<br />' +
                    '<div ng-show="isCurrentStep(\'saveAutomation\')" class="text-right">' +
                        '<div ng-click="cancelAddingNewAutomation()" class="btn btn-link" lp-i18n="Cancel"></div>' +
                        '<div ng-click="backStep(\'selectTransport\', \'saveAutomation\')" class="btn btn-link" lp-i18n="Back"></div>' +
                        '<button ng-class="{\'disabled\': !inputModel.automationName}" ng-show="!currentAutomationObject.isNew" class="btn btn-primary" type="submit" style="margin-right: 6px" lp-i18n="Save Changes"></button>' +
                        '<button ng-class="{\'disabled\': !inputModel.automationName}" ng-show="currentAutomationObject.isNew" class="btn btn-default" type="submit" ng-click="(inputModel.enable = false)" style="margin-right: 6px" lp-i18n="Save"></button>' +
                        '<button ng-class="{\'disabled\': !inputModel.automationName}" ng-show="currentAutomationObject.isNew" class="btn btn-primary" type="submit" ng-click="(inputModel.enable = true)" lp-i18n="Save and Enable"></button>' +
                    '</div>' +
                '</form>' +
            '</div>'
        );

        return {
            restrict: 'A',
            template: $templateCache.get('lp-automations-save.html')
        };
    };
});
