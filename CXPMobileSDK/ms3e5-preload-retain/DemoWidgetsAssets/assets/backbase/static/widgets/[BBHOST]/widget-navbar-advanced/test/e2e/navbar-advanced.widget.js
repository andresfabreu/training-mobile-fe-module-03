/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : login.widget.js
 *  Description:
 *  ----------------------------------------------------------------
 */

'use strict';

var utils = global.utils;

module.exports  = function(config) {

     config = config || {
        name: 'widget-navbar',
        title: 'Navigation Bar'
    };

    var widget = this;
    widget.name = config.name;
    widget.title = config.title;
    /**
     * Prepare all elements
     * @return {promise} Return widget.elements
     */
    widget.get = function() {
        var d = utils.q.defer();
        utils.getWidget(widget.title).then(function(res) {
            widget.body = res.body;
            widget.chrome = res.chrome;
            d.resolve(widget);
        });
        return d.promise;
    };
    /**
     * The widget should be visible on the page
     * @return {Boolean}
     */
    widget.isVisible = function() {
        return widget.body.isDisplayed();
    };

};
