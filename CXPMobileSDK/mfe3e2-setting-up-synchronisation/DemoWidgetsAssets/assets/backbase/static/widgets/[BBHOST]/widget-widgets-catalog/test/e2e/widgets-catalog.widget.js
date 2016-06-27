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
        name: 'widget-catalog',
        title: 'Catalog'
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
            widget.body   = res.body;
            widget.items  = widget.body.all(by.css('.lp-catalog-row .lp-catalog-item'));
            widget.dimples  = widget.body.all(by.css('.lph-slides-pagination li'));

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

    /**
     * Checking the number of widgets in the catalog (36 widgets)
     * @return {[type]}
     */
    widget.widgetsCount = function() {       
        return widget.items.count();
    };

    /**
     * [hasPagination description]
     * @return {Boolean}
     */
    widget.dimplesCount = function() {
       return widget.dimples.count();
    };




};
