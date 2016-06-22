/*global define*/
define(function (require, exports) {
    'use strict';

    // load config list of relations
    var config = require('./config');
    var utils = require('base').utils;

    // main container for subscribers
    var listeners = {};

    /**
     *
     * @memberof core.update
     * @ngProvider
     * @ngInject
     */
    exports.lpCoreUpdate = function () {

        // @ngInject
        this.$get = function () {

            /**
             * Very rough check for the same callbacks already added to the queue
             *
             * @param list
             * @param obj
             * @returns {Boolean}
             * @private
             */
            var checkSameObjectEnlisted = function (list, obj) {
                var res = false;

                if (!utils.isArray(list)) { return res; }

                list.forEach(function (o) {
                    if (o === obj) { res = true; }
                });

                return res;
            };

            /**
             * Get the list of all queues we should apply for a particular name
             *
             * @param name
             * @returns {*}
             * @private
             */
            var getList = function (name) {
                var list, aux, main = 'actions', deps = 'deps';

                if (!name || !(config.hasOwnProperty(main)) || !(config.hasOwnProperty(deps))) { return false; }

                list = config[main][name] || [];
                aux = config[deps][name] || [];

                return utils.chain(list).union(aux).uniq().value();
            };

            /**
             * Invoke all callbacks for a single queue
             *
             * @param name
             * @private
             */
            var invokeSingleQueue = function (name) {

                var queue = listeners[name];
                if (!queue || !utils.isArray(queue) || queue.length < 1) { return; }

                queue.forEach(function (callback) {
                    try {
                        callback();
                    } catch (error) {
                        // TODO: lpCoreError.captureException(error);
                        throw new Error(error);
                    }
                });
            };

            /**
             * Go through the list of queues and initiate invoking
             *
             * @param list
             * @private
             */
            var invokeQueues = function (list) {
                if (!list || !utils.isArray(list) || list.length < 1) { return; }

                list.forEach(function (name) {
                    invokeSingleQueue(name);
                });
            };

            /**
             * Add listener to proper widget's queue
             *
             * @example
             * Subscribing at an update event within the widget's controller:
             *
             * ```
             * var invoker = function() {
             *   ctrl.widgetModel.load();
             * };
             *
             * lpCoreUpdate.subscribe(widget.name, invoker);
             * ```
             *
             * @memberof core.update.lpCoreUpdate
             * @param   {String}    name
             * @param   {Function}  callback
             * @returns {Undefined}
             */
            var subscribe = function (name, callback) {
                if (!name || typeof callback !== 'function') { return; }

                // create new queue (if needed)
                if (!listeners.hasOwnProperty(name)) { listeners[name] = []; }

                if (!checkSameObjectEnlisted(listeners[name], callback)) {
                    listeners[name].push(callback);
                }
            };

            /**
             * Invoke callbacks for this particular event name
             *
             * @example
             * Triggering update event:
             *
             * ```
             * var eventName = widget.name;
             * lpCoreUpdate.trigger(eventName);
             * ```
             *
             * @memberof core.update.lpCoreUpdate
             * @param   {String}    name
             * @returns {Undefined}
             */
            var trigger = function (name) {
                if (name) { invokeQueues(getList(name)); }
            };

            return {
                subscribe: subscribe,/* (name, callback) */
                trigger: trigger /* (sourceEventName) */
            };

        };
    };

});
