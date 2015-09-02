define(function(require, exports) {
    'use strict';

    /** @ngInject */
    exports.lpNumberInput = function () {
        return {
            scope: {
                'lpMaxLength': '='
            },
            link: function(scope, element, attrs) {

                // set the min and max values
                var maxValue = attrs.max || Number.MAX_VALUE,
                    minValue = attrs.min || Number.MIN_VALUE;

                // check for browser support of input type="number"
                var numberInputSupported = element[0].getAttribute('type') === 'number' && element[0].type === 'number';

                // set the max attribute depending on the length
                var updateMaxValue = function(value) {
                    if (value) {
                        maxValue = Math.pow(10, value) - 1;
                        element.attr('max', maxValue);
                    }
                };

                // set the max length, in case the browser doesn't support number input fields
                var updateMaxLength = function(value) {
                    if (value) {
                        element.attr('maxlength', value);
                    }
                };

                // if lp-max-length is defined set the max value again
                if (scope.lpMaxLength) {
                    if (numberInputSupported) {
                        updateMaxValue(scope.lpMaxLength);

                        scope.$watch('lpMaxLength', function(newValue) {
                            updateMaxValue(newValue);
                        });
                    } else {
                        updateMaxLength(scope.lpMaxLength);

                        scope.$watch('lpMaxLength', function(newValue) {
                            updateMaxLength(newValue);
                        });
                    }
                }

                element.bind('keypress', function(event) {

                    // Regular expression for numbers 0..9
                    var digitRegex = new RegExp('(4[8-9]|5[0-7])');

                    // if key pressed not a digit, backspace, delete, enter, tab or function key... block it
                    if (!event.ctrlKey && !event.metaKey &&
                        !/^(8|9|13|189|190)$/.test(event.keyCode) && !digitRegex.test(event.which)) {

                        event.preventDefault();
                        event.stopPropagation();
                        return;
                    }

                    // if min value is 0 or higher, don't allow minus sign to be entered
                    if (minValue >= 0 && /^189$/.test(event.which)) {
                        event.preventDefault();
                        event.stopPropagation();
                        return;
                    }

                    var digit = null,
                        input = element[0];

                    if (digitRegex.test(event.which)) {
                        digit = String.fromCharCode(event.which);
                        var value = input.valueAsNumber;
                        if (isNaN(value)) {
                            value = '';
                        }
                        value = parseInt(value + digit, 10);
                        // if new value out of the min..max range block the last key
                        if (value < minValue || value > maxValue) {
                            event.preventDefault();
                            event.stopPropagation();
                            return;
                        }
                    }
                });
            }
        };
    };

});
