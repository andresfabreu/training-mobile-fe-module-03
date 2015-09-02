/**
 * Helper angular methods.
 * @module ng
 */
define(function(require, exports, module) {

    'use strict';

    /**
     * Executes angular digest on the given scope
     * if it's not already being executed.
     * Then invokes the function `fn`.
     *
     * @memberof core.utils.lpCoreUtils
     * @param   {Object}  scope  Check digest phase in given `scope`
     * @param   {Function} fn  Function to execute
     */
    exports.safeApply = function safeApply(scope, fn) {
        var phase = scope.$root.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            fn();
        } else {
            scope.$apply(fn());
        }
    };
});
