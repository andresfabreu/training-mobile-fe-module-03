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

    exports.lpCoreBus = function() {

        this.setChannel = function(options) {

        };

        // @ngInject
        this.$get = function() {
            var API = {};
            var emitter = EventEmitter.create();

            if (window.gadgets && window.gadgets.pubsub) {
                return window.gadgets.pubsub;
            }

            API.subscribe = function(name, callback) {
                emitter.on(name, callback);
            };

            API.publish = function (name/*, argument1, ..., argumentN*/) {
                emitter.emit.apply(emitter, arguments);
            };

            API.unsubscribe = function(name, callback) {
                emitter.off(name, callback);
            };

            API.EventEmitter = EventEmitter;

            return API;
        };
    };

});
