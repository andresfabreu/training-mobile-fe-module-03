define(function(require, exports) {

    'use strict';

    function focus(element) {
        setTimeout(function() {
            element.focus();

            if (element.tagName === 'INPUT') {
                element.select();
            }
        }, 50);
    }

    // @ngInject
    exports.lpFocusOn = function($interpolate) {
        return {
            link: function (scope, element, attrs) {
                var value = $interpolate(attrs.lpFocusOn)(scope);
                scope.$on(value, function() {
                    focus(element[0]);
                });
            }
        };
    };

    exports.lpFocusId = function () {
        return {
            link: function(scope, element, attr) {
                scope.$on('lpFocusId', function(e, name) {
                    if (name === attr.lpFocusId) {
                        focus(element[0]);
                    }
                });
            }
        };
    };

    if (!('autofocus' in document.createElement('input'))) {
        exports.autofocus = function() {
            return {
                link: function (scope, element) {
                    // IE8: Use timeout
                    setTimeout(function() {
                        element[0].focus();
                    }, 100);
                }
            };
        };
    }

});
