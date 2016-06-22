/*global $ jQuery bd console*/
define(function (require, exports, module) {
    'use strict';

    var utils = require('base').utils;

    // @ngInject
    exports.lpLabeledInputField = function($timeout, $compile, $templateCache, lpCoreBus, lpLabeledInputUtil) {

        $templateCache.put('$labeledInputTemplate.html',
            '<div class="lp-labeled-input" ng-class="{\'button-validation-ok\': buttonValidationOk === true, \'button-validation-failed\': buttonValidationOk === false, \'show-error-below\': !showErrorInside, \'input-invalid-wrapper\': externalInvalid || invalid}">' +

            // Header messages
            '   <div class="upper-label placeholder-animate" ng-show="showLabel">' +
            '       <div ng-show="showLabel && value !== null" lp-i18n="{{ placeholder }}"></div>' +
            '   </div>' +

            // INPUT FIELD
            '   <input class="main-input text-black" ng-class="{\'short\': buttonInside, \'input-invalid\': externalInvalid || invalid}" ng-keyup="label()" ng-blur="checkValidityBlur()" ng-pattern="{{ pattern }}" ng-required="{{ isRequired || false }}" ng-disabled="{{ isDisabled }}" ng-minlength="{{ minLength || 0 }}" ng-maxlength="{{ maxLength || 10000 }}" ng-class="{\'labeled-input-state\': showLabel}" ng-model="value" type="__type__" name="{{ name }}" placeholder="{{ placeholder }}" />' +

            // Lower messages
            '   <div class="lower-label" ng-show="showLabel">' +
            '       <div ng-show="messages.invalid" lp-i18n="{{ patternErrorMsg || \'Invalid input! Check length, etc.\' }}"></div>' +
            '       <div ng-show="messages.required" lp-i18n="{{ requiredErrorMsg || \'Field is required\' }}"></div>' +
            '       <div ng-show="messages.externalInvalid" class="text-red" lp-i18n="{{ externalInvalid }}" title="{{ externalInvalid }}"></div>' +
            '       <div ng-show="messages.noValidator" lp-i18n="No external validator!"></div>' +
            '   </div>' +

            // Show button inside
            '   <span ng-if="buttonInside" class="button-inside-wrapper">' +
            '       <button ng-if="isMobileDevice" ng-hide="externalVerificationOk || externalVerificationOk === false" ng-click="checkValidityButton()" ng-class="{\'disabled\': !value}" ng-click="sendRequest()" class="btn btn-success" lp-i18n="Verify"></button>' +
            '       <div ng-show="externalVerificationOk" class="verification-result">' +
            '           <span class="text-green" lp-i18n="VERIFIED!"></span>' +
            '       </div>' +
            '       <div ng-show="buttonValidationOk === false" class="verification-result">' +
            '           <span class="text-red" lp-i18n="INCORRECT"></span>' +
            '       </div>' +
            '   </span>' +

            // Ordinary field validation
            '   <span ng-if="!isDisabled && !buttonInside && !externalVerification">' +
            '       <i ng-show="value && !externalInvalid" class="field-verified-sign glyphicon glyphicon-ok text-green"></i>' +
            '       <i ng-show="externalInvalid || invalid" class="field-verified-sign glyphicon glyphicon-exclamation text-red"></i>' +
            '   </span>' +

            // External field validation
            '   <span ng-if="externalVerification">' +
            '       <i ng-show="loading" class="field-verified-sign"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span></i>' +
            '       <i ng-show="externalVerificationOk" class="field-verified-sign glyphicon glyphicon-ok text-green"></i>' +
            '       <i ng-show="externalVerificationOk === false" class="field-verified-sign glyphicon glyphicon-exclamation text-red"></span></i>' +
            '   </span>' +

            '   <i ng-show="infoDescription" ng-click="(showDescription = !showDescription)" ng-class="{\'red-info-sign\': externalInvalid || invalid, \'enrollment-info-sign\': isMobileDevice, \'glyphicon glyphicon-info-sign desktop-info-sign\': !isMobileDevice}" class="field-verified-sign"></i>' +

            // Show description ( MOBILE )
            '   <div ng-show="showDescription && isMobileDevice" class="field-description">' +
            '       <div class="description-content" lp-template="" src="{{ description }}"></div>' +
            '       <div ng-click="(showDescription = false)" class="description-close">Close</div>' +
            '   </div>' +

            // Show description ( DESKTOP )
            '   <div ng-show="showDescription && !isMobileDevice" class="field-description-desktop">' +
            '       <div class="description-content" lp-template="" src="{{ description }}"></div>' +
            '       <div ng-click="(showDescription = false)" class="description-close">Close</div>' +
            '   </div>' +
            '</div>'
        );

        return {
            restrict: 'AE',
            scope: {
                placeholder: '@placeholderText',
                name: '@fieldName',
                pattern: '@inputPattern',
                isRequired: '@',
                isDisabled: '@',
                inputType: '@',
                description: '@',
                maxLength: '@inputMaxLength',
                minLength: '@inputMinLength',
                patternErrorMsg: '@',
                requiredErrorMsg: '@',
                showErrorInside: '@',
                mirror: '=',
                allFields: '=',
                value: '=inputValue',
                extraData: '&',

                // check if we validate the field externally
                externalVerification: '@',

                // inside button params
                buttonInside: '=',
                valueIsVerified: '=',
                valueNotVerified: '=',
                api: '&'
            },
            link: function (scope, element, attrs) {
                scope.isMobileDevice = utils.isMobileDevice();

                var template = $templateCache.get('$labeledInputTemplate.html');

                // notify outer system about local validation fail
                scope.$watch('invalid', function (invalid) {
                    lpCoreBus.publish('lp-enrollment:validation:local', {name: scope.name, invalid: invalid});
                });

                var customTemplateCompile = function () {
                    element.html(template.replace(/__type__/g, scope.inputType || 'text'));
                    $compile(element.contents())(scope);
                    $timeout(function() {
                        scope.$input = element.find('input');
                    });
                };

                // show the label if the model stores any value
                scope.$watch('value', function(newValue, oldValue) {
                    if (newValue) {
                        scope.showLabel = true;
                    }
                });

                scope.isDisabled = scope.isDisabled === 'true';
                scope.showLabel = false;
                scope.messages = {main: false, invalid: false, required: false, externalInvalid: false, noValidator: false};
                scope.infoDescription = !!scope.description;

                // Handle 'mirror' field (field value should be the same as provided in 'mirror' field)
                if (scope.mirror) {

                    // attach a reference to 'master' field's value to watch on
                    lpLabeledInputUtil.updateByMirrors(scope.allFields);

                    // Dynamically update pattern, depending on changing value in a 'master' field
                    // TODO: Once we shift to Angular 1.3+ we can use dynamic pattern update without re-compiling
                    scope.$watch('mirror.value', function(val) {
                        scope.pattern = '/^' + lpLabeledInputUtil.escapeRegExp(val) + '$/';
                        $timeout(customTemplateCompile).then(function () {
                            scope.value = null;
                        });
                    });
                }

                // compile template (to handle conditional input type)
                customTemplateCompile();

                // Check if we should show inline label
                scope.label = function () {
                    if (scope.isRequired === 'true' && !scope.$input.val()) {
                        scope.showLabel = false;
                    } else if (scope.value || scope.value === undefined) {
                        scope.invalid = false;
                        scope.externalInvalid = false;
                        scope.externalVerificationOk = undefined;
                        scope.buttonValidationOk = undefined;
                        scope.showLabel = true;
                        scope.showLabelText('main');
                    } else {
                        scope.showLabel = false;
                    }
                };

                // Show specific label text
                scope.showLabelText = function (prop) {
                    utils.forOwn(scope.messages, function (value, key) {
                        scope.messages[key] = false;
                    });

                    if (prop) {
                        scope.messages[prop] = true;
                    }
                };

                // Main Blur Validation
                scope.checkValidityBlur = function () {
                    if (!scope.buttonInside && scope.externalVerification && scope.value) {
                        scope.checkExternalValidity();
                    } else {
                        scope.checkLocalValidity();
                    }
                };

                // Validate by button click
                scope.checkValidityButton = function () {
                    if (scope.buttonInside && scope.externalVerification && scope.value) {
                        scope.checkExternalValidity();
                    } else {
                        scope.checkLocalValidity();
                    }
                };

                // Validate locally field when it's loosing focus
                scope.checkLocalValidity = function () {
                    if (scope.isRequired === 'true' && !scope.$input.val()) {
                        scope.showLabel = true;
                        scope.invalid = true;
                        scope.showLabelText('required');
                    } else if (scope.value === undefined) {
                        scope.invalid = true;
                        scope.showLabelText('invalid');
                    } else {
                        scope.invalid = false;
                        scope.showLabelText('main');
                    }
                };

                // To have an ability to initiate external verification from outside
                lpCoreBus.subscribe('lp-enrollment:verify:by', function (name) {
                    if (scope.name === name) {
                        scope.checkExternalValidity();
                    }
                });

                // Validate Externally field when it's loosing focus
                scope.checkExternalValidity = function () {
                    var values = {};
                    var api = scope.api();
                    var validator = api[scope.externalVerification];

                    // add field value
                    values[scope.name] = scope.value;

                    if (validator) {
                        scope.loading = true; // start spinner

                        // decorate request with additional data (if necessary)
                        if (scope.extraData) {
                            values = utils.assign(values, scope.extraData());
                        }

                        validator(values)
                            .then(function(response) {
                                scope.loading = false; // stop spinner
                                if (response.valid === 'true' || response.valid === true) {
                                    if (scope.buttonInside) {
                                        scope.buttonValidationOk = true;
                                        scope.showLabel = false;
                                    } else {
                                        scope.externalInvalid = false;
                                    }
                                    scope.externalVerificationOk = true;
                                    lpCoreBus.publish('lp-enrollment:validation:external', {name: scope.name, result: true});
                                } else {
                                    if (scope.buttonInside) {
                                        scope.buttonValidationOk = false;
                                    } else {
                                        scope.externalInvalid = response.message || 'Validation failed!';
                                        scope.showLabelText('externalInvalid');
                                    }
                                    scope.externalVerificationOk = false;
                                    lpCoreBus.publish('lp-enrollment:validation:external', {name: scope.name, result: false, validationError: response.message || 'Validation failed!'});
                                }
                            }, function(error) {
                                scope.loading = false; // stop spinner
                                scope.externalVerificationOk = false;
                                scope.externalInvalid = true;
                                lpCoreBus.publish('lp-enrollment:validation:external', {name: scope.name, result: false, serverError: error});
                            });
                    } else {
                        scope.showLabel = true;
                        scope.invalid = true;
                        scope.showLabelText('noValidator');
                    }
                };
            }
        };
    };
});
