define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.P2PTabController = function($scope, lpWidget, P2PService, lpCoreBus) {

        var bus = lpCoreBus;
        // Initialize
        var initialize = function () {

            $scope.p2pService = P2PService;

            $scope.p2pService.getUserEnrollmentDetails().then(function(response) {
                //success, we are enrolled!
                $scope.userEnrolled = true;
            }, function(response) {
                //error, we are not enrolled
                if(response.status === 404) {
                    $scope.userEnrolled = false;
                } else {
                    //error occurred
                    $scope.p2pService.error = true;
                }
            });

            //Options available in widget, list can be extended
            $scope.tabs = [
                {
                    title: 'Sign Up',
                    pubsubMessage: 'launchpad-retail.openP2PEnrollment',
                    visible: function() {
                        return !$scope.userEnrolled;
                    }
                },
                {
                    title: 'Overview',
                    pubsubMessage: 'launchpad-retail.openP2PTransactions',
                    visible: function() {
                        return $scope.userEnrolled;
                    }
                },
                {
                    title: 'Preferences',
                    pubsubMessage: 'launchpad-retail.openP2PPreferences',
                    visible: function() {
                        return $scope.userEnrolled;
                    }
                }
            ];

            //Subscribe to this message to change the options available to choose from
            bus.subscribe('launchpad-retail.p2pEnrollmentComplete', function(data) {
                //internal anonymous function, need to start digest cycle manually
                $scope.$apply(function() {
                    $scope.userEnrolled = data.verified;
                });
            });
        };

        /**
         * Load widget by behavior tag
         * @param pubsubMessage
         */
        $scope.loadP2PWidgetByBehavior = function(pubsubMessage, event) {

            if((event && event.which === 13) || !event) {
                bus.publish(pubsubMessage);
            }
        };

        initialize();
    };
});
