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
        .factory(require('../../_deprecated/scripts/form-data-persistence'))
        .service(require('../../_deprecated/scripts/preference-service'))
        .service(require('../../_deprecated/scripts/profile-detail-service'))
        .service(require('./p2p-service'))
        .service(require('./rest-services'));
});
