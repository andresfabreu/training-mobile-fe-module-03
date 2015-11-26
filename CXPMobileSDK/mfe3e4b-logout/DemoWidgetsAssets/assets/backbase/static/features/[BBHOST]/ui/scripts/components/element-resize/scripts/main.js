define(function(require, exports, module) {
    'use strict';

    module.name = 'ui.element-resize';

    var base = require('base');

    var deps = [];

    module.exports = base.createModule(module.name, deps)
        .directive( require('./directives') );
});

