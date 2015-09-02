define(function(require, exports, module) {
    'use strict';

    var applyScope = function($scope) {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    // @ngInject
    exports.NotificationsController = function($scope, widgetPrefs, $rootElement, lpWidget, lpPortal, NotificationsModel, i18nUtils, lpCoreBus, lpCoreUtils) {

        var bus = lpCoreBus;

        var vm = this;

        // Template to render notifications
        this.template = 'templates/type-panel.html';
        this.closeAllButton = false;

        //i18n
        this.locale = 'en-US';
        this.offsetTopCorrection = {};
        this.offsetMarginCorrection = {};

        //get all the prefs
        this.fixedBar = lpCoreUtils.parseBoolean(lpWidget.getPreference('fixedBar'));

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
        this.model = model;

        // don't call loadNotifications or start polling if the user is not logged in
        if (lpPortal.userId !== 'null') {
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

                    if (data.notification.container && data.notification.container.type) {
                        vm.template = 'templates/type-' + data.notification.container.type + '.html';
                    }

                    //text from a pubsub must be cleaned
                    data.notification.message = lpCoreUtils.escape(data.notification.message);
                    model.addNotification(data.notification);

                    vm.closeAllButton = !model.notifications.some(function(n) {
                        return !n.closable;
                    });

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
                    vm.offsetTopCorrection = {
                        top: data.offsetTopCorrection
                    };
                    vm.offsetMarginCorrection = !vm.fixedBar ? {
                        top: data.offsetTopCorrection
                    } : {};
                    applyScope($scope);
                }
            });
        }

        //util view functions
        this.getAlertClass = function(notification) {

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

        this.isValidLink = function(link) {
            return link.rel && link.uri;
        };

        this.isDesignMode = function() {
            return lpPortal.designMode;
        };

        this.closeNotification = function(notification) {
            model.closeNotification(notification);

            if (model.notifications.length > 0) {
                this.$broadcast('lp.notifications.focus');
            }
        };

        this.closeAllNotifications = function() {
            model.notifications.forEach(function(notification) {
                model.closeNotification(notification);
            });
        };
    };
});
