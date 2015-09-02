define(function(require, exports, module) {
    'use strict';

    module.name = 'ui.placeholder';

    var base = require('base');

    // Plugin needed for placeholder
    require('./libs/jquery.placeholder');

    var deps = [];

    module.exports = base.createModule(module.name, deps)
        .directive( require('./directives') );
});
