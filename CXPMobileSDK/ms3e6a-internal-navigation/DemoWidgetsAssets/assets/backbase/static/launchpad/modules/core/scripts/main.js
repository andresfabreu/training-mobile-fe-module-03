define(function (require, exports, module) {

    'use strict';

    module.name = 'core';

    var base = require('base');
    var i18n = require('./modules/i18n/main');
    var bus = require('./modules/bus/main');
    var http = require('./modules/http/main');
    var utils = require('./modules/utils/main');
    var cache = require('./modules/cache/main');
    var error = require('./modules/error/main');
    var update = require('./modules/update/main');
    var store = require('./modules/store/main');
    var template = require('./modules/template/main');
    var configuration = require('./modules/configuration/main');

    // To be migrated.
    var commonDeprecated = require('./_migration/common');

    module.exports = base.createModule( module.name, [
        update.name,
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
