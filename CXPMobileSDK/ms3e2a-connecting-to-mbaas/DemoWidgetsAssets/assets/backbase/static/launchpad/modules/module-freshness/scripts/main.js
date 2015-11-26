define( function (require, exports, module) {
    'use strict';

    module.name = 'module-freshness';

    var base = require('base');
    var core = require('core');

    var lpFreshnessMessage = require('./components/lp-freshness-message/scripts/main');

    var deps = [
        core.name,
        lpFreshnessMessage.name
    ];

    module.exports = base.createModule(module.name, deps)
        .factory(require('./factories'));
});
