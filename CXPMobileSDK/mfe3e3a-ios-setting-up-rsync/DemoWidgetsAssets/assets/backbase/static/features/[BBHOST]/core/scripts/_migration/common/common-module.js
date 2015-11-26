define(function (require, exports, module) {
    'use strict';

    var base = require('base');

    var deps = [
    ];

    module.exports = base.ng.module('common', deps)
        .constant('httpServicesConfig', {
            defaultConfig: {
                cacheTimeout: 1000,
                xhrTimeout: 5000
            }
        })
        .factory(require('./form-data-persistence'))
        .service(require('./p2p-service'))
        .service(require('./preference-service'))
        .service(require('./profile-contact-service'))
        .service(require('./profile-detail-service'))
        .service(require('./rest-services'));
});
