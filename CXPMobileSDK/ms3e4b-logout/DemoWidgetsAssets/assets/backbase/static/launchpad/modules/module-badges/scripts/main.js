define(function (require, exports, module) {
    'use strict';

    module.name = 'module-badges';

    var base = require('base');
    var core = require('core');

    var badgesComponent = require('./components/lp-badges/scripts/main');

    var deps = [
        core.name,
        badgesComponent.name
    ];

    return base.createModule(module.name, deps)
        .factory(require('./badges-resource'))
        .factory(require('./badges-controller'));
});
