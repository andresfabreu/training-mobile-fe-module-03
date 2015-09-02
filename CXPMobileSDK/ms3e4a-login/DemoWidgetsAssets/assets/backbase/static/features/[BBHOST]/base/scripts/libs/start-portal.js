/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - Launchpad
 *  Filename : start-portal.js
 *  Description: Start portal
 *      - get the portal preferences and
 *      - initialize session timeout handler
 *  ----------------------------------------------------------------
 *  @todo - connect Session options with portal preferences
 *  @todo - use base modules like (utils, portal, page)
 */

define(function(require, exports, module) {

    'use strict';

    var utils = require('../modules/utils/main');
    var fetch = require('../modules/async/fetch');
    var Session = require('../modules/session/session-handler');


    // @TODO replace with a parser form utils
    var parseXml = function(xml) {
        var oldXmlParser = window.be && window.be.xmlToJson;
        return oldXmlParser({xml: xml});
    };

    /**
     * Start Launchpad portal
     * @param  {object} portalDomModel b$-DomModel
     * @param  {object} portal         Portal configuration
     * @return {object}                Promise object
     */
   module.exports = function StartPortal(portalDomModel, portal) {
         // @TODO replace with page module
        var page = portal.portalView.getElementsByTagName('page')[0];
        var initSession = function(portalPref) {
            var options = {
                    // sessionUrl: portalPref.sessionEndpoint,
                    // pingUrl: portalPref.sessionValidateEndpoint,
                    // logoutUrl: portalPref.logoutUrl,
                    // startCountdown: portalPref.startCountdownAt,
                    // pingInterval: portalPref.sessionCheckInterval,
                    // notifyAfterTimeoutDuration: portalPref.notifyAfterTimeoutDuration
            };
            if( JSON.parse(page.getPreference('enableTimeout'))) {
                Session.getInstance(options).init();
            }
        };

        /**
         * @TODO use portal module
         */
        var getPortalPreferences = function() {
            var url = [ portal.config.serverRoot, 'portals', portal.portalName + '.xml?pc=false'].join('/');
            var transformResponse = function(data) {
                var jsonData = parseXml(data);
                // Add it to portal.config
                portal.config = utils.chain(jsonData.portal.properties)
                        .mapValues('value')
                        .mapKeys(function(v, k){
                           return utils.camelCase(k);
                        })
                        .assign(portal.config)
                        .value();
                return portal.config;
            };
            return fetch({
                url: url,
                responseType: 'document',
                transformResponse: transformResponse
            }).then(function(response) {
                return response.data;
            });
        };

        return getPortalPreferences(portal)
                .then(initSession);
    };

});
