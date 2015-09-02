/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 */

'use strict';

var utils = global.utils;

module.exports = function(config) {

    config = config || {
        name: 'widget-profile-portfolio',
        title: 'Profile - Portfolio'
    };

    var widget = this;
    widget.name = config.name;
    widget.title = config.title;

    /**
     * Test elements
     */
    widget.body = utils.getWidgetElement(config);
    widget.content = widget.body.element(by.css('.lp-widget-content.widget-body'));

    /**
     * Wait For Widget To be Loaded
     */
    widget.waitForWidgetToLoad = function() {
        utils.waitForElement(widget.content);
    };

    /**
     * Get profile portfolio text
     */
    widget.getContentText = function() {
        return widget.content.getText();
    };
};
