/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 */

'use strict';

var utils = global.utils;

module.exports  = function(config) {

     config = config || {
        name: 'widget-profile-details',
        title: 'Profile - Details'
    };

    var widget = this;
    widget.name = config.name;
    widget.title = config.title;

    /**
     * Test elements
     */
    widget.body = utils.getWidgetElement(config);
    widget.profileImage = widget.body.element(by.css('.details-image img'));
    widget.profileDetails = widget.body.element(by.css('.details-container .details-inner:nth-child(2)'));
    widget.profileActivity = widget.body.element(by.css('.details-container .details-inner:nth-child(3)'));

    /**
     * Wait For Widget To be Loaded
     */
    widget.waitForWidgetToLoad = function() {
        utils.waitForElement(widget.profileImage);
    };

    /**
     * Check profile image visibility
     */
    widget.profileImageIsVisible = function() {
        return widget.profileImage.isDisplayed();
    };

    /**
     * Get profile details text
     */
    widget.getProfileDetails = function() {
        return widget.profileDetails.getText();
    };

    /**
     * Get profile activity text
     */
    widget.getProfileActivity = function() {
        return widget.profileActivity.getText();
    };

};
