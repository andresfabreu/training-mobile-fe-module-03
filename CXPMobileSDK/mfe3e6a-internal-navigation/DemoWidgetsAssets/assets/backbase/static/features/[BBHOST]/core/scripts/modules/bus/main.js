/**
 * A mediator object that implements
 * the <a href="http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern" target="_blank">pub/sub pattern</a>.
 * Any object can publish an event, optionally passing some data
 * in a channel, and all the subscribed listeners to that
 * event in that channel will be called in order.
 *
 * @copyright Backbase B.V.
 * @author Backbase R&D - Amsterdam - New York
 *
 * @name bus
 * @memberof core
 * @ngModule
 */

define(function(require, exports, module) {
    'use strict';

    module.name = 'bus';
    var base = require('base');
    var deps = [];

    module.exports = base.createModule(module.name, deps)
        .provider(require('./provider'));
});
