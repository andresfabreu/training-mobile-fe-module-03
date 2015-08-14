define(function(require, exports, module) {
    'use strict';

    module.name = 'component.widget-budgets-gridly';
    var base = require('base');
    var deps = [];

    require('./libs/jquery.gridly');

    module.exports = base.createModule(module.name, deps);
});
