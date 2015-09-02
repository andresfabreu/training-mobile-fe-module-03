define(function (require, exports, module) {
    'use strict';
    var utils = require('base').utils;
    var b$ = window.b$ || {};
    var portal = utils.assign({
        portalView: { getElementsByTagName: function(){ return []; } },
        config: { serverRoot: './' },
        pageName: '',
        pageUUID: '',
        loggedInUserId: ''
    }, b$.portal);
    var bd = utils.assign( {
        designMode: false
    }, window.bd);

    var page = {
        name: portal.pageName,
        id: portal.pageUUID
    };

    var pageClient = portal.portalView.getElementsByTagName('page')[0];
    page.getPreference = function(prop) {
        if (pageClient) {
            return pageClient.getPreference(prop);
        }
    };

    exports.lpPortal = {
        root: portal.config.serverRoot,
        name: portal.portalName,
        page: page,
        defaultLandingPage: portal.config.defaultLandingPage,
        linkId: portal.linkUUID,
        userId: portal.loggedInUserId,
        designMode: bd.designMode === 'true',
        // temporary solution in case that some config value is missing
        // if you use it, console.log the property that is requested
        '_portalConfig': portal.config
        // resourceManager?
        // noDup is not used anywhere
    };
});
