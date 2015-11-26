define(function(require, exports, module) {
    'use strict';

    /** Bus singleton instance */
    var instance;

    /**
     * Creates an interface to the bus.
     * @param {Object} channel The channel where messages will be sent / received.
     * @param {Object} bus     The wrapped bus.
     */
    function ConfigureChannel(channel, bus) {
        this.bus = bus;
        this.channel = channel;
    }

    /**
     * Start to listen for an event in the channel, if the
     * event is published the handler will be called.
     *
     * @param  {String}   event   Name of the subscribed event.
     * @param  {Function} handler Listener to that event, it receives
     *                            the data object as the first parameter.
     */
    ConfigureChannel.prototype.subscribe = function subscribe(event, handler) {
        this.channel.flush(event, handler);

        this.bus.subscribe({
            channel: this.channel.name,
            event: event,
            handler: handler
        });

        return this;
    };

    /**
     * Stops to listen for an event in the channel, if the
     * `handler` is provided removes it from the listeners list.
     *
     * @param  {String}   event   Name of the subscribed event.
     * @param  {Function} handler Listener to that event.
     */
    ConfigureChannel.prototype.unsubscribe = function unsubscribe(event, handler) {
        this.channel.reset(event);

        this.bus.unsubscribe({
            channel: this.channel.name,
            event: event,
            handler: handler
        });

        return this;
    };

    /**
     * Publish an `event` into the channel providing a data
     * `object` if required.
     *
     * @param  {String} event  Name of the event to be published.
     * @param  {Object} data   Optional data will be passed.
     */
    ConfigureChannel.prototype.publish = function publish(event, data) {
        this.bus.publish({
            channel: this.channel.name,
            event: event,
            data: data
        });

        this.channel.push(event, data);

        return this;
    };

    /**
     * [broadcast description]
     * @returns {*}
     */
    ConfigureChannel.prototype.broadcast = function broadcast() {

    };

    /**
     * Holds a reference to the queue to the configured `channel`.
     *
     * @param {String} name   The name of the channel.
     * @param {Object} queues The hash of the channel queues.
     */
    function Channel(name, queues) {
        this.name = name;
        this.queues = queues;
    }

    /**
     * Add a new published `event` in the channel queue.
     *
     * @param  {String} event Event name.
     * @param  {*} data       The data published.
     */
    Channel.prototype.push = function push(event, data) {
        if (!this.queues.hasOwnProperty(event)) {
            this.queues[event] = [];
        }
        this.queues[event].push(data);
    };

    /**
     * Flushes all the `event` queue processing the handler for every item.
     *
     * @param  {String}   event    Event name.
     * @param  {Function} handler  Subscribed listener.
     */
    Channel.prototype.flush = function flush(event, handler) {
        var queue = this.queues[event];
        if (!queue.length) {
            return;
        }

        this.queues[event] = queue = queue.concat();
        var current;
        while((current = queue.shift())) {
            handler(current);
        }
    };

    /**
     * [reset description]
     * @param event
     * @param handler
     * @returns {*}
     */
    Channel.prototype.reset = function reset(event, handler) {};


    /**
     * A system to allow different objects of the app communicate
     * each other passing messages bound to an event. Implements
     * the mediator pattern. It allows to create channels to avoid
     * event naming collisions.
     */
    function Bus() {
        /** {Object} Stores the channel queues */
        this.channels = {};
    }

    /**
     * Creates communication channel that can be used to interface the bus.
     *
     * @param   {String} channel The `channel` name.
     * @returns {Object} Returns the interface to the bus.
     */
    Bus.prototype.getChannel = function(channel) {
        if (!this.channels.hasOwnProperty(channel)) {
            this.channels[channel] = [];
        }
        return new ConfigureChannel(new Channel(channel, this.channels[channel]), this);
    };

    /**
     * Subscribe a handler to an `event` in a `channel`.
     * @example
     *  bus.subscribe({
     *      channel: 'account',
     *      event: 'card.add',
     *      handler: function(card) { //... }
     *  });
     *
     * @param  {Object} object The arguments object containing the `channel`, `event` and `handler`.
     */
    Bus.prototype.subscribe = function subscribe(object) {

    };

    /**
     * Unsubscribe a handler to an `event` in a `channel`.
     * @example
     *  bus.unsubscribe({
     *      channel: 'account',
     *      event: 'card.add',
     *      handler: function(card) { //... }
     *  });
     *
     * @param  {Object} object The arguments object containing the `channel`, `event` and `handler`.
     */
    Bus.prototype.unsubscribe = function unsubscribe(object) {

    };

    /**
     * Publish an `event` in a `channel`, optionally passing some `data`.
     * @example
     * ```
     * bus.publish({
     *   channel: 'account',
     *   event: 'card.add',
     *   data: { number: //... }
     * });
     * ```
     * @param  {Object} object The arguments object containing the `channel`, `event` and `data`.
     */
    Bus.prototype.publish = function publish(object) {

    };

    /**
     * [broadcast description]
     * @param object
     * @returns {*}
     */
    Bus.prototype.broadcast = function broadcast(object) {

    };

    module.exports = function() {
        if (!instance) {
            instance = new Bus();
        }

        return instance;
    };
});
