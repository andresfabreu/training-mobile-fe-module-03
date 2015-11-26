/**
 * NOT IMPLEMENTED
 * @name session
 * @memberof core
 * @ngModule
 */

define(function(require, exports, module) {
    'use strict';

    module.name = 'core.session';
    var base = require('base');
    var deps = [];

    function sessionProvider() {
        this.$get = function() {
            var API = {};

            /**
             * Creates a new session based on the `options`.
             *
             * @param  {Object} options
             */
            API.create = function(options) {};

            /**
             * Refresh the timeout session
             */
            API.refresh = function() {};

            /**
             * Destroys the current session
             */
            API.destroy = function() {};
        };
    }

    module.exports = base.createModule(module.name, deps)
        .provider('lpCoreSession', sessionProvider);
});
