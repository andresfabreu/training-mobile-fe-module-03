define(function(require, exports, module) {
    'use strict';

    var applyScope = function($scope) {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    var queue = require('base').queue;

    // @ngInject
    exports.NotificationsController = function($scope, $rootElement, lpWidget, lpPortal, lpCoreHttpInterceptor, widgetPrefs, NotificationsModel, i18nUtils, lpCoreBus, lpCoreUtils) {

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
        var ignoreEnrollmentEndpoint = lpWidget.getPreference(widgetPrefs.IGNORE_ENROLLMENT_ENDPOINT);
        var closeNotificationEndpoint = lpWidget.getPreference(widgetPrefs.CLOSE_NOTIFICATION_ENDPOINT);
        var allowPubsub = lpCoreUtils.parseBoolean(lpWidget.getPreference(widgetPrefs.ALLOW_PUBSUB));
        var pollInterval = parseInt(lpWidget.getPreference(widgetPrefs.POLL_INTERVAL), 10);

        // Prevent notifications about notifications :)
        lpCoreHttpInterceptor.configureNotifications({
            ignore: [notificationsEndpoint, ignoreEnrollmentEndpoint]
        });

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


        function addNotification(data) {
            if (data.notification) {

                var not = data.notification;

                // Notification main container template
                var type = not.container && not.container.type || 'panel';
                vm.template = 'templates/type-' + type + '.html';

                // Merge notification content template data into notification object (for legacy config  support)
                if (typeof not.data === 'object' || not.data) {
                    window.angular.extend(not, not.data);
                }

                // Precalculate CSS class for notification based on notification.level
                not.className = vm.getAlertClass(not);

                // Text from a pubsub must be cleaned
                not.message = lpCoreUtils.escape(not.message);

                model.addNotification(data.notification);

                // Show/hide close all button
                vm.closeAllButton = !model.notifications.some(function(n) {
                    return !n.closable;
                });

                applyScope($scope);
            }
        }

        // don't call loadNotifications or start polling if the user is not logged in
        if (lpPortal.userId !== 'null') {
            model.loadNotifications();

            // polling interval lower than 1 second is not supported, and
            // if endpoint pref is not defined we will not go polling
            if (!isNaN(pollInterval) && pollInterval > 999 && notificationsEndpoint) {
                model.startPolling(pollInterval);
            }
        }

        /**
         * Listen for notifcations from other 'on-page' sources, if enabled as a preference.
         * Notification format for publishing:
         *
         * bus.publish('launchpad.add-notification', {
         *     notification: {
         *         container: {
         *             type: 'overlay',
         *             templateUrl: 'templates/retry.html'
         *         },
         *         id: 'error.transaction-list.500',
         *         level: 'severe', // warning, success, info
         *         closable: true,
         *         data: {
         *             message: 'Could not submit transaction for "{{amount}}".',
         *             values: {amount: 123.50}
         *         }
         *     }
         * });
         *
         */
        if (allowPubsub) {
            queue.onPush(function(context, retryObject) {

                /**
                 * @property context.messages {Array}
                 * @property context.messages[0].message {String}
                 * @param context.contextId {String}
                 */

                var notificationIdPrefix = 'launchpad-widget-notification-retry_',
                    notificationId = notificationIdPrefix + context.contextId,
                    existingNotification = model.getNotificationById(notificationId);


                if (existingNotification) {
                    existingNotification.data.message = existingNotification.data.message.concat(context.messages);
                    applyScope($scope);
                }
                else {
                    // create new notification
                    addNotification({
                        notification: {
                            id: notificationId,
                            level: context.notification && context.notification.level || 'severe',
                            data: {
                                message: [].concat(context.messages)
                            },
                            container: {
                                type: 'overlay',
                                template: 'templates/retry.html'
                            },
                            retry: {
                                action: function() {
                                    queue.retry(retryObject).then(function() {
                                        vm.closeNotification({id: notificationId});
                                    });
                                },
                                cancel: function() {
                                    queue.cancel(retryObject).then(function() {
                                        vm.closeNotification({id: notificationId});
                                    });
                                }
                            }
                        }
                    });
                }
            });

            bus.subscribe('launchpad.add-notification', addNotification);
            bus.subscribe('launchpad.remove-notification', function(data) {
                if (data.notification && data.notification.id) {
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

        /**
         * Get valid Bootstrap class name for notification by its level property.
         * Possible values for notification levels: info (default), severe, warning, success.
         * @param notification {Object}
         * @return {string}
         */
        this.getAlertClass = model.getAlertClass;

        this.isDesignMode = function() {
            return lpPortal.designMode;
        };

        this.closeNotification = function(notification) {
            model.closeNotification(notification).then(function() {
                if (model.notifications.length > 0) {
                    $scope.$broadcast('lp.notifications.focus');
                }
            });
        };

        this.closeAllNotifications = function() {
            model.notifications.forEach(function(notification) {
                model.closeNotification(notification);
            });
        };
    };
});
