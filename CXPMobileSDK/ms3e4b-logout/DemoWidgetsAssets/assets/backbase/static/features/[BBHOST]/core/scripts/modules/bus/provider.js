/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : provider.js
 *  Description: Bus Provider
 *  ----------------------------------------------------------------
 */

define(function(require, exports, module) {

    'use strict';

    var EventEmitter = require('./eventemitter');

    /**
     * NOTE: If `windows.gadgets.pubsub` is available, this service is just a wrapper around it.
     *
     * All event names should include the source of the event and the type of event separated by a colon character.
     *
     * @memberof core.bus
     * @ngProvider
     */
    exports.lpCoreBus = function() {

        this.setChannel = function(options) {

        };

        // @ngInject
        this.$get = function() {
            /**
             * @alias core.bus.lpCoreBus
             */
            var API = {};
            var emitter = EventEmitter.create();

            if (window.gadgets && window.gadgets.pubsub) {
                return window.gadgets.pubsub;
            }

            /**
             * Adds the specified event listener for the specified event.
             * Allows subscription to the events published by other Launchpad modules / widgets.
             *
             * @example
             * ```
             * bus.subscribe('someEvent', function (data) {
             *   console.log('Event has published with:', data);
             * });
             * ```
             *
             * @param name {String} Event name
             * @param callback {Function} Listener
             * @returns {Undefined}
             */
            API.subscribe = function(name, callback) {
                emitter.on(name, callback);
            };

            /**
             * Publishes the specified event.
             * Allows publishing of events that other modules / widgets can subscribe to.
             *
             * @example
             * ```
             * var handler = function (arg1, arg2) {
             *   console.log('Event has published', arg1, arg2);
             * };
             *
             * bus.subscribe('someEvent', handler);
             * bus.publish('someEvent', 'Hello', {foo: 'bar'}); // Event has published, Hello, {foo: "bar"}
             * ```
             *
             * @param name {String} Event name
             * @returns {Undefined}
             */
            API.publish = function (name/*, argument1, ..., argumentN*/) {
                emitter.emit.apply(emitter, arguments);
            };

            /**
             * Unsubscribes callback function from the event published by other Launchpad modules / widgets.
             *
             * @example
             * ```
             * var handler = function () {
             *   console.log('Event has published');
             * };
             *
             * bus.subscribe('someEvent', handler);
             * bus.publish('someEvent'); // Event has published
             *
             * bus.unsubscribe('someEvent', handler);
             * bus.publish('someEvent'); // Nothing happened here
             * ```
             *
             * @param name {String} Event name
             * @param callback {Function} Listener
             * @returns {Undefined}
             */
            API.unsubscribe = function(name, callback) {
                emitter.off(name, callback);
            };

            /**
             * Provides the internal eventemitter to use separetely from the bus itself.
             * It is useful sometimes to emit and listen events between cooperating objects.
             *
             * Available only if `window.gadgets.pubsub` is not available.
             *
             * @example
             * For that you can create a new eventemitter:
             * ```
             * var emitter = lpCoreBus.EventEmitter.create();
             *
             * emitter.on('warning', function(message) {
             *   console.log(message);
             * });
             *
             * emitter.emit('warning', 'Lorem ipsum');
             * ```
             *
             * @example
             * or you can mix the eventemitter methods right into the object
             * and use them as it were part of the original object:
             * ```
             * var alerts = {
             *   show: function (message) {
             *     ...
             *     this.emit('show', message);
             *   }
             * };
             *
             * lpCoreBus.EventEmitter.mixin(alerts);
             * ```
             */
            API.EventEmitter = EventEmitter;

            return API;
        };
    };

});
