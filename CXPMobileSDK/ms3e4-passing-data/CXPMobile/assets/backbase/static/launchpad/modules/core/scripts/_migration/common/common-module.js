define(function (require, exports, module) {
    'use strict';

    var base = require('base');
	var user = require('../user/user-module');

    var deps = [
    	user.name
    ];

	module.exports = base.ng.module('common', deps)
		.constant('httpServicesConfig', {
	        defaultConfig: {
	            cacheTimeout: 1000,
	            xhrTimeout: 5000
	        }
	    })
        .directive(require('./element-resize'))
		.factory(require('./form-data-persistence'))
		.service(require('./p2p-service'))
		.service(require('./preference-service'))
		.service(require('./profile-contact-service'))
		.service(require('./profile-detail-service'))
		.service(require('./rest-services'));
});
