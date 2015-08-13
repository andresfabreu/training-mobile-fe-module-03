define(function (require, exports, module) {
    'use strict';

    var base = require('base');
    var util = window.lp && window.lp.util; // to be refactored

    var deps = [ ];

    var userModule = base.ng.module('user', deps);

    // not needed for standalone
    if(window.b$ && util){
        userModule
            .constant('loginStorageConfig', {
                userId: 'launchpad.userId',
                userData: 'launchpad.userData'
            })
            .constant('loginConfig', {
                loginUrl: util.getServicesPath() + '/j_spring_security_check',
                logoutUrl: util.getServicesPath() + '/j_spring_security_logout?portalName=' + window.b$.portal.portalName,
                successPage: null
            })
            .directive(require('./profile-image'))
            .service(require('./login-service'));
    }

    module.exports = userModule;

});
