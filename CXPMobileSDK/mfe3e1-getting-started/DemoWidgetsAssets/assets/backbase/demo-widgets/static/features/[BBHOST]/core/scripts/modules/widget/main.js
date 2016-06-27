/**
 * Core widget module provides services lpWidget and value widget into application
 * @name widget
 * @memberof core
 * @ngModule
 */

define(function(require, exports, module) {
    'use strict';

    module.name = 'core.widget';
    var base = require('base');
    var deps = [];

    module.exports = base.createModule(module.name, deps)
        .provider(require('./providers'));
});
