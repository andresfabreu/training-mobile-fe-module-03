define(function (require, exports, module) {
    'use strict';

    module.name = 'module-charts';

    var base = require('base');
    var deps = [];

    return base.createModule(module.name, deps)
        .directive(require('./_migration/bar-chart'))
        .directive(require('./_migration/line-chart'));
});
