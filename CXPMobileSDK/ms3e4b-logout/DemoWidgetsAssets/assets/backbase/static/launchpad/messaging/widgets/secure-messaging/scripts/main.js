define(function(require, exports, module) {
    'use strict';

    module.name = 'secure-messaging';

    var base = require('base');
    var ui = require('ui');
    var core = require('core');

    var users = require('module-users');

    var deps = [
        core.name,
        ui.name,
        users.name
    ];

    module.exports = base.createModule(module.name, deps)
        .factory(require('./factories'))
        .service(require('./services'))
        .controller(require('./controllers'))
        .directive(require('./directives'));
});
