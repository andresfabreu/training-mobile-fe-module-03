/*globals b$ console gadgets */
define("launchpad/universal/pages/launchpad-page/modules/server-client-push",[
    "launchpad/lib/common/util",
    "launchpad/support/atmosphere/atmosphere"
], function(util, atmosphere) {

    "use strict";

	//safe log function
	function log(message) {
		if(window.console) {
			window.console.log(message);
		}
	}
	function warn(message) {
		if(window.console && window.console.warn) {
			window.console.warn(message);
		}
	}

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Server Client Push Controller
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Module for hooking up with backend push service
     * Creates requests, and maintains a list of subscription requests
     *
     * @param {String} config.contentType               The requests content-type
     * @param {String} config.url                       The URL to connect to (base is host/portalserver)
     * @param {String} config.logLevel                  Values allowed: "info", "debug", "test"
     * @param {String} config.transport                 The transport method to use between the client and the server
     * @param {String} config.fallbackTransport         Transport method to use if the initial transport is not available
     * @param {Boolean} config.trackMessageLength       Track the size of the received request
     * @param {Boolean} config.enableXDR                Enable XDR encoding
     * @param {Number} config.timeout                   The max time for a connection to stay open when no messages are sent or received
     * @param {Function} config.onMessage               Callback function to execute once a message has been received
     * @param {Function} config.onOpen                  Callback function to execute once a connection with the back end has been established
     * @param {Function} config.onClose                 Callback function to execute once a connection with the back end has been terminated
     * @param {Function} config.onClientTimeout         Callback function to execute once a connection has timed out
     * @param {Function} config.onError                 Callback function to execute if an error occurs
     * @param {Function} config.onTransportFailure      Callback function to execute if the chosen form of transport fails
     *
     */

    /**
     * Initializes a ServerClientPushConroller object
     * @constructor
     */
    var ServerClientPushController = function() {

        var self = this;
        /**
         * List of requests already registered
         */
        self.registeredRequests = [];

        /**
         * Atmosphere Object
         */
        self.socket = atmosphere;

        /**
         * Possibilites for data trasnport protocols
         * @enum
         */
        self.transportProtocols = {

            websocket: "websocket",
            polling: "polling",
            longPolling: "long-polling",
            streaming: "streaming",
            jsonp: "jsonp",
            sse: "sse"
        };


        /**
         * Collection of functions as default atmosphere config functions
         */
        self.atmoFunctions = {

            onOpen: function(response) {

                log("Opening server push connection using " + response.request.transport);
            },

            onClose: function() {
                log("Server push connection closed.");
            },

            onClientTimeout: function(request) {

                log("Server push connection timed out. Reconnecting in " + request.reconnectInterval);
                setTimeout(function() {

                    self.socket.subscribe(request);
                }, request.reconnectInterval);
            },

            onError: function(response) {
                warn("Problem with server push connection - " + response.status);
            },

            onTransportFailure: function(response) {
                warn("Server push has failed with the chosen transport method");
            }
        };
    };

    /**
     * Register subscription request with server and add to registeredRequests
     * @param request
     */
    ServerClientPushController.prototype.registerNewRequest = function(request) {

        var self = this;

        var subSocket = self.socket.subscribe(request);
        self.registeredRequests.push(subSocket);

    };

    /**
     * Creates a new request object to subscribe to backend service
     * @param config
     */
    ServerClientPushController.prototype.createNewRequest = function(config) {

        var self = this;

        /**
         * see https://github.com/Atmosphere/atmosphere/wiki/jQuery.atmosphere.js-atmosphere.js-API
         * for more configuration options
         */
        var request = {
            url: util.getServicesPath() +  config.url,
            contentType: config.contentType || "application/json",
            logLevel: config.logLevel || "info",
            transport: config.transport || self.transportProtocols.websocket,
            fallbackTransport: config.fallbackTransport || self.transportProtocols.longPolling,
            trackMessageLength: true,
            reconnectInterval : 0,
            enableXDR: config.enableXDR || false,
            timeout: config.timeout || 300000,
            onMessage: config.onMessage,
            onOpen: config.onOpen || self.atmoFunctions.onOpen,
            onClientTimeout: config.onClientTimeout || self.atmoFunctions.onClientTimeout,
            onError: config.onError || self.atmoFunctions.onError,
            onTransportFailure: config.onTransportFailure || self.atmoFunctions.onTransportFailure,
            onClose: config.onClose || self.atmoFunctions.onClose
        };

        return request;
    };

    /**
     * Creates a new sub request object
     * @param messageChannel The relative url of the event
     * @param callback Function to execute when sub receives a message
     * @param config
     */
    ServerClientPushController.prototype.createAndRegisterNewRequest = function(messageChannel, callback, config) {

        var self = this;

        config = config ? config : {};

        config.url = messageChannel;
        config.onMessage = callback;

        var request = self.createNewRequest(config);
        self.registerNewRequest(request);
    };

    /**
     * Clears the list of registered sub requests
     */
    ServerClientPushController.prototype.clearRegisteredRequests = function() {

        var self = this;

        self.registeredRequests = [];
    };

    /**
     * dummy function for implementation purposes
     * @param messageChannel the url of the channel to subscribe to
     * @param message an object containing the message data
     */
    ServerClientPushController.prototype.publishServerMessage = function(messageChannel, message) {

        var self = this;

        for(var i = 0; i < self.registeredRequests.length; i++) {
            if(self.registeredRequests[i].request.url === util.getContextPath() + messageChannel) {
                //this request is subscribed to this channel
                self.registeredRequests[i].request.onMessage(message);
            }
        }
    };

    /**
     * Initializes the connection to the back end
     * @param url event URL
     * @param config request configuration object
     */
    ServerClientPushController.prototype.init = function(url, config) {

        var self = this;

        //if the user is not logged in, return out of the function
        if(window.b$.portal.loggedInUserId === "null") {
            return;
        }

        //check page preferences to see whether to switch server push on or not
        var portalPage = b$.portal.portalView.getElementsByTagName("page")[0];
        var enableServerPush = util.parseBoolean(portalPage.getPreference("enableServerPush"));

        if(enableServerPush) {
            self.createAndRegisterNewRequest(url, function(response) {
                if(response.responseBody) {
                    var eventDetails = JSON.parse(response.responseBody);
                    gadgets.pubsub.publish("launchpad-retail:" + eventDetails.event, {}, true);
                }
            }, config);
        }
    };


    return {
        getInstance: function() {
            return new ServerClientPushController();
        }
    };
});
