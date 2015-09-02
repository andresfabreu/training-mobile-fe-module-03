define(function(require, exports, module) {

    'use strict';

    module.name = 'widget-profile-summary.component.last-login';

    var base = require('base');
    var core = require('core');

    var deps = [
        core.name
    ];

    module.exports = base.createModule(module.name, deps)
        .directive( require('./directives') );
});
