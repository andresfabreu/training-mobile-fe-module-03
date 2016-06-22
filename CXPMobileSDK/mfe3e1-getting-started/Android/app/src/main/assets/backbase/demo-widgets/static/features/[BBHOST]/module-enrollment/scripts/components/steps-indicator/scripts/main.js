define(function(require, exports, module) {
    'use strict';

    var base = require('base');

    module.name = 'steps-indicator';

    module.exports = base.createModule(module.name, [])
        .directive(require('./steps-indicator'));
});
