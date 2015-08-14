define(function(require, exports, module) {
    'use strict';

    module.name = 'ui.modal-dialog';

    var base = require('base');

    module.exports = base.createModule(module.name, [])
        .directive(require('./directives'));
});
