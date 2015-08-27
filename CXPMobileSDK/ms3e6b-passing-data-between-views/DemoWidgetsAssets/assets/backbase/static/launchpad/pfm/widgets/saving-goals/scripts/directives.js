define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.iconSelect = function(lpWidget, lpCoreUtils) {
        var partials = lpCoreUtils.getWidgetBaseUrl(lpWidget) + '/partials';

        return {
            scope: {
                icons: '=',
                ngModel: '='
            },
            restrict: 'EA',
            templateUrl: partials + '/iconSelect.html',
            replace: true,
            link: function(scope, elem, attrs) {
                scope.selectIcon = function(name) {
                    scope.ngModel = name;
                };
            }
        };
    };
});
