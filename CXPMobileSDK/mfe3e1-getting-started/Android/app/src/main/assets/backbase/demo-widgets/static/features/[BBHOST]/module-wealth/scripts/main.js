define(function (require, exports, module) {
    'use strict';

    var base = require('base');
    var utils = require('./utils');
    var models = require('./models');

    module.name = 'module-wealth';

    var deps = [];

    module.exports = base.createModule(module.name, deps)
        .constant('utils', base.utils)
        .constant('wealthUtils', utils)
        .provider(require('./providers'))
        .factory(models.factories);
});
