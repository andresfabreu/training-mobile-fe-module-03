define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.NotificationsModel = function($rootScope, $timeout, httpService) {
         /**
         * NotificationsModel constructor
         * @param config
         * @constructor
         */
        var NotificationsModel = function(config) {

            config = config || {};
            this.notifications = [];
            this.notificationsEndpoint = config.notificationsEndpoint;
            this.closeNotificationEndpoint = config.closeNotificationEndpoint;
            this.updateReceivedEndpoint = config.updateReceivedEndpoint;
            this.polling = false;
            this.onNotificationAdded = config.onNotificationAdded;
            this.loading = false;
        };

        /**
         * Initializes the model by loading notifications from the remote endpoint.
         * If a pollInterval greater than 0 is also specified in the setup config, polling at that interval will also
         * start.
         */
        NotificationsModel.prototype.startPolling = function(pollInterval) {

            var self = this;

            //don't attempt to start polling if already polling
            if(this.polling) {
                return;
            }
            this.polling = true;

            //recursive timeout loading
            var load = function() {
                var xhr = self.loadNotifications();
                xhr.success(function() {
                    self.pollingTimeout = $timeout(function() {
                        load();
                    }, pollInterval);
                });
            };

            //initial load after timeout
            this.pollingTimeout = $timeout(function() {
                load();
            }, pollInterval);
        };

        /**
         * Stops the notifications widget from polling
         */
        NotificationsModel.prototype.stopPolling = function() {

            if(this.pollingTimeout) {
                $timeout.cancel(this.pollingTimeout);
                this.polling = false;
            }
        };

        /**
         * Makes the request for notifications.
         * Will also send a 'mark recieved' request once a list of messages have been received.
         */
        NotificationsModel.prototype.loadNotifications = function() {

            var self = this;

            var getMessagesService = httpService.getInstance({
                endpoint: this.notificationsEndpoint,
                cacheTimeout: 0
            });

            this.loading = true;
            var xhr = getMessagesService.read();
            xhr.success(function(data) {
                if(data.messages) {
                    data.messages.forEach(function(message) {
                        self.addNotification(message);
                    });
                }
            });
            xhr.error(function(data) {
                if(data.errors) {
                    self.errorCode = data.errors[0];
                }
            });
            xhr['finally'](function() {
                self.loading = false;
            });
            return xhr;
        };

        /**
         * Adds a new notification from the model
         * @param notification
         */
        NotificationsModel.prototype.addNotification = function(notification) {

            //messages must have an id, otherwise we cannot manage them
            if(typeof notification.id !== 'string' && typeof notification.id !== 'number') {
                return;
            }

            //ensures a notification with a 'type' field overrides any existing notifications of the same type
            var replaced = false;
            for(var i = 0; i < this.notifications.length && !replaced; i++) {
                if(notification.id && this.notifications[i].id === notification.id) {
                    this.notifications[i] = notification;
                    replaced = true;
                }
            }
            if(!replaced) {
                this.notifications.push(notification);

                if(typeof this.onNotificationAdded === 'function') {
                    this.onNotificationAdded.call(null, notification);
                }
            }
        };

        /**
         * Removes a notification from the model. Does not update the server
         * @param notification
         */
        NotificationsModel.prototype.removeNotification = function(notification) {

            this.notifications.splice( this.notifications.indexOf(notification), 1 );
        };

        /**
         * Removes a notification from the model
         * @param notification
         */
        NotificationsModel.prototype.closeNotification = function(notification) {

            var self = this;

            var closeOnServer = function() {
                self.removeNotification(notification);

                //sync with server
                var closeNotificationService = httpService.getInstance({
                    endpoint: self.closeNotificationEndpoint,
                    urlVars: {
                        id: notification.id
                    }
                });
                closeNotificationService.update({contentType: 'application/json'});
            };

            //the timeout ensures that a close request waits for a current loading notifications request to
            //complete before attempting to close a notification. Otherwise an unlikely race condition could exist
            //where the notification is closed by the user, but the a load notifications response brings it back.
            var safeToClose = function() {
                $timeout(function() {
                    if(!self.loading) {
                        closeOnServer();
                    } else {
                        safeToClose();
                    }
                }, 100);
            };
            safeToClose();
        };

        return {
            getInstance: function(config) {
                return new NotificationsModel(config);
            }
        };
    };
});
