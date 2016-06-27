define(function(require, exports, module) {
    'use strict';

    /**
     * Directive to show messages related to 'data freshness status'
     *
     * 1. "Updating" message is showing until it changes
     * 2. "Actual" message disappears in some time (pre-defined duration is 7 sec)
     *
     */
    // @ngInject
    exports.lpFreshnessMessage = function($templateCache, $timeout, lpCoreBus, lpDataFreshness) {
        var bus = lpCoreBus;

        $templateCache.put('$dataFreshnessTemplate.html',
            '<div class="data-freshness-message" ' +
            'ng-class="{\'alert alert-info\': status === \'actual\', \'alert alert-warning\': status === \'updating\', \'alert alert-success\': status === \'refresh\', \'\': !status}" ' +
            'ng-show="showMessage">' +
            '{{ message }}' +
            '<button type="button" class="close" ng-click="showMessage = !showMessage">&times;</button>' +
            '</div>'
        );

        return {
            restrict: 'A',
            scope: {},
            template: $templateCache.get('$dataFreshnessTemplate.html'),
            link: function($scope, element, attrs) {
                // messages depending on status
                var messages = {
                    actual: 'All transactions are in the actual state',
                    updating: 'Some transactions are on the way... We will refresh the data soon!',
                    refresh: 'New data refreshed from the server'
                };
                var msgShowTime = parseInt(attrs.msgShowTime, 10) || 7000;

                // change message and show/hide it
                var updateStatusMessage = function(status) {
                    $scope.message = messages[status];
                    if (status === 'actual') {
                        $timeout(function() {
                            $scope.showMessage = false;
                        }, msgShowTime);
                    }
                    if ($scope.message) {
                        $scope.showMessage = true;
                    }
                };

                // initial values
                $scope.showMessage = false;

                // listen to data freshness status change event
                bus.subscribe('lpDataFreshnessChanged', function(status) {
                    $timeout(function() { $scope.status = status; }, 0);
                });

                // react on status change
                $scope.$watch('status', updateStatusMessage);
            }
        };
    };
});

