/* glogals b$ */
define('launchpad/universal/pages/launchpad-page/modules/skip-links',[
    'jquery'
], function($) {

    'use strict';

    var SkipLinksController = function() {
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Skip Links Controller
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var self = this;

        var console = window.console,
            b$ = window.b$,
            util = window.lp && window.lp.util || {};


        SkipLinksController.prototype.createSkipLinks = function() {

            var SKIP_LINK_PROPERTY = 'skipLink';

            var items = b$.portal.portalView.all,
                containerEl = $('<div id="skip-link" class="skip-link"></div>');

            var addSkipLink = function(id, text, $htmlNode) {

                // If target element has no ID, try to create a unique one,
                // and use both in anchor & target element.
                if (!id) {
                    id = $htmlNode.attr('id');

                    if (!id) {
                        id = $htmlNode.attr('data-pid') + '-' + (+new Date());
                        $htmlNode.attr('id', id);
                    }
                }

                // Create skip link
                var anchorEl = $('<a class="sr-only" href="#' + id + '">' + text + '</a>');

                // Fix for chrome bug: Does not auto-focus target element.
                // https://code.google.com/p/chromium/issues/detail?id=37721
                var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                if (isChrome) {
                    var targetEl = $('#' + id), hasTabindex = true;

                    anchorEl.on('click', function() {
                        var tabindex = targetEl.attr('tabindex');
                        hasTabindex = (typeof tabindex !== 'undefined' && tabindex !== false);

                        if ( !hasTabindex ) {
                            targetEl.attr('tabindex', '-1');
                        }
                        targetEl.focus();
                    });

                    targetEl.on('blur', function() {
                        if (!hasTabindex) {
                            targetEl.removeAttr('tabindex');
                        }
                    });
                }

                containerEl.prepend(anchorEl);
            };

            // Create the container element.
            $('body').prepend(containerEl);

            // Find all items with the skip link property.
            for (var item in items) {
                if (items.hasOwnProperty(item)) {
                    var currentItem = items[item],
                        attributes = currentItem.attributes;

                    for (var i = 0, n = attributes.length; i < n; i++) {
                        var attribute = attributes[i];

                        if (attribute.name === SKIP_LINK_PROPERTY) {
                            if (attribute.value) {

                                // Use property's value as link text and item's id as anchor point
                                // Also, pass the actual html node in case id must be generated.
                                addSkipLink(currentItem.id, attribute.value, $(currentItem.htmlNode));
                            }
                            break;
                        }
                    }
                }
            }
        };

        SkipLinksController.prototype.initializeSkipLinks = function() {
            var portalPage = b$.portal.portalView.getElementsByTagName("page")[0];
            var enableSkipLinks = util.parseBoolean(portalPage.getPreference("enableSkipLinks"));

            if (enableSkipLinks) {
                self.createSkipLinks();
            }
        };
    };

    return new SkipLinksController();
});
