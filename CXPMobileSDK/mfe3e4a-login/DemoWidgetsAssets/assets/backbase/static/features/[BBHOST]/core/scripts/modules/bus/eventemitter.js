/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : eventemitter.js
 *  Description: A simple event emitter factory to use in any module
 *  ----------------------------------------------------------------
 */

define(function(require, exports, module) {
    'use strict';

    function indexOf(listeners, listener) {
        var idx = listeners.length;
        var value;

        while (idx--) {
            value = listeners[idx][0];
            if (value === listener || (value.listener && value.listener === listener)) {
                return idx;
            }
        }

        return -1;
    }

    function defined(thing) {
        return typeof thing !== 'undefined';
    }

    /**
     * Executes each of the listeners in order with the supplied arguments.
     * @param   {String} event Name of the event
     * @returns {Object}       Chainable methods
     */
    function emit(event) {
        var listeners = this.listeners(event).slice();
        var singleArg = arguments.length === 1;
        var slice = Array.prototype.slice;
        var idx = 0;
        var len = listeners.length;

        for ( ; idx < len; idx++) {
            if (singleArg) {
                if (defined(listeners[idx][1])) {
                    listeners[idx][0].call(listeners[idx][1]);
                }
                else {
                    listeners[idx][0]();
                }
            } else {
                listeners[idx][0].apply(listeners[idx][1], slice.call(arguments, 1));
            }
        }

        return this;
    }

    function EventEmitter() {}

    EventEmitter.prototype = {
        /**
         * Adds an `event` `listener` to the end of the listeners array for
         * the specified `event`.
         * @param   {String}   event    Name of the event
         * @param   {Function} listener Handler to be added
         * @param   {Object}   thisp    Object to be bound to the listener
         * @returns {Object}            Chainable methods
         */
        on: function(event, listener, thisp) {
            var listeners = this.listeners(event);

            if (indexOf(listeners, listener) < 0) {
                listeners.push([listener, thisp]);
            }

            return this;
        },

        /**
         * Removes a `listener` from the listener array for that `event`. If the
         * `listener` is not provided removes all the listeners for that `event`.
         * @param   {String}   event    Name of the event
         * @param   {Function} listener Handler to be removed
         * @returns {Object}            Chainable methods
         */
        off: function(event, listener) {
            if (!arguments.length) {
                this.events = null;
                return this;
            } else if (arguments.length === 1) {
                if (this.events.hasOwnProperty(event)) {
                    this.events[event] = null;
                }
                return this;
            }

            var listeners = this.listeners(event);
            var listenerIndex = indexOf(listeners, listener);

            if (listenerIndex >= 0) {
                listeners.splice(listenerIndex, 1);
            }

            return this;
        },

        emit: emit,

        /**
         * Alias for emit
         * {Function}
         */
        trigger: emit,

        /**
         * Adds a one time `listener` for the `event`.
         * @param   {String}   event     Name of the event
         * @param   {Function} listener  Handler to be added
         * @param   {Object}   thisp     Object to be bound to the listener
         * @returns {Object}             Chainable method
         */
        once: function(event, listener, thisp){
            var self = this;

            function one() {
                listener.apply(this, arguments);
                self.off(event, one);
            }

            one.listener = listener;
            this.on(event, one, thisp);

            return this;
        },

        /**
         * Returns an array of listeners for the specified `event`.
         * @param   {String} event  Name of the event
         * @returns {Array}
         */
        listeners: function(event) {
            var events = this.events || (this.events = {});

            return events[event] || (events[event] = []);
        }
    };

    EventEmitter.create = function() {
        return new EventEmitter();
    };

    /**
     * Adds event emitter functionality to `target`.
     * @param  {Object} target Object to be mixed
     */
    EventEmitter.mixin = function(target) {
        var props = ['on', 'off', 'emit', 'trigger', 'once', 'listeners'];

        for (var i = props.length; i--; ) {
            target[props[i]] = EventEmitter.prototype[props[i]];
        }
    };

    module.exports = EventEmitter;
});
