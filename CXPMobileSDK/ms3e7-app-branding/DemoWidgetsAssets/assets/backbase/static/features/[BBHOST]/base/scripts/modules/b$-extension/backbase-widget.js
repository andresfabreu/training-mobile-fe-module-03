/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - Launchpad
 *  Filename : backbase-widget.js
 *  Description: Extending BackbaseWidget Class
 *  ----------------------------------------------------------------
 */

 /* eslint-disable */
(function(b$) {

    'use strict';
    if(typeof b$ !== 'function') { return false; } // running in standalone mode

    var NS = b$.bdom.getNamespace('http://backbase.com/2013/portalView');
    var BackbaseWidget = NS.getClass('backbaseWidget');

    /**
     * Overrides widget default buildDisplay to postpone actual displaying for launcher container tab style widgets
     * @param {Boolean} forceDisplay prevents the display from postponement mechanism working. Use this, when the
     *                               widget should actually be displayed
     */

    BackbaseWidget.prototype.createDisplay = function(forceDisplay) {

        this._displayed = this._displayed || forceDisplay;

        //boolean expr to check if we should postpone displaying (until the tab is clicked)
        var postponeDisplay =
            !bd.designMode && // Disable lazy loading in Portal Manager
            !this._displayed && //not already displayed
            this.parentNode.tagName === 'LauncherContainer' && //parent is a launcher
            (this.getPreference('area') === '2' || this.getPreference('area') === '3') && //its in the launcher sidebar
            this.getPreference('widgetChrome').indexOf('chrome-tab') > -1; //it has a tab chrome

        if(!postponeDisplay) {
            this._displayed = true;
            this.constructor.superClass.prototype.createDisplay.call(this);
        }
    };

    BackbaseWidget.prototype.getPreferenceFromParents = function(name) {

        var getPreference = function(name, node) {
            var val;
            if(node.getPreference && node.tagName !== 'application') {
                val = node.getPreference(name);
                if(!val && node.parentNode) {
                    val = getPreference(name, node.parentNode);
                }
            }
            return val;
        };

        return getPreference(name, this);
    };


})(window.b$);
