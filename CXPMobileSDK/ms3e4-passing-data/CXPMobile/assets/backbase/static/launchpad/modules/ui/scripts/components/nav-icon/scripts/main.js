define(function(require, exports, module) {
    'use strict';

    var base = require('base');

    module.name = 'ui.nav-icon';

    module.exports = base.createModule(module.name, [])
        .directive(require('./directives'));
});
