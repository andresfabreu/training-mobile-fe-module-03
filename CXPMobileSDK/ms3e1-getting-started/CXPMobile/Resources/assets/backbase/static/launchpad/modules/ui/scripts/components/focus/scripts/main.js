define(function(require, exports, module) {
    'use strict';

    var base = require('base');

    module.name = 'ui.focus';

    module.exports = base.createModule(module.name, [])
        .directive(require('./directives'))
        .factory(require('./services'));

});
