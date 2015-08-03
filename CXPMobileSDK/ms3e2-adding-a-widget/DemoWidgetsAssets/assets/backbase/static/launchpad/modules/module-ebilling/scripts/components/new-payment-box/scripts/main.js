define(function(require, exports, module) {
    'use strict';

    module.name = 'new-payment-box';

    var base = require('base');
    var core = require('core');
    var ui = require('ui');

    var deps = [
        core.name,
        ui.name
    ];

    module.exports = base.createModule(module.name, deps)
        .directive(require('./lp-new-payment-box'))
        .directive(require('./lp-onetime-transfer'))
        .directive(require('./lp-payment-date-box'));
});
