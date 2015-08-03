define(function(require, exports, module) {
    'use strict';

    module.name = 'ui-lp-freshness-message';

    var base = require('base');

    var deps = [
    ];

    module.exports = base.createModule(module.name, deps)
        .directive(require('./lp-freshness-message'));
});

