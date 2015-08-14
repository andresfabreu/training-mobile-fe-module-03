/* glogals b$ window.gadgets */
define("launchpad/universal/pages/launchpad-page/modules/session-timeout",
    ["jquery"],
    function($) {

        "use strict";

        var util = window.lp && window.lp.util || {};
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Session timeout handling
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Session timeout handling
         * Pings the session endpoint to determine session time remaining.
         * If less than 'startCountdownAt', a timeout warning is initiated.
         * If no time is left, automatic logout
         * User click and keyboard events revalidate the session on every ping, or immediately if the warning is active
         * @param {String} config.sessionEndpoint           Restful endpoint for session. Will send PUTs to this to reconfirm the
         *                                                  session
         * @param {Number} config.startCountdownAt          Time in miliseconds to begin the timeout warning countdown
         * @param {Number} config.sessionCheckInterval      How often to ping to check the remaining session time
         * @param {String} config.logoutUrl                 Url to hitting when auto logging out once the session has expired
         */


        /**
         * SessionTimeoutHandler constructor
         * @constructor
         */
        var SessionTimeoutHandler = function() {

            var self = this;
        };

        /**
         * begins handling the session timeout
         * @param config
         */
        SessionTimeoutHandler.prototype.handleSessionTimeout = function(config) {
            var self = this;

            var log = function(message) {
                if(window.console) {
                    window.console.log(message);
                }
            };

            //configuration params
            this.notifyAfterTimeoutDuration = config.notifyAfterTimeoutDuration || 5000;
            var contextPath = window.b$.portal.config.serverRoot;
            var sessionEndpoint = config.sessionEndpoint || contextPath + "/services/rest/v1/authentication/session";
            var sessionValidateEndpoint =
                config.sessionValidateEndpoint || contextPath + "/services/rest/v1/authentication/session/validate";
            var startCountdownAt = config.startCountdownAt || 60000;
            var sessionCheckInterval = config.sessionCheckInterval || 30000;
            var logoutUrl = config.logoutUrl || (contextPath + "/j_spring_security_logout?portalName=" + window.b$.portal.portalName);

            //determines if a valid session previously existed during this page load
            var validSessionExisted = false;

            //records if a user event has occurred
            var userEventsOccurred = false;

            //keeps track of consecutive ping fails. helps to detect internet connectivity problems
            var consecutiveFailCount = 0;

            //performs a logout
            var logout = function() {
                window.location.href = logoutUrl;
            };

            //xhr to validate the session. promise contains the remaining session time
            var validateSession = function() {
                return $.ajax({
                    url: sessionValidateEndpoint,
                    type: "GET",
                    timeout: 2000,
                    cache: false
                });
            };

            //xhr to validate and confirm the session. promise contains the remaining session time
            var reconfirmSession = function() {
                return $.ajax({
                    url: sessionEndpoint,
                    type: "PUT",
                    timeout: 2000,
                    cache: false
                });
            };

            //send pubsub message when we might be offline
            var notifyOfflineWarning = function() {
                self.publishMessage("launchpad.add-notification", {
                    notification: {
                        "id" : "offline-warning",
                        "level" : "WARNING",
                        "message" : "Experiencing connectivity problems. Please check your internet connection",
                        "closable" : false
                    }
                });
            };

            //pubsub message to clear notifications of offline problems
            var clearOfflineWarning = function() {
                self.publishMessage("launchpad.remove-notification", {
                    notification: {
                        "id" : "offline-warning"
                    }
                });
            };

            //pubsub message when session time is running out. most likely the notifications widget will subscribe to this
            var notifySessionWarning = function(estimatedSecondsLeft) {
                self.publishMessage("launchpad.add-notification", {
                    notification: {
                        "id" : "session-timeout",
                        "level" : "WARNING",
                        "timeLeft" : estimatedSecondsLeft,
                        message: 'Session is about to expire',
                        values: {
                            secondsLeft: estimatedSecondsLeft
                        },
                        "closable" : false,
                        "links" : [{
                            "rel" : "/timeout/continue",
                            "uri" : window.location.hash || "#"
                        }]
                    }
                });

                //one less second remaining now (unless already 0)
                estimatedSecondsLeft = estimatedSecondsLeft >= 1 ? estimatedSecondsLeft - 1 : 0;

                //perform a ping immediately if we estimate that time has run out
                if(estimatedSecondsLeft <= 1) {
                    ping();
                }

                return estimatedSecondsLeft;
            };

            //starts the session countdown warning
            var countdownInterval;
            var startSessionWarning = function(timeLeft) {

                log("Starting session timeout countdown.");

                //the time left is now decremented client side and it is possible it could become out of sync with the
                //server. for this reason it is 'estimated'
                var estimatedSecondsLeft = timeLeft / 1000;
                if(!countdownInterval) {
                    estimatedSecondsLeft = notifySessionWarning(estimatedSecondsLeft);
                    //publishes a warning message every subsequent second
                    countdownInterval = window.setInterval(function() {
                        //inform other components of the impending doom.
                        estimatedSecondsLeft = notifySessionWarning(estimatedSecondsLeft);
                    }, 1000);

                    waitToPing();
                }
            };

            //clears the current session warning (if any)
            var clearSessionWarning = function(reconfirmSession, stopPinging) {

                if(reconfirmSession) {
                    log("Reconfirming session");
                    //the ping response will invoke this function again in the else block, clearing the timeout warning
                    ping(true);
                } else {
                    if(countdownInterval) {
                        log("Cancelling session timeout countdown.");
                        window.clearInterval(countdownInterval);
                        self.publishMessage("launchpad.remove-notification", {
                            notification: {
                                id: "session-timeout"
                            }
                        });
                        countdownInterval = null;
                    }
                    if(!stopPinging) {
                        waitToPing();
                    }

                }
            };

            /**
             * Handles the data freshness status, delivered by the server API
             *
             * Status codes to be returned out:
             * --------------------------------
             * '0': data is in most actual state available
             * '1': data awaits updating from external sources
             *
             * @param response {Object}
             */
            var checkDataFreshnessFlag = function(response) {
                var flag, status;
                var flagName = 'TheDataIsMostRecent';

                if (!response || !response.hasOwnProperty(flagName)) {
                    // no data? no actions!
                    status = -1;
                } else {
                    flag = response[flagName];

                    if (['false', false].indexOf(flag) !== -1) {
                        // data is in updating state
                        status = 1;
                    } else {
                        // data is in most actual state
                        status = 0;
                    }
                }
                return status;
            };

            //pings the server to validate or reconfirm the session
            var pingActive = false;
            var ping = function(reconfirm) {

                //small chance that we forcefully send a ping at the same time one is scheduled by polling.
                if(pingActive) {
                    return;
                }
                pingActive = true;

                //decide which ping function to perform
                var pingFn =  reconfirm ? reconfirmSession : validateSession;
                var promise = pingFn(userEventsOccurred);
                promise.done(function(response) {

                    // check data freshness status and notify the system
                    gadgets.pubsub.publish("lpDataFreshnessValidate", checkDataFreshnessFlag(response));

                    // check badges from server
                    gadgets.pubsub.publish("lpBadgesGetItems");

                    //if the response is a success, we know a valid session has now existed
                    validSessionExisted = true;

                    //reset consecutive fail count and clear offline warning (if any)
                    if(consecutiveFailCount >= 3) {
                        clearOfflineWarning();
                    }
                    consecutiveFailCount = 0;

                    log("Pinging session. " + response.remainingTime + " seconds remain.");

                    //continue as normal or show timeout warning
                    var remaining = response.remainingTime * 1000;
                    if(remaining > startCountdownAt ) {
                        //session is healthy
                        clearSessionWarning();
                    } else {
                        //session is running out
                        startSessionWarning(remaining);
                    }
                });

                //failure conditions
                promise.fail(function(response) {

                    if(validSessionExisted && response.status === 401) {
                        log("Session has expired. Logging out...");
                        //if we get a 401 and a session has existed, its time to logout\
                        window.sessionStorage.clear();
                        window.sessionStorage.setItem("launchpad.sessionExpired", "true");
                        //important to stop polling before trying to log out.
                        clearSessionWarning(false, true);
                        logout();
                    } else if(response.status === 0 && response.statusText === "timeout") {
                        //xhr timeout occurs, use consecutive timeouts to detect internet connections problems
                        consecutiveFailCount++;
                        log(consecutiveFailCount + " consecutive timeouts have occurred when attempting to validate the session");
                        if(consecutiveFailCount <  3) {
                            //start counting consecutive failures, ping soon again
                            clearSessionWarning(false, true);
                            waitToPing(1000);
                        } else {
                            //consecutive failures, show a warning and resume normal pinging
                            notifyOfflineWarning();
                            waitToPing();
                        }
                    } else if(response.status !== 401) {
                        //any other unexpected errors
                        log("Unknown error Problem validating session: " + response.statusText);
                        waitToPing();
                    }
                });
                promise.always(function() {
                    pingActive = false;
                });
            };

            //listen for user events. if a countdown is active then cancel it.
            $(document).on("click.lpTimeout keypress.lpTimeout", function() {
                userEventsOccurred = true;
                if(countdownInterval) {
                    clearSessionWarning(true);
                }
            });

            //sets a timeout to ping the server, also resets the record of user events
            var waitToPing = function(timeToWait) {
                timeToWait = timeToWait || sessionCheckInterval;
                userEventsOccurred = false;
                window.setTimeout(function() {
                    ping(userEventsOccurred);
                }, timeToWait);
            };

            //start the ping polling
            waitToPing();
        };

        SessionTimeoutHandler.prototype.notifyAfterTimeout = function() {

            var self = this;

            var sessionExpiredKey = "launchpad.sessionExpired";
            var sessionExpired = window.sessionStorage.getItem(sessionExpiredKey);
            if(sessionExpired) {

                //wait til notifications are likely to have initialized. need a message queue here!
                window.setTimeout(function() {
                    self.publishMessage("launchpad.add-notification", {
                        notification: {
                            "id" : "session-expired",
                            "level" : "INFO",
                            "message" : "Your session has expired. Please login again.",
                            "closable" : true
                        }
                    });
                }, self.notifyAfterTimeoutDuration || 5000);

                window.sessionStorage.removeItem(sessionExpiredKey);
            }
        };

        /**
         * Wrapper for pubsub publish function
         * @param channel
         * @param data
         */
        SessionTimeoutHandler.prototype.publishMessage = function(channel, data) {
            window.gadgets.pubsub.publish(channel, data);
        };

        /**
         * Starts session timeout handling, user portal page config
         */
        SessionTimeoutHandler.prototype.initializeSessionTimeoutHandling = function() {

            var self = this;

            var portalPage = window.b$.portal.portalView.getElementsByTagName("page")[0];
            var enableSessionTimeout =  util.parseBoolean(portalPage.getPreference("enableTimeout"));

            if(enableSessionTimeout) {
                self.handleSessionTimeout({
                    sessionEndpoint: portalPage.getPreference("sessionEndpoint"),
                    sessionValidateEndpoint: portalPage.getPreference("sessionValidateEndpoint"),
                    logoutUrl: portalPage.getPreference("logoutUrl"),
                    startCountdownAt: portalPage.getPreference("startCountdownAt"),
                    sessionCheckInterval: portalPage.getPreference("sessionCheckInterval"),
                    notifyAfterTimeoutDuration: portalPage.getPreference("notifyAfterTimeoutDuration")
                });
                self.notifyAfterTimeout();
            }
        };

        return {
            getInstance: function() {
                return new SessionTimeoutHandler();
            }
        };
});
