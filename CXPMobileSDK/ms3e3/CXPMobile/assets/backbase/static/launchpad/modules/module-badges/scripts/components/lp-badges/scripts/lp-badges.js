define(function(require, exports, module) {
    'use strict';

    var gadgets = window.gadgets; // todo: refactor to use lpCoreUtils.bus.

    /**
     * Directive to show badges
     *
     */
    // @ngInject
    exports.lpBadges = function($templateCache, $timeout, badgesUtils, lpBadgesResource, lpBadgesController) {

        $templateCache.put('$badgesTemplate.html',
            '<span ng-show="model.unreadItems" class="badge lp-badges" ng-class="{' +
            '\'lp-badges-alert\': model.theme === \'alert\',' +
            '\'lp-badges-info\': model.theme === \'info\',' +
            '\'lp-badges-success\': model.theme === \'success\'' +
            '}">{{ model.unreadItems }}</span>'
        );

        return {
            restrict: 'A',
            scope: {
                'type': '@lpBadges',
                'position': '@',
                'theme': '@'
            },
            template: $templateCache.get('$badgesTemplate.html'),
            controller: function($scope) {
                $scope.model = {};
                $scope.model.unreadItems = 0;
                $scope.model.position = $scope.position || 'right-top';
                $scope.model.theme = $scope.theme || 'alert';
            },
            link: function($scope, element, attrs) {

                gadgets.pubsub.subscribe('lpBadgesUnread.' + $scope.type, function(quantity) {
                    $timeout(function() {
                        var prev = $scope.model.unreadItems;
                        $scope.model.unreadItems = quantity;
                        if (prev !== $scope.model.unreadItems) {
                            badgesUtils.position(element, $scope.model.position);
                        }
                    }, 0);
                });

            }
        };
    };
});
