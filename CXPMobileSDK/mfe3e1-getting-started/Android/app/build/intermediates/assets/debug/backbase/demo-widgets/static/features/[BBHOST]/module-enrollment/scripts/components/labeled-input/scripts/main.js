define(function(require, exports, module) {
    'use strict';

    var base = require('base');

    module.name = 'labeled-input';

    module.exports = base.createModule(module.name, [])
        .factory( require('./util') )
        .directive(require('./labeled-input'));
});
