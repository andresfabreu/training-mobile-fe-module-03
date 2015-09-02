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
        name: 'widget-video',
        title: 'Video'
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
            widget.chrome = res.chrome;
            widget.body = res.body;
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
