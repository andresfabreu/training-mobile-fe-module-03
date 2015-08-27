/**
 * @requires module:base
 * @requires module:core
 * @requires module:ui
 *
 * @example Require Widget
 * // add this in the index.html
 * window.requireWidget( __WIDGET__ ,'scripts/index');
 */

define(function (require, exports, module) {

    'use strict';

    module.name = 'widget-estatement-list';

    /**
     * Dependencies
     */
    var base = require('base');
    var core = require('core');
    var ui = require('ui');

    // Resources
    var estatement = require('module-estatements');

    var deps = [
        core.name,
        ui.name,
        estatement.name
    ];

    // @ngInject
    function run(lpWidget, lpEstatements) {
        lpEstatements.setConfig({
            'estatementListEndpoint': lpWidget.getPreference('estatementListEndpoint'),
            'estatementEnrollmentEndpoint': lpWidget.getPreference('estatementEnrollmentEndpoint')
        });
    }

    module.exports = base.createModule(module.name, deps)
        .controller( require('./controllers') )
        .run( run );
});
