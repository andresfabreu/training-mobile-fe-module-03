/**
 * @deprecated will be removed in LP v0.13.x
 */
define( function (require, exports, module) {

    'use strict';

    module.name = 'core-deprecated';

    var base = require('base');

    var deps = [];

    module.exports = base.createModule(module.name, deps)
        .service(require('./profile-contact-service'))
        .service(require('./profile-detail-service'))
        .service(require('./preference-service'));
});
