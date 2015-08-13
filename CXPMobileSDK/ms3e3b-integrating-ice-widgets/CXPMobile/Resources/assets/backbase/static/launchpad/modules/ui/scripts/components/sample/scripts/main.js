define(function(require, exports, module) {
    'use strict';

    module.name = 'ui.sample';

    var base = require('base');
    var core = require('core');

    module.exports = base.createModule(module.name, [
        core.name
    ])
    .directive(require('./directives'));
});
