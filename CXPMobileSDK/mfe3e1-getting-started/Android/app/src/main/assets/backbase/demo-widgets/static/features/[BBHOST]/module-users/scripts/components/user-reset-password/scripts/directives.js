define(function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpResetPasswordLink = function($parse) {
        var tmpl = [
            '<a href="#" ng-click="fireOnClick($event)">',
                '<small lp-i18n="Having trouble accessing your account?"></small>',
            '</a>'
        ].join('');

        function linkFn(scope, el, attrs) {
            var onClick = $parse(attrs.ngClick || '');

            scope.fireOnClick = function(event) {
                event.preventDefault();
                event.stopPropagation();

                onClick(scope, { $event: event });
            };
        }

        function compileFn() {
            return linkFn;
        }

        return {
            restricted: 'A',
            template: tmpl,
            compile: compileFn
        };
    };
});
