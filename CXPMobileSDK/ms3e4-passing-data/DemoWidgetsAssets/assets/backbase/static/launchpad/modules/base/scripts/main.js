/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: Base library for creating Launchpad components/widgets/modules
 *  ----------------------------------------------------------------
 */
define(function(require, exports, module) {

    'use strict';

    var NS = 'lp'; // Modules Namespace

    var root = window;
    // angular from window, it doesn't export
    require('angular');

    var angular = root.angular;
    // base utils
    var utils = require('./utils');
    /*----------------------------------------------------------------*/
    /* Public
    /*----------------------------------------------------------------*/
    exports.start = function(el) {
        // _startPortal(el);
        // _initSession();
        // _connectSocket('ws://localhost:9999');
    };

    exports.createModule = function(name, deps) {
        name = [NS, name].join('.');
        return angular.module(name, deps);
    };

    exports.bootstrap = function(el, deps) {
        return angular.bootstrap(el, deps);
    };

    // export base utils
    exports.utils = utils;
    // export angular
    exports.ng = angular;

    exports.requireWidget = root.requireWidget || require('./require-widget');
});
