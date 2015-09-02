/*globals global, module, element, by*/
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
        name: 'launcher-deck-container',
        className: 'lp-lc',
        title: 'Launcher Deck Container'
    };

    var container = this;

    container.name = config.name;
    container.className = config.className;
    container.title = config.title;


    /**
     * Prepare all elements
     * @return {promise} Return container.elements
     */
    container.get = function() {
        var d = utils.q.defer();
        utils.getContainer(config.name).then(function(res) {
            var el = res.body;

            container.body = el;
            container.content = el.element(by.css('.lp-lc--content'));
            container.leftSidebar = el.element(by.css('.lp-lc--left'));
            container.tabs = container.leftSidebar.element(by.css('>li'));
            container.overlay = element('#lp-launcher-overlay');
            container.panels = el.all(by.css('.lp-launcher-tab'));;

            // console.log(container.tabs);
            d.resolve(container);
        });
        return d.promise;
    };


    /**
     * The container should be visible on the page
     * @return {Boolean}
     */
    container.isVisible = function() {
        return container.body.isDisplayed();
    };

    /**
     * Open Panel
     * @return promise
     */
    container.openPanel = function(text) {
        return container.body.element(by.cssContainingText('.lp-launcher-tab-text', text)).click();
    };

    // /**
    //  * The full name of the logged in user
    //  * @return {string}
    //  */
    // container.profileName = function() {
    //     var username = container.body.element(by.binding('model.preferredName'));
    //     return username.getText();
    // };

    // /**
    //  * Click on Profile Link
    //  * @return {[type]} [description]
    //  */
    // container.openProfile = function() {
    //     var usernameLink = container.body.element(by.css('.lp-profile-summary-username'));
    //     usernameLink.click();
    // };

    //clicking on New Transfer panel on Home page (Retail banking portal)
    container.openNewTransferPanel = function() {
        var newTransferPanel = container.body.element(by.css('a[href="#panel-container-791882"]'));
        newTransferPanel.click();
    };
    //get open panel
    container.isNewTransferPanelOpen = function() {
        var openPanel = container.body.element(by.css('.lp-launcher-area.widget.widget-default.lp-launcher-area-main.active'));
        return openPanel.isDisplayed();
    };
    container.isSignUpPanelOpen = function() {
        var openPanel = container.body.element(by.css('.lp-launcher-area.widget.widget-default.lp-launcher-area-mainhidden.active'));
        return openPanel.isDisplayed();
    };

    //clicking on Send To Friend panel on Home page (Retail banking portal)
    container.openSendToFriendPanel = function() {
        var newTransferPanel = container.body.element(by.css('a[href="#panel-container-278098"]'));
        newTransferPanel.click();
    };
    // container.logout = function() {
    //     //
    // };
};
