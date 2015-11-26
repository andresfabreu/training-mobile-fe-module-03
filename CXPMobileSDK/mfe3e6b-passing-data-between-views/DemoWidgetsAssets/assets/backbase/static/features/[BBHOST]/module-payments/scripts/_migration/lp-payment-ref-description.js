define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var lpUIUtils = base.inject('lpUIUtils', require('ui').name);
    var lpCoreUtils = base.inject('lpCoreUtils', require('core').name);

    // @ngInject
    exports.lpPaymentRefDescription = function ($templateCache, $timeout, $filter) {
        $templateCache.put("$paymentRefDescription.html", '<div class="lp-payment-ref-description">' +
            '<div ng-hide="hidePaymentReference" class="lp-payment-reference" ng-class="{\'has-success\': isValid && paymentReference.length > 0, \'has-error\': !isValid && paymentReference.length > 0,  \'has-feedback\': paymentReference.length}">' +
            '<input  class="form-control" aria-label="payment reference" lp-payment-reference-field" type="text" placeholder="Payment reference (optional)" maxlength="31" ng-model="paymentReference" ng-disabled="paymentRefDisabled" ' +
                'lp-input-overflow="lp-input-overflow" ' +
                'ng-keydown="getSelection($event)" ng-keypress="getSelection($event)" ' +
                'ng-mousedown="getSelection($event)" ng-mouseup="getSelection($event)" ' +
                'lp-format-payment-reference="lp-format-payment-reference" />' +
            '<span ng-if="isValid && paymentReference.length" class="glyphicon glyphicon-ok form-control-feedback"></span>' +
            '<span ng-click="clearRef()" ng-if="!isValid && paymentReference.length" class="glyphicon glyphicon-remove form-control-feedback"></span>' +
            '<div class="lp-input-dividers clearfix">' +
            '<div class="separator"></div><div class="separator"></div><div class="separator"></div><div class="separator"></div><div class="separator"></div><div class="separator"></div>' +
            '</div>' +
            '</div>' +
            '<div class="lp-payment-description">' +
            '<textarea aria-label="payment description" class="form-control lp-payment-description-area" placeholder="Description (optional) Maximum number of characters is 140" maxlength="140" ng-model="paymentDescription" ng-disabled="paymentDescDisabled"></textarea>' +
            '</div>' +
            '<div ng-if="!hidePaymentReference" class="hover-catcher" ng-class="{refDisabled: paymentRefDisabled, descDisabled: paymentDescDisabled}" tooltip-placement="top" tooltip="You can only provide a Payment Reference or a Payment Description, not both."></div>' +
            '</div>');

        return {
            restrict : "AE",
            replace: true,
            require: ["ngModel", "^form"],
            scope: {
                "paymentOrder": "=ngModel",
                "hidePaymentReference": "="
            },
            template: $templateCache.get("$paymentRefDescription.html"),
            link: function (scope, element, attrs, ctrls) {

                var ngModelCtrl = ctrls[0],
                    formCtrl = ctrls[1];
                var $paymentReference = element.find("input");
                var $hoverCatcher = element.find(".hover-catcher");
                var $paymentDescription = element.find("textarea");
                var input = $paymentReference[0],
                    textSelection = [],
                    isBackspace = false,
                    lengthDiff = 0;

                // add control using the name attribute to the form controller to track validity
                ngModelCtrl.$name = attrs.name;
                // formCtrl.$addControl(ngModelCtrl);

                var $partialText = $(document.createElement('span'));
                $partialText.addClass('lp-input-cursor-position-offset');
                $partialText.css('font-size', element.css('font-size'));
                $(input).after($partialText);


                //populate with preloaded data
                if(scope.paymentOrder.paymentReference !== "") {
                    scope.paymentReference = $filter("addSeperator")(scope.paymentOrder.paymentReference);
                    scope.paymentDescDisabled = true;
                } else if(scope.paymentOrder.paymentDescription !== "") {
                    scope.paymentDescription = scope.paymentOrder.paymentDescription;
                    scope.paymentRefDisabled = true;
                }

                //treat deactivation if payment ref is hidden
                if(scope.hidePaymentReference) {
                    scope.paymentDescDisabled = false;
                }

                //normalizes payment ref input
                var normalize = function(input) {
                    return input.split(" ").join("");
                };

                //validates the payment ref based on length and ISO 7064
                var validatePaymentRef = function(input) {

                    var valid = true;

                    //validates length
                    if(input.length > 25) {
                        valid = false;
                    }

                    if(!input.match(/^RF\d{2}/)) {
                        valid = false;
                    }

                    //validates input based on checksum
                    if(!lpCoreUtils.isValidISO7064Checksum(input)) {
                        valid = false;
                    }

                    return valid;
                };

                scope.toggleInfoMessage = function() {
                    scope.showInfoMessage = !scope.showInfoMessage;
                };


                /**
                 * Set the correct cursor position after adding the separator
                 */
                scope.setCursorPosition = function() {

                    var cursorPosition = lpUIUtils.getNewCaretPosition(input, textSelection, lengthDiff, isBackspace);

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
                        lpUIUtils.setCaretPositionOfInput(input, cursorPosition, scope.paymentReference, $partialText);
                    }, 20, false);
                };

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

                    textSelection = lpUIUtils.getSelectionPositionOfInput(input, noSeparatorSelection);

                    if (event.originalEvent.toString() === '[object KeyboardEvent]') {
                        // handle backspace
                        if (event.originalEvent.which === 8 && input.value.length) {
                            isBackspace = true;
                        }
                    }
                };

                scope.clearRef = function() {
                    scope.paymentReference = "";
                    input.focus();
                };

                scope.$watch('paymentReference', function(newValue, oldValue) {

                    if(oldValue === newValue) {
                        return;
                    }

                    if (!oldValue) {
                        oldValue = '';
                    }

                    //if this field is empty, reactivate other field
                    if(!newValue) {
                        ngModelCtrl.$modelValue.paymentReference = "";
                        scope.paymentDescDisabled = false;
                        formCtrl.$removeControl(ngModelCtrl);
                    } else if(newValue.length > 0) {

                        if (!formCtrl[ngModelCtrl.$name]) {
                            formCtrl.$addControl(ngModelCtrl);
                        }

                        //validation performed here
                        var normalizedPaymentRef = normalize(newValue);
                        scope.isValid = validatePaymentRef(normalizedPaymentRef);
                        ngModelCtrl.$setValidity('validRef', scope.isValid);

                        if (oldValue) {
                            lengthDiff = normalizedPaymentRef.length - normalize(oldValue).length;
                        } else {
                            lengthDiff = normalizedPaymentRef.length;
                        }

                        scope.paymentDescDisabled = true;
                        ngModelCtrl.$modelValue.paymentReference = normalizedPaymentRef;

                        // scope.setCursorPosition();
                    }
                    scope.setCursorPosition();
                }, true);

                scope.$watch('paymentDescription', function(newValue, oldValue) {

                    if(oldValue === newValue) {
                        return;
                    }

                    //if this field is empty, reactivate other field
                    if(!newValue) {
                        scope.paymentRefDisabled = false;
                        ngModelCtrl.$modelValue.paymentDescription = "";
                    } else if(newValue.length > 0) {
                        scope.paymentRefDisabled = true;
                        ngModelCtrl.$modelValue.paymentDescription = newValue;
                    }
                }, true);

                scope.$on("reset", function() {

                    scope.paymentReference = "";
                    scope.paymentDescription = "";

                    scope.showInfoMessage = false;

                    scope.paymentRefDisabled = false;
                    scope.paymentDescDisabled = false;
                });
            }
        };
    };
});
