define(function(require, exports, module) {
    'use strict';

    var base = require('base');

    module.name = 'idle-component';

    module.exports = base.createModule(module.name, [])
        .factory(require('./idle'));
});
