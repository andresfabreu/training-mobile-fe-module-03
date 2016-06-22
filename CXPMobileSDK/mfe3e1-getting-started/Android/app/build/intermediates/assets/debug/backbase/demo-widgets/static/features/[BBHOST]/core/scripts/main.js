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
    var bus = require('./modules/bus/main');
    var cache = require('./modules/cache/main');
    var configuration = require('./modules/configuration/main');
    var error = require('./modules/error/main');
    var http = require('./modules/http/main');
    var i18n = require('./modules/i18n/main');
    var portal = require('./modules/portal/main');
    var store = require('./modules/store/main');
    var template = require('./modules/template/main');
    var update = require('./modules/update/main');
    var utils = require('./modules/utils/main');
    var widget = require('./modules/widget/main');

    var migration = require('./_migration/common/common-module');
    var deprecated = require('./_deprecated/scripts/main');

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
        widget.name,

        // To be migrated
        migration.name,

        // Migrated and moved to depreacted, will be removed in next breaking release
        deprecated.name
    ]);

});
