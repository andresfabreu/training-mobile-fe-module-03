/**
 * Services
 * @module services
 */
define(function(require, exports) {

    'use strict';

    /* Responsible for managing alert messages */
    // @ngInject
    exports.AlertsManager = function($timeout, $resource) {
        var ALERT_TIMEOUT = 3000; // Time in which message will auto-close if timeout = true
        var alerts = [];
        this.list = function() {
            return alerts;
        };
        this.push = function(message, type, timeout) {
            var self = this;
            self.close(); // support only 1 alert for now
            alerts.push({
                type: type || 'danger',
                msg: message
            });
            if (timeout !== false) {
                $timeout(function() { self.close(); }, ALERT_TIMEOUT);
            }
        };
        this.close = function() {
            alerts = [];
        };
    };
});
