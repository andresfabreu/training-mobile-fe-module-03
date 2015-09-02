/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description: Main Launchpad StartUp Page
 *  ----------------------------------------------------------------
 */
(function(global, portal, launchpad) {
    'use strict';
    var require = window.requirejs; // webpack doesn't know about require(['module-name'])
    launchpad.i18n = {
        mergedFiles: true,
        path: launchpad.staticRoot + '/features/[BBHOST]/config/i18n'
    };

    function run(portalDomModel) {
        require(['base'], function(base) {
            base.startPortal(portalDomModel, portal)
                .then(function() {
                    console.info('Trigger portal ready event');
                    // base.bus.publish('TBD');
                }, function(err) {
                    console.error(err.message);
                });

        });
    }
    document.addEventListener('DOMContentLoaded', function() {
        require(['module-behaviors'], function(behaviors) {
            // add launchpad behaviors
            launchpad.behaviors = behaviors;
            try {
                portal.startup('main', run);
            } catch(err) {
                throw new Error(err);
            }
        });
    });
})(window, window.b$ && window.b$.portal, window.launchpad || {}, undefined);


