define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.lpResponsive = function() {

        return {
            replace: false,
            controller: 'ResponsiveController',
            link: function(scope, element, attrs, ctrl) {
                ctrl.init(element);
            }
        };
    };
});
