define(function(require, exports, module) {
    'use strict';

    var $ = window.jQuery;
    var base = require('base');
    var angular = base.ng;
    var lpUIUtils = base.inject('lpUIUtils', require('ui').name);

    /**
     * TODO: Refactor this directive to not require a widget instance.
     */

    // @ngInject
    exports.lpIbanInput = function($templateCache, $timeout, IbanModel, widget) {

        $templateCache.put('$ibanCountryOptionTemplate.html',
            '<span aria-label="{{option.country_name}}">{{option.country_code}}<span class="country-name"> - {{option.country_name}}</span></span>'
        );

        return {
            restrict: 'EA',
            replace: true,
            require: ['ngModel', '^form'],
            scope: {
                ibanModel: '=lpCountryList',
                transferType: '=lpTransferType'
            },
            template:
                '<div>' +
                '<div class="lp-iban">' +
                '<div class="lp-iban-country-dropdown">' +
                '<div dropdown-select="dropdown-select" empty-placeholder-text="NL" name="ibaneDropdownField" ng-model="iban.selectedCountry" ng-options="country.country_code as country for country in ibanModel.countryList" ' +
                'filter="ibanModel.enableCountrySearch" filter-placeholder-text="Search country" ng-change="change()" ' +
                'option-template-url="$ibanCountryOptionTemplate.html" aria-label="iban country code">' +
                '</div>' +
                '</div>' +
                '<div class="lp-iban-input" ng-class="{\'has-success\': ibanModel.valid && iban.value.length, \'has-error\': !ibanModel.valid && iban.value.length,  \'has-feedback\': iban.value.length}">' +
                '<input name="ibanInputField" ng-required="transferType === \'BANK\'" type="input" class="form-control" lp-input-overflow="lp-input-overflow" ng-model="iban.value"  aria-required="true" ' +
                'ng-keydown="getSelection($event)" ng-keypress="getSelection($event)" ' +
                'ng-mousedown="getSelection($event)" ng-mouseup="getSelection($event)" ' +
                'ng-change="change()" tabindex="0" ' +
                'placeholder="Enter IBAN or Account Number" aria-label="Enter IBAN or Account Number">' +
                '<span ng-if="ibanModel.valid && iban.value.length" class="glyphicon glyphicon-ok form-control-feedback"></span>' +
                '<span ng-if="!ibanModel.valid && iban.value.length" ng-click="clear()" class="glyphicon glyphicon-remove form-control-feedback"></span>' +
                '</div>' +
                '</div>' +
                '<span class="text-muted">{{testiban}}</span>' +
                '</div>',
            link: function(scope, element, attrs, ctrls) {

                var ngModelCtrl = ctrls[0],
                    formCtrl = ctrls[1],
                    input = element.find('input')[0],
                    textSelection = [],
                    isBackspace = false,
                    lengthDiff = 0,
                    $element = $(element[0]),
                    associatedTransferType = "BANK";

                // make the country code search to be focused when using keyboard
                $element.find('div[name="ibaneDropdownField"]').on('keypress', function(e) {
                    // open dropdown after pressing Enter key
                    if (e.which === 13) {
                        $timeout(function() {
                            $element.find('input[type="search"]').focus();
                        });
                    }
                });

                scope.iban = {};

                // add control using the name attribute to the form controller to track validity
                ngModelCtrl.$name = attrs.name;
                formCtrl.$addControl(ngModelCtrl);

                scope.$watch('ibanModel.countryList', function (newValue) {
                    scope.change(true);
                    if (scope.ibanModel.countryList.length && !scope.iban.selectedCountry) {
                        scope.iban.selectedCountry = scope.ibanModel.countryList[0].country_code;
                    }
                });

                ngModelCtrl.$formatters.push(function(value) {

                    scope.ibanModel.value = value;
                    scope.iban.value = addDashes(value);

                    var country = scope.ibanModel.getCountryCode();
                    scope.ibanModel.validate();
                    if (country) {
                        scope.change(true);
                    }

                    var isValid = country ? scope.ibanModel.valid : false;

                    ngModelCtrl.$setValidity('validIban', isValid);

                    return value;
                });

                // set validity of the model value
                ngModelCtrl.$parsers.push(function(value) {
                    var isValid = scope.ibanModel.getCountryCode() ? scope.ibanModel.validate() : false;

                    doValidation(value);

                    return isValid ? value : undefined;
                });

                // Create a hidden span to calculate the cursor position in pixels
                var $partialText = $(document.createElement('span'));
                $partialText.addClass('lp-input-cursor-position-offset');
                $partialText.css('font-size', element.css('font-size'));
                $(input).after($partialText);

                //Do validation on IBAN
                var doValidation = function(newValue) {
                    if(newValue !== associatedTransferType) {
                        ngModelCtrl.$setValidity("validIban", true);
                        ngModelCtrl.$setValidity("required", true);
                    } else {
                        var isValid = scope.ibanModel.getCountryCode() ? scope.ibanModel.validate() : false;
                        ngModelCtrl.$setValidity('validIban', isValid);
                    }
                };

                // Split up the IBAN into groups of 4 characters separated by dashes
                var addDashes = function(iban) {
                    var ibanArray = [];

                    ibanArray.push(iban.substr(0, 2));
                    iban = iban.substr(2);
                    while (iban.length > 0) {
                        ibanArray.push(iban.substr(0, 4));
                        iban = iban.substr(4);
                    }

                    return ibanArray.join('-');
                };

                /**
                 * Set the correct cursor position after adding the separator
                 */
                scope.setCursorPosition = function() {

                    var cursorPosition = lpUIUtils.getNewCaretPosition(input, textSelection, lengthDiff, isBackspace);
                    isBackspace = false;

                    // add the separators to the cursor position
                    if (cursorPosition > 2) {
                        cursorPosition++;
                        if (cursorPosition > 6) {
                            var temp = (cursorPosition - 3) / 4;
                            if (parseInt(temp, 10) === temp) {
                                cursorPosition--;
                            }
                            cursorPosition += parseInt(temp, 10);
                        }
                    }

                    $timeout(function() {
                        lpUIUtils.setCaretPositionOfInput(input, cursorPosition, scope.paymentReference, $partialText);
                    }, 20, false);
                };

                /**
                 * Function that stores the selection start and end values
                 * @param  {event} event Either the Keyboard or the Mouse Event
                 */
                scope.getSelection = function(event) {

                    var noDashSelection = function(select) {
                        var selectionDiff = 0,
                            temp = select;

                        if (temp > 2) {
                            temp -= 3;
                            selectionDiff++;
                        }
                        selectionDiff += parseInt(temp / 5, 10);

                        return select - selectionDiff;
                    };

                    // get the selection start and end values
                    textSelection = lpUIUtils.getSelectionPositionOfInput(input, noDashSelection);

                    if (event.originalEvent.toString() === '[object KeyboardEvent]') {
                        // handle backspace
                        if (event.originalEvent.which === 8 && input.value.length) {
                            isBackspace = true;
                        }
                    }
                };

                scope.clear = function() {
                    scope.iban.value = '';
                    input.focus();
                };

                scope.change = function(dontFocus) {

                    if (scope.ibanModel.value !== scope.ibanModel.normalizeIban(scope.iban.selectedCountry + scope.iban.value)) {
                        var newValue = scope.ibanModel.normalizeIban(scope.iban.value);
                        if (!scope.ibanModel.getCountryCode(newValue)) {
                            newValue = scope.iban.selectedCountry + newValue;
                        }

                        // save the difference of length between the new and old values for later use
                        lengthDiff = newValue.length - scope.ibanModel.value.length;

                        // set the new value
                        scope.ibanModel.value = newValue;
                        ngModelCtrl.$setViewValue(newValue);
                    }

                    // if the first 2 characters of the input field are a valid IBAN country code
                    // update both fields
                    var countryCode = scope.ibanModel.getCountryCode();
                    if (countryCode) {
                        if (countryCode !== scope.iban.selectedCountry) {
                            scope.iban.selectedCountry = countryCode;
                            // add visual feedback for the country code change
                            $(element.find('button')[0]).addClass('lp-country-dropdown-update');
                            $timeout(function() {
                                $(element.find('button')[0]).removeClass('lp-country-dropdown-update');
                            }, 200, false);
                        }
                        // remove the country code from the input field value
                        scope.iban.value = scope.ibanModel.value.substr(2);
                    }

                    // add the separator to the input field value
                    scope.iban.value = addDashes(scope.ibanModel.normalizeIban(scope.iban.value));
                    if (!dontFocus) {
                        // move the cursor to the right position
                        scope.setCursorPosition();
                    }

                    /*scope.testiban2 = scope.iban.selectedCountry + '' + scope.iban.value;
                    scope.testiban = '';
                    while (scope.testiban2.length > 4) {
                        scope.testiban += scope.testiban2.substr(0, 4) + '-';
                        scope.testiban2 = scope.testiban2.substr(4);
                    }
                    scope.testiban += scope.testiban2 ? scope.testiban2 : '';*/
                };


                //Turn validation on/off based on which tranfer type is selected
                scope.$watch("transferType", function(newValue, oldValue) {
                    doValidation(newValue);
                });

                doValidation(scope.transferType);
            }
        };
    };
});
