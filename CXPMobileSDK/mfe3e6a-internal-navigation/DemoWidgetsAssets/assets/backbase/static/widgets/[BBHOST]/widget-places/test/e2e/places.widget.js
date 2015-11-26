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
        name: 'widget-places',
        title: 'Places'
    };

    var widget = this;

    widget.name = config.name;
    widget.title = config.title;

    /**
     * Test elements
     */
    widget.body = utils.getWidgetElement(config);
    widget.searchInput = widget.body.element(by.css('div.search-input input'));
    widget.servicesButton = widget.body.element(by.css('div[dropdown="dropdown"] button'));
    widget.servicesList = widget.body.element(by.css('div[dropdown="dropdown"] button'));
    widget.tabs = widget.body.element(by.css('ul.nav-tabs'));
    widget.placesList = widget.body.element(by.css('ul.list-group'));
    widget.placesListItems = widget.placesList.element(element.all(by.css('li.list-group-item')));
    widget.map = widget.body.element(by.css('div.map_canvas'));

    /**
     * Wait For Widget To be Loaded
     */
    widget.waitForWidgetToLoad = function() {
        utils.waitForElement(widget.searchInput);
    };

    /**
     * Open Services list
     */
    widget.openServicesList = function() {
        widget.servicesButton.click()
    };

    /**
     * Check Services list visibility
     */
    widget.servicesListIsVisible = function() {
        return widget.servicesList.isDisplayed();
    };

    /**
     * Check map visibility
     */
    widget.mapIsVisible = function() {
        return widget.map.isDisplayed();
    };

    /**
     * Check places List visibility
     */
    widget.placesListIsVisible = function() {
        return widget.placesList.isDisplayed();
    };

    /**
     * Get places List item
     */
    widget.getPlacesListItem = function(value) {
        return widget.placesList.element(by.css("li.list-group-item:nth-child(" + value + ")"));
    };

    /**
     * Search for location
     */
    widget.search = function(value) {
        widget.searchInput.sendKeys(value);
        widget.searchInput.sendKeys(protractor.Key.ENTER)
    };

    /**
     * Get Search value
     */
    widget.getSearchValue = function() {
        return widget.searchInput.getAttribute('value');
    };

    /**
     * Open location widget tab
     */
    widget.openLocationTab = function(value) {
        widget.tabs.element(by.css("span[translate='" + value + "']")).click();
    };
};
