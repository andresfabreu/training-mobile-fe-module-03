define(function(require, exports, module) {
    'use strict';

    var util = window.lp && window.lp.util; // #Deprecate

    var applyScope = function($scope) {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    // @ngInject
    exports.NotificationsController = function($scope, widgetPrefs, $rootElement, lpWidget, NotificationsModel, i18nUtils, lpCoreBus, lpCoreUtils) {
        var bus = lpCoreBus;
        //i18n
        $scope.locale = 'en-US';
        $scope.offsetTopCorrection = {};
        $scope.offsetMarginCorrection = {};

        //get all the prefs
        $scope.fixedBar = lpCoreUtils.parseBoolean(lpWidget.getPreference('fixedBar'));
        var notificationsEndpoint = lpWidget.getPreference(widgetPrefs.NOTIFICATIONS_ENDPOINT);
        var closeNotificationEndpoint = lpWidget.getPreference(widgetPrefs.CLOSE_NOTIFICATION_ENDPOINT);
        var allowPubsub = lpCoreUtils.parseBoolean(lpWidget.getPreference(widgetPrefs.ALLOW_PUBSUB));
        var pollInterval = parseInt(lpWidget.getPreference(widgetPrefs.POLL_INTERVAL), 10);

        //construct and initialize the model
        var model = NotificationsModel.getInstance({
            notificationsEndpoint: notificationsEndpoint,
            closeNotificationEndpoint: closeNotificationEndpoint,
            onNotificationAdded: function(notification) {

                //this callback is fired when a new notification is added, which in turn fires
                //an event on the bdom, so parent containers are aware
                //For example the launcher container modifies its scroll position to accommodate the new message
                lpWidget.model.fireEvent('notification-added', true, true, {
                    notification: notification
                });
            }
        });
        $scope.model = model;

        // don't call loadNotifications or start polling if the user is not logged in
        if (window.b$.portal.loggedInUserId !== 'null') {
            model.loadNotifications();

            // polling interval lower than 1 second is not supported, and
            // if endpoint pref is not defined we will not go polling
            if (!isNaN(pollInterval) && pollInterval > 999 && notificationsEndpoint) {
                model.startPolling(pollInterval);
            }
        }

        //listen for notifcations from other 'on-page' sources, if enabled as a preference
        if (allowPubsub) {
            bus.subscribe('launchpad.add-notification', function(data) {
                if (data.notification) {
                    //text from a pubsub must be cleaned
                    data.notification.message = lpCoreUtils.escape(data.notification.message);
                    model.addNotification(data.notification);
                    applyScope($scope);
                }
            });
            bus.subscribe('launchpad.remove-notification', function(data) {
                if (data.notification && data.notification.id) {
                    //text from a pubsub must be cleaned
                    model.removeNotification(data.notification.id);
                    applyScope($scope);
                }
            });
            bus.subscribe('launchpad-retail.offsetTopCorrection', function(data) {

                if (data.offsetTopCorrection >= 0) {
                    $scope.offsetTopCorrection = {
                        top: data.offsetTopCorrection
                    };
                    $scope.offsetMarginCorrection = !$scope.fixedBar ? {
                        top: data.offsetTopCorrection
                    } : {};
                    applyScope($scope);
                }
            });
        }

        //util view functions
        $scope.getAlertClass = function(notification) {

            var alertType = 'alert-info';
            var level;
            if (notification.level) {
                level = notification.level.toLowerCase();
                if (level === 'severe') {
                    alertType = 'alert-danger';
                } else if (level === 'warning') {
                    alertType = 'alert-warning';
                } else if (level === 'success') {
                    alertType = 'alert-success';
                }
            }
            return alertType;
        };
        $scope.isValidLink = function(link) {
            return link.rel && link.uri;
        };
        $scope.isDesignMode = function() {
            return util.isDesignMode();
        };

        $scope.closeNotification = function(notification) {
            $scope.model.closeNotification(notification);

            if ($scope.model.notifications.length > 0) {
                $scope.$broadcast('lp.notifications.focus');
            }
        };
    };
});
