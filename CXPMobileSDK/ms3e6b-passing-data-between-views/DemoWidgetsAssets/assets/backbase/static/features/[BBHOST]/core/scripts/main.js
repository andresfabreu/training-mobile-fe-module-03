/**
 * Launchpad Core module contains commonly used APIs for all Launchpad modules.
 *
 * @usage
 * ###Install
 * 1. Install core module:
 *
 * ```
 * bower i core --save
 * ```
 *
 * 2. Add `core` as a dependency of your angular module:
 *
 * ```
 * // main.js
 * var core = require('core');
 * var deps = [
 *   ...
 *   core.name,
 *   ...
 * ];
 *
 * module.exports = base.createModule(module.name, deps);
 * ```
 *
 * ###Develop
 *
 * ```
 * git clone ssh://git@stash.backbase.com:7999/LPM/foundation-core.git
 * cd core
 *
 * bower install && bblp start
 * ```
 *
 * ###Testing
 *
 * ```
 * bblp test
 * ```
 *
 * ###Build
 *
 * ```
 * bblp build
 * ```
 *
 * @name core
 * @ngModule
 */
define(function (require, exports, module) {

    'use strict';

    module.name = 'core';

    var base = require('base');
    var i18n = require('./modules/i18n/main');
    var bus = require('./modules/bus/main');
    var portal = require('./modules/portal/main');
    var http = require('./modules/http/main');
    var utils = require('./modules/utils/main');
    var cache = require('./modules/cache/main');
    var error = require('./modules/error/main');
    var update = require('./modules/update/main');
    var store = require('./modules/store/main');
    var template = require('./modules/template/main');
    var configuration = require('./modules/configuration/main');

    // To be migrated.
    var commonDeprecated = require('./_migration/common/common-module');

    module.exports = base.createModule( module.name, [
        update.name,
        portal.name,
        utils.name,
        i18n.name,
        bus.name,
        cache.name,
        http.name,
        error.name,
        store.name,
        template.name,
        configuration.name,
        // To be migrated.
        commonDeprecated.name
    ]);

});
