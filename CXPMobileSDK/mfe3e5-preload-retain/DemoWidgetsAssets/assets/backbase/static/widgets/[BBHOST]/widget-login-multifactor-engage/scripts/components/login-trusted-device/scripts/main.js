/**
 * @module widget-login-multifactor
 * @version 1.0.0
 * @file components/login-trusted-device description
 * @copyright Backbase Amsterdam
 *
 * @example
 * <div lp-trusted-device="lp-trusted-device"></div>
 */

define( function (require, exports, module) {
    'use strict';

    module.name = 'components.login-trusted-device';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');

    var deps = [
        core.name,
        ui.name
    ];

    module.exports = base.createModule(module.name, deps)
        .factory( require('./factories') )
        .directive( require('./directives') );
} );
