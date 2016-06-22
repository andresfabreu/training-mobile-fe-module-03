define(function(require, exports, module) {
    'use strict';

    var utils = require('base').utils;
    var $ = require('jquery');

    // @ngInject
    exports.lpIdleTracker = function($timeout) {
        var handler;
        var interimStepDuration = 1000;
        var $win = $(window);

        // Factory
        var IdleMaker = function (options) {

            /**
             * Notify outer system about internal state
             *
             * @param eventName
             * @param arg
             */
            var notify = function (eventName, arg) {
                $win.triggerHandler(eventName, arg);
            };

            /**
             * Add list of events to DOM element
             *
             * @param element
             * @param list {Array}
             * @param fn {Function}
             */
            var addEvents = function (element, list, fn) {
                list.forEach(function (type) {
                    if ('attachEvent' in element) {
                        // Old IEs
                        element.attachEvent('on' + type, fn);
                    } else {
                        // New Browsers
                        element.addEventListener(type, fn);
                    }
                });
            };

            /**
             * Remove list of events from DOM element
             *
             * @param element
             * @param list {Array}
             * @param fn {Function}
             */
            var removeEvents = function (element, list, fn) {
                list.forEach(function (type) {
                    if ('attachEvent' in element) {
                        // Old IEs
                        element.detachEvent('on' + type, fn);
                    } else {
                        // New Browsers
                        element.removeEventListener(type, fn);
                    }
                });
            };

            /**
             * Timer work: Interim step of counting down.
             * Function is bind to Idle
             *
             * @param restart {Boolean}
             */
            var interimStep = function (restart) {
                var that = this;

                // remove previous timer promise
                $timeout.cancel(this.timer);

                if (restart) {
                    this.interval = this.options.intervalMin * 60 * 1000;
                } else {
                    this.interval -= interimStepDuration;
                }

                // Notify about how many seconds remain
                notify(this.options.notifyEventName, this.interval / 1000);

                if (this.interval > 0) {
                    // Here we go again
                    this.timer = $timeout(interimStep.bind(that), interimStepDuration);
                } else {
                    // Leaving tracker
                    this.inActivityHappened();
                }
            };

            /**
             * Main CONSTRUCTOR
             *
             * @param o
             * @constructor
             */
            var Idle = function (o) {

                // Default list of events we treat as an 'activity'
                this.events = [
                    'click',
                    'keypress',
                    'keydown',
                    'keyup',
                    'mousemove',
                    'mousedown',
                    'mousewheel',
                    'wheel',
                    'DOMMouseScroll',
                    'MSPointerDown',
                    'MSPointerMove',
                    'touchstart',
                    'touchmove',
                    'touchend'
                ];

                // Extend config options
                this.options = utils.assign({
                    intervalMin: 1,
                    element: document,
                    eventName: 'lp:idle:reaction',
                    notifyEventName: 'lp:idle:notification'
                }, o || {});

                this.element = this.options.element;
                this.interval = this.options.intervalMin * 60 * 1000;
                this.events = utils.isArray(this.options.events) ? this.events.concat(this.options.events) : this.events;
            };

            /**
             * Initialize idle checker
             */
            Idle.prototype.init = function () {
                var that = this;

                // get reference to activity handler
                handler = this.activityHappened.bind(this);

                // initial reset
                this.reset();

                // add events listeners from the list
                addEvents(this.element, this.events, handler);

                // start timeout
                this.timer = $timeout(interimStep.bind(that), interimStepDuration);
            };

            /**
             * User made something... restarting timer
             */
            Idle.prototype.activityHappened = function () {
                var that = this;

                // re-start sequence
                $timeout(interimStep.bind(that, true), interimStepDuration);
            };

            /**
             * We can't wait any more...
             */
            Idle.prototype.inActivityHappened = function () {

                // remove listeners
                this.reset();

                // trigger inactivity custom event
                notify(this.options.eventName);
            };

            /**
             * Removing all tracker events
             */
            Idle.prototype.reset = function () {
                removeEvents(this.element, this.events, handler);
            };

            return new Idle(options);
        };

        return IdleMaker;
    };
});
