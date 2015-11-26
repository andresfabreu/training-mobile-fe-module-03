define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.lpLastLogin = function($timeout, $parse, lpCoreUtils) {
        var tmpl = [
            '<div class="lp-last-login" ng-show="show && lastLoginDateTime">',
            '    <span class="lp-last-login__label" lp-i18n="Last login:"></span> <span class="lp-last-login__datetime">{{lastLoginDateTime | date:\'MMMM d hh:mma\'}}</span>',
            '</div>'
        ].join('');

        function templateFn() {
            return tmpl;
        }

        function linkFn(scope, element, attrs) {
            var lastLoginDateTimeUnregister;

            scope.show = true;

            lastLoginDateTimeUnregister = scope.$watch('lastLoginDateTime', function(datetime) {
                if (datetime) {
                    var lapse = parseInt(scope.hideAfter, 10);

                    if (!lpCoreUtils.isNaN(lapse) && lapse > 0) {
                        $timeout(function() {
                            scope.show = false;
                        }, lapse * 1000);
                    }

                    lastLoginDateTimeUnregister();
                }
            });
        }

        return {
            restrict: 'AE',
            scope: {
                lastLoginDateTime: '=lpLastLogin',
                hideAfter: '='
            },
            link: linkFn,
            template: templateFn
        };
    };
});
