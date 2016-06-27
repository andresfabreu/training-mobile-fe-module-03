define(function(require, exports, module) {
    'use strict';

    module.name = 'ui.color-picker';

    var base = require('base');

    var deps = [];

    module.exports = base.createModule(module.name, deps)
        .constant( require('./constants') )
        .directive( require('./directives') );
});
