define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpAllowPubsubClick = function(lpCoreBus, lpCoreUtils) {
        return {
            restrict: 'A',
            scope: {
                numberAllowed: '@lpAllowPubsubClick',
                invokerClassName: '@'
            },
            link: function ($scope, element, attrs) {
                var bus = lpCoreBus;
                $scope.numberAllowed = parseInt($scope.numberAllowed, 10) || 0;
                $scope.invokerClassName = $scope.invokerClassName || 'pubsub-invoker';

                if ($scope.numberAllowed > 0 && $scope.invokerClassName) {
                    $scope.invokers = element[0].querySelectorAll('.' + $scope.invokerClassName);

                    lpCoreUtils.forEach($scope.invokers, function(el, index) {
                        if (index < $scope.numberAllowed) {
                            el.addEventListener('click', function(e) {
                                var eventName, args;
                                eventName = e.target.getAttribute('data-pubsub-name');
                                args = e.target.getAttribute('data-pubsub-arguments');

                                if (eventName) {
                                    bus.publish(eventName, args);
                                }
                            });

                        }
                    });
                }
            }
        };
    };
});
