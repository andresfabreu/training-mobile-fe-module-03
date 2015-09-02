define(function(require, exports, module) {
    'use strict';

    var $ = window.jQuery;
    var base = require('base');
    var lpUIUtils = base.inject('lpUIUtils', require('ui').name);

    // @ngInject
    exports.usAccountInput = function($templateCache, $timeout, $filter, transferTypes) {

        $templateCache.put('$usTransferCountryDropdownOption.html',
            '<span aria-label="{{option.country_name}}">{{option.country_code}}<span class="country-name"> - {{option.country_name}}</span></span>'
        );

        $templateCache.put("$usAccountInputTemplate.html", '<div class="lp-us-account-input">' +
            '<div ng-class="{\'has-success\': isRoutingNoValid && routingNumber.length > 0, \'has-error\': !isRoutingNoValid && routingNumber.length, \'has-feedback\': routingNumber.length}">' +
                '<input type="input" class="form-control routing-number" ng-model="routingNumber" lp-number-input="lp-number-input" min="0" maxlength="9" placeholder="{{\'Routing Number\'|translate}}" aria-required="true" aria-label="{{\'Routing Number\'|translate}}" />' +
                '<span ng-if="isRoutingNoValid && routingNumber.length" class="glyphicon glyphicon-ok form-control-feedback"></span>' +
                '<span ng-click="resetRoutingNumber()" ng-if="!isRoutingNoValid && routingNumber.length" class="glyphicon glyphicon-remove form-control-feedback clickable-icon"></span>' +
            '</div>' +
            '<div class="lp-acc-plus-country">' +
                '<div class="country-select" ng-if="showCountryDropdown">' +
                    '<div dropdown-select="dropdown-select" class="country-select" empty-placeholder-text="US" ng-model="selectedCountry" ng-options="country.country_code as country for country in lpCountryList.countries" option-template-url="$usTransferCountryDropdownOption.html"></div>' +
                '</div>' +
                '<div ng-class="{\'has-success\': isAccNoConfirmed && accountNumber.length > 0, \'has-warning\': !isAccNoConfirmed && accountNumber.length, \'has-feedback\': accountNumber.length, \'account-number\': true}">' +
                    '<input type="input" class="form-control" ng-model="accountNumber" lp-number-input="lp-number-input" maxlength="19" min="0" placeholder="{{\'Account Number\'|translate}}" aria-required="true" aria-label="{{\'Account Number\'|translate}}"' +
                        'ng-keydown="getSelection($event)" ng-keypress="getSelection($event)" ' +
                        'ng-mousedown="getSelection($event)" ng-mouseup="getSelection($event)"' +
                        'lp-input-overflow="lp-input-overflow" lp-format-us-account="lp-format-us-account"/>' +
                    '<span ng-if="isAccNoConfirmed && accountNumber.length" class="glyphicon glyphicon-ok form-control-feedback"></span>' +
                    '<span ng-click="confirmAccountNumber()" ng-keydown="confirmKeydown($event)" tabindex="{{!isAccNoConfirmed && accountNumber.length ? 0 : -1}}" ng-if="!isAccNoConfirmed && accountNumber.length" class="glyphicon glyphicon-warning-sign form-control-feedback clickable-icon" aria-label="Confirm Account Number" role="button"></span>' +
                    '<div class="lp-input-dividers clearfix" style="top: 28px;">' +
                        '<div class="separator"></div><div class="separator"></div><div class="separator"></div><div class="separator"></div><div class="separator"></div><div class="separator"></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<span class="lp-routing-info text-muted">' +
                '<span lp-i18n="Where to find your account number & routing number"></span>' +
                '<i class="lp-icon lp-icon-xxl lp-icon-info-sign open-popup" ng-click="modal()"></i>' +
            '</span>' +
        '</div>'
        );



        return {
            restrict: 'EA',
            replace: true,
            require: ["ngModel", "^form"],
            scope: {
                "account": "=ngModel",
                "lpCountryList": "=",
                "modal": "=",
                "transferType": "=lpTransferType"
            },
            template: $templateCache.get("$usAccountInputTemplate.html"),
            link: function(scope, element, attrs, ctrls) {

                //Initial set up
                /**
                 * intialisation function
                 * @constructor
                 */
                var initialize = function() {

                    //validation flags
                    scope.isAccNoConfirmed = false;
                    scope.isRoutingNoValid = false;

                    //if a country list has been provided, show dropdown
                    scope.showCountryDropdown = scope.lpCountryList ? true : false;

                    if(scope.showCountryDropdown && scope.lpCountryList.default_country) {
                        scope.selectedCountry = scope.lpCountryList.default_country.country_code;
                    }

                    setDefaultValidation(scope.transferType || "");
                };

                //controllers
                var modelCtrl = ctrls[0], formCtrl = ctrls[1];

                modelCtrl.$name = attrs.name;
                formCtrl.$addControl(modelCtrl);

                modelCtrl.$setValidity("accountNumberRequired", false);
                modelCtrl.$setValidity("routingNumberRequired", false);

                var accountInput = element.find("input")[1],
                    textSelection = [],
                    isBackspace = false,
                    lengthDiff = 0,
                    associatedTransferType = transferTypes.bank;

                //extra element needed to track caret across input
                var $partialText = $(document.createElement('span'));
                $partialText.addClass('lp-input-cursor-position-offset');
                $partialText.css('font-size', element.css('font-size'));
                $(accountInput).after($partialText);

                //cater for changes in model from outside directive
                modelCtrl.$formatters.push(function(value) {

                    //default values for acc no and rout no
                    if(value) {
                        //if the first two characters are letters
                        if(isNaN(parseInt(value.substring(0, 2), 10))) {
                            scope.accountNumber = "";
                            scope.routingNumber = "";
                        } else {
                            var tempArray = value.split(" ");
                            scope.routingNumber = tempArray[0];
                            scope.accountNumber = $filter('addSeperator')(tempArray[1]);
                            validateRoutingNumber(scope.routingNumber);
                            setAccountValidity(scope.accountNumber);
                        }
                    } else {
                        scope.accountNumber = "";
                        scope.routingNumber = "";
                    }

                    return value;
                });

                modelCtrl.$parsers.push(function(value) {

                    var tempArray = value.split(" ");

                    validateRoutingNumber(tempArray[0]);
                    setAccountValidity(tempArray[1]);

                    return value;
                });

                //general scope functions
                /**
                 * Confirm the account number as correct
                 */
                scope.confirmAccountNumber = function() {
                    scope.isAccNoConfirmed = true;
                    modelCtrl.$setValidity("accountNumberConfirmed", true);
                };

                /**
                 * Calls the confirmAccountNumber function when ENTER is pressed in the confirm icon
                 * and places keyboard focus the next field.
                 */
                scope.confirmKeydown = function(event) {
                    if (event.which === 13) {
                        event.stopPropagation();
                        event.preventDefault();

                        scope.confirmAccountNumber();
                        element.find('.routing-number').focus();
                    }
                };

                /**
                 * reset the routing number
                 */
                scope.resetRoutingNumber = function() {
                    scope.routingNumber = "";
                };

                //Caret position functions
                /**
                 * Function that stores the selection start and end values
                 * @param  {event} event Either the Keyboard or the Mouse Event
                 */
                scope.getSelection = function(event) {

                    var noSeparatorSelection = function(select) {
                        var selectionDiff = 0;

                        selectionDiff += parseInt(select / 5, 10);

                        return select - selectionDiff;
                    };

                    textSelection = lpUIUtils.getSelectionPositionOfInput(accountInput, noSeparatorSelection);

                    if (event.originalEvent.toString() === '[object KeyboardEvent]') {
                        // handle backspace
                        if (event.originalEvent.which === 8 && accountInput.value.length) {
                            isBackspace = true;
                        }
                    }
                };

                /**
                 * Set the correct cursor position after adding the separator
                 */
                scope.setCursorPosition = function() {

                    var cursorPosition = lpUIUtils.getNewCaretPosition(accountInput, textSelection, lengthDiff, isBackspace);

                    isBackspace = false;

                    // add the separators to the cursor position
                    if (cursorPosition > 4) {
                        var temp = cursorPosition / 4;
                        if (parseInt(temp, 10) === temp) {
                            cursorPosition--;
                        }
                        cursorPosition += parseInt(temp, 10);
                    }

                    $timeout(function() {
                        lpUIUtils.setCaretPositionOfInput(accountInput, cursorPosition, scope.paymentReference, $partialText);
                    }, 20, false);
                };


                //Watches
                /**
                 * handle change in account number
                 */
                scope.$watch("accountNumber", function(newValue, oldValue) {

                    if(newValue === oldValue) {
                        return;
                    }

                    //require user to reconfirm account number when changed
                    scope.isAccNoConfirmed = false;

                    setModelValue();

                    scope.setCursorPosition();
                });

                /**
                 * handle change in routing number
                 */
                scope.$watch("routingNumber", function(newValue, oldValue) {

                    if(newValue === oldValue) {
                        return;
                    }

                    setModelValue();
                });

                scope.$watch("transferType", function(newValue, oldValue) {

                    if(newValue === oldValue) {
                        return;
                    }

                    setDefaultValidation(newValue);
                });

                /**
                 * listen for the reset message form the parent scope
                 */
                scope.$on("reset", function() {

                    scope.routingNumber = "";
                    scope.accountNumber = "";
                });


                //general functions
                /**
                 * Validates American routing number using below algorithm (where d is the routing number and is 0 based)
                 * 3(d0 + d3 + d6) + 7(d1 + d4 + d7) + (d2 + d5 + d8) / 10 = 0
                 * @param routingNumber the routing number to validate against
                 */
                var validateRoutingNumber = function(routingNumber) {

                    if(routingNumber.length < 9) {
                        scope.isRoutingNoValid = false;
                        setRoutingValidity(routingNumber);
                        return;
                    }

                    var result;

                    //9 0s passes validation, fix
                    if(routingNumber === "000000000") {
                        result = false;
                    } else {
                        var digitOne = parseInt(routingNumber[0], 10) + parseInt(routingNumber[3], 10) + parseInt(routingNumber[6], 10),
                            digitTwo = parseInt(routingNumber[1], 10) + parseInt(routingNumber[4], 10) + parseInt(routingNumber[7], 10),
                            digitThree = parseInt(routingNumber[2], 10) + parseInt(routingNumber[5], 10) + parseInt(routingNumber[8], 10);

                        var checkNumber = (3 * digitOne) + (7 * digitTwo) + digitThree;

                        //find the modulus of 10
                        result = checkNumber % 10;

                        result = result === 0 ? true : false;
                    }

                    scope.isRoutingNoValid = result;

                    setRoutingValidity(routingNumber);

                };

                var setRoutingValidity = function(value) {

                    var routingProvided = value.length > 0 ? true : false;
                    var invalidRoutingNumber = routingProvided && !scope.isRoutingNoValid ? false : true;

                    modelCtrl.$setValidity("routingNumberRequired", routingProvided);
                    modelCtrl.$setValidity("invalidRoutingNumber", invalidRoutingNumber);
                };

                var setAccountValidity = function(value) {

                    //set validation needed based on new value
                    var accountRequired = value && value.length > 0 ? true : false;
                    var confirmRequired = value && value.length > 0 && !scope.isAccNoConfirmed ? false : true;

                    modelCtrl.$setValidity("accountNumberRequired", accountRequired);
                    modelCtrl.$setValidity("accountNumberConfirmed", confirmRequired);
                };

                //remove the spaces and any extra special characters
                var normalize = function(value) {

                    if(value) {
                        value = value.replace(/ /g, '');
                    }

                    return value || "";
                };

                //set the model value
                var setModelValue = function() {

                    var modelValue = normalize(scope.routingNumber) + " " + normalize(scope.accountNumber);
                    modelCtrl.$setViewValue(modelValue);
                };

                var setDefaultValidation = function(value) {

                    if(value !== associatedTransferType) {
                        modelCtrl.$setValidity("accountNumberRequired", true);
                        modelCtrl.$setValidity("accountNumberConfirmed", true);
                        modelCtrl.$setValidity("routingNumberRequired", true);
                        modelCtrl.$setValidity("invalidRoutingNumber", true);
                    } else {
                        validateRoutingNumber(scope.routingNumber || "");
                        setAccountValidity(scope.accountNumber || "");
                    }
                };

                initialize();

            }
        };
    };
});
