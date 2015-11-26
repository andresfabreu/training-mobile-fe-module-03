/**
 * Gadget Factory
 * Wrapper around Gadget Library
 */
define(function (require, exports) {

    'use strict';

    exports.Gadgets = function($window) {
        return ($window.gadgets) ? $window.gadgets : {};
    };
});
