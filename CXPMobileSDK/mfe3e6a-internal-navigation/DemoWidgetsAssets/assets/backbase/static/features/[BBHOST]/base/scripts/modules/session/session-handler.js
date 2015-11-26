 /**
 * Session timeout handling
 * Pings the session endpoint to determine session time remaining.
 * If less than 'startCountdownAt', a timeout warning is initiated.
 * If no time is left, automatic logout
 * User click and keyboard events revalidate the session on every ping, or immediately if the warning is active

/**
 *
 */
define(function(require, exports, module) {

    'use strict';

    var utils = require('../utils/main');
    var log = require('../log/main');
    var fetch = require('../async/fetch');
    var $ = require('jquery');

    var formHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    /*----------------------------------------------------------------*/
    /* Export Singleton session handler
    /*----------------------------------------------------------------*/
    module.exports = (function() {

        var instance; // Session Handler instance
        var config; // store the configuration options
        var defaults = {
            pingUrl: '$(servicesPath)/services/rest/v1/authentication/session',
            logoutUrl: '$(contextRoot)/j_spring_security_logout',
            keepAlive: true,
            startCountdown: 60000,
            notifyAfterInterval: 5000,
            pingInterval: 30000
        };
        var countdownInterval;

        /**
         * Session handler
         * @param {options} options Configuration
         * @constructor
         */
        function SessionHandler(options) {
            config = utils.chain(options)
                .defaults(defaults)
                .mapValues(utils.resolvePortalPlaceholders)
                .value();

            this.isPollingStarted = false;
            this.hasSession = false;
        }

        /**
         * Init Session Timeout
         * @return {object} SessionHandler instance
         */
        SessionHandler.prototype.init = function() {
            var self = this;
            //determines if a valid session previously existed during this page load
            this.validSessionExisted = false;
            //records if a user event has occurred
            this.userEventsOccurred = false;
            //keeps track of consecutive ping fails. helps to detect internet connectivity problems
            this.consecutiveFailCount = 0;
            this.notifyAfterTimeout();
            this.startPolling();

            $(document).on('click.lpTimeout keypress.lpTimeout', function() {
                self.userEventsOccurred = true;
                if(countdownInterval) {
                    self.clearSessionWarning(true);
                }
            });
        };

        SessionHandler.prototype.startPolling = function(interval) {
            window.setTimeout(this.ping.bind(this), interval || config.pingInterval);
        };

        SessionHandler.prototype.validateSession = function() {
            fetch({ url: config.pingUrl + '/validate' })
                .then(this.handleStateResponse.bind(this), this.handleNetworkError.bind(this));
        };

        //xhr to validate and confirm the session. promise contains the remaining session time
        SessionHandler.prototype.reconfirmSession = function() {
            fetch({ url: config.pingUrl, method: 'PUT' })
                .then(this.handleStateResponse.bind(this), this.handleNetworkError.bind(this));
        };

        /**
         * Handle Session Errors
         * @param  {object} error  Error Exception
         */
        SessionHandler.prototype.logError = function(error) {
            log.error('SessionHandler: ', error);
        };

        SessionHandler.prototype.handleNetworkError = function(error) {
            error = error || {};
            this.isPollingStarted = false;

            if(this.validSessionExisted && error.status === 401) {
                //if we get a 401 and a session has existed, its time to logout\
                window.sessionStorage.clear();
                window.sessionStorage.setItem('launchpad.sessionExpired', 'true');
                //important to stop polling before trying to log out.
                this.clearSessionWarning(false, true);
                this.logout();
            } else if(error.status === 0 && error.statusText === 'timeout') {
                //xhr timeout occurs, use consecutive timeouts to detect internet connections problems
                this.consecutiveFailCount++;
                if(this.consecutiveFailCount < 3) {
                    //start counting consecutive failures, ping soon again
                    SessionHandler.clearSessionWarning(false, true);
                    this.startPolling(1000);
                } else {
                    //consecutive failures, show a warning and resume normal pinging
                    this.notifyOfflineWarning();
                    this.startPolling();
                }
            } else if(error.status !== 401) {
                //any other unexpected errors
                this.logError('Unknown error Problem validating session: ' + error.statusText);
                this.startPolling();
            }
        };

        SessionHandler.prototype.handleStateResponse = function(response) {
            this.isPollingStarted = false;

            // check data freshness status and notify the system
            SessionHandler.publishMessage('lpDataFreshnessValidate', (function(data) {
                var flagName = 'TheDataIsMostRecent';
                var status = -1;
                if (!data || !data.hasOwnProperty(flagName)) {
                    status = (data[flagName] === 'false' || data[flagName] === false) ? 1 : 0;
                }
                return status;
            })(response.data));
            // check badges from server
            SessionHandler.publishMessage('lpBadgesGetItems');
            //if the response is a success, we know a valid session has now existed
            this.validSessionExisted = true;

            //reset consecutive fail count and clear offline warning (if any)
            if(this.consecutiveFailCount >= 3) {
                SessionHandler.clearOfflineWarning();
            }
            this.consecutiveFailCount = 0;

            //continue as normal or show timeout warning
            var remaining = response.data.remainingTime * 1000;
            if(remaining > config.startCountdown) {
                //session is healthy
                this.clearSessionWarning();
            } else {
                //session is running out
                this.startSessionWarning(response.data.remainingTime);
            }
        };

        /**
         * Logout function
         */
        SessionHandler.prototype.logout = function() {
            var self = this;
            window.sessionStorage.clear();
            return fetch({
                method: 'POST',
                   url: config.logoutUrl,
                   headers: formHeaders
            })
            .then(function(response) {
                var status = parseInt(response.status, 10);
                if (status >= 200 && status < 300 || status === 304) {
                    // The response returns a document and could be displayed
                    // e.g. document.documentElement.innerHTML = response.data;
                    // but there is an issue with a link so a redirect is used
                    // instead.
                    window.location.href = config.redirectUrl;
                } else {
                    self.logError(response.message);
                }
            });
        };

        SessionHandler.publishMessage = function(channel, data) {
            window.gadgets.pubsub.publish(channel, data);
        };

        //send pubsub message when we might be offline
        SessionHandler.prototype.notifyOfflineWarning = function() {
            SessionHandler.publishMessage('launchpad.add-notification', {
                notification: {
                    id: 'offline-warning',
                    level: 'WARNING',
                    message: 'Experiencing connectivity problems. Please check your internet connection',
                    closable: false
                }
            });
        };

        //pubsub message to clear notifications of offline problems
        SessionHandler.prototype.clearOfflineWarning = function() {
            SessionHandler.publishMessage('launchpad.remove-notification', {
                notification: {
                    id: 'offline-warning'
                }
            });
        };

        //pubsub message when session time is running out. most likely the notifications widget will subscribe to this
        SessionHandler.prototype.notifySessionWarning = function(estimatedTime) {
            SessionHandler.publishMessage('launchpad.add-notification', {
                notification: {
                    id: 'session-timeout',
                    level: 'WARNING',
                    timeLeft: estimatedTime,
                    message: 'Session is about to expire',
                    values: {
                        secondsLeft: estimatedTime
                    },
                    closable: false,
                    links: [{
                        rel: '/timeout/continue',
                        uri: window.location.hash || '#'
                    }]
                }
            });
            //one less second remaining now (unless already 0)
            estimatedTime = estimatedTime >= 1 ? estimatedTime - 1 : 0;
            //perform a ping immediately if we estimate that time has run out
            if(estimatedTime <= 1) {
                this.ping();
            }
            return estimatedTime;
        };

        //starts the session countdown warning
        SessionHandler.prototype.startSessionWarning = function(estimatedSecondsLeft) {
            //the time left is now decremented client side and it is possible it could become out of sync with the
            //server. for this reason it is 'estimated'
            var self = this;
            if(!countdownInterval) {
                estimatedSecondsLeft = self.notifySessionWarning(estimatedSecondsLeft);
                //publishes a warning message every subsequent second
                countdownInterval = window.setInterval(function() {
                    //inform other components of the impending doom.
                    estimatedSecondsLeft = self.notifySessionWarning(estimatedSecondsLeft);
                }, 1000);
                self.startPolling();
            }
        };

        //clears the current session warning (if any)
        SessionHandler.prototype.clearSessionWarning = function(reconfirmSession, stopPinging) {
            if(reconfirmSession) {
                //the ping response will invoke this function again in the else block, clearing the timeout warning
                this.ping(true);
            } else {
                if(countdownInterval) {
                    window.clearInterval(countdownInterval);
                    SessionHandler.publishMessage('launchpad.remove-notification', {
                        notification: {
                            id: 'session-timeout'
                        }
                    });
                    countdownInterval = null;
                }
                if(!stopPinging) {
                    this.startPolling();
                }

            }
        };

        SessionHandler.prototype.ping = function(reconfirm) {
            if (this.isPollingStarted) { return; }
            this.isPollingStarted = true;

            //decide which ping function to perform
            if (reconfirm) {
                this.reconfirmSession();
            } else {
                this.validateSession();
            }
        };

        SessionHandler.prototype.notifyAfterTimeout = function() {
            var sessionExpiredKey = 'launchpad.sessionExpired';

            if(window.sessionStorage.getItem(sessionExpiredKey)) {
                //wait til notifications are likely to have initialized. need a message queue here!
                window.setTimeout(function() {
                    SessionHandler.publishMessage('launchpad.add-notification', {
                        notification: {
                            id: 'session-expired',
                            level: 'INFO',
                            message: 'Your session has expired. Please login again.',
                            closable: true
                        }
                    });
                }, config.notifyAfterTimeoutDuration || 5000);

                window.sessionStorage.removeItem(sessionExpiredKey);
            }
        };

        /*----------------------------------------------------------------*/
        /* Expose configurable getInstance method
        /*----------------------------------------------------------------*/
        return {
            getInstance: function(options) {
                if( utils.isUndefined(instance) ){
                    instance = new SessionHandler(options);
                }
                return instance;
            }
        };
    })();
});
