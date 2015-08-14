define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.stepFocus = function () {

        return {
            scope: {
                step: '=stepFocus'
            },
            link: function (scope, element) {

                scope.$watch('step', function (newValue) {

                    if (newValue === 2) {
                        element.focus();
                    }
                });
            }
        };
    };

});
