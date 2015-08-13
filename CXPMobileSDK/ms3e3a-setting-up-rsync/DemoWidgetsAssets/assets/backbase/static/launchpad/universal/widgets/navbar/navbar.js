/*global window, define , be, b$, bd, lp, pageUuid */

/**
 * Copy of out of the box navigation, with a few tweaks
 *
 * Copyright 2011 Backbase B.V.
 * \@author DI (FH) Jouk Plater \ [jouk.plater@backbase.com]
 */
define(["jquery"], function ($) {
    "use strict";

    /**
     * @const
     * @type {string}
     */
    var WARNING_HTML =
        "<div class='alert alert-block'>" +
            "<h4>Warning!</h4>" +
            "<p>This navigation bar's root menu couldn't be found.</p>" +
        "</div>";

    /**
     * @param widget
     * @constructor
     */

    var NavBar = function (widget) {
        this.widget = widget;
        this.$widget = $(widget.body);
    };

    NavBar.prototype.init = function () {
        var self = this;

        if (bd.designMode === "true") {

            /*
             * If this is the first initialization we need to
             */
            if (!this.widget.model.getPreference("navShow")) {
                var navRoot = this.widget.model.getPreference('navRoot') || "navroot_mainmenu";
                be.utils.ajax({
                    url: b$.portal.config.serverRoot + "/portals/" + b$.portal.portalName + "/links/" + navRoot + ".xml",
                    dataType: "xml",
                    cache: false,
                    success: function (responseData) {
                        var json = bd.xmlToJson({xml: responseData});
                        var defaultUid = json.link.uuid;
                        self.widget.model.setPreference("navShow", defaultUid);
                        self.widget.model.save();
                        self.widget.refreshHTML();
                    }
                });
            }
            /*
             * If in design mode and default root link is set will load a static html and replace the widget-body with the loaded html
             * -> it is only replaced if it is empty
             */
            else if (this.$widget.find(".bp-g-model").children().is(":empty")) {
                be.utils.ajax({
                    url: b$.portal.config.serverRoot + "/portals/" + b$.portal.portalName + "/widgets/" + this.widget.model.name + ".html",
                    cache: false,
                    success: function (responseHTML) {
                        var html = $(responseHTML).find(".bp-g-model").children().is(":empty") ?
                            WARNING_HTML : $(responseHTML).find(".bp-widget-body").contents();
                        self.$widget.html(html);
                    }
                });
            }
        }


        /*
         * decoupling the obtrusive event handler from the template
         * activate the current navigation item by comparing the URL with the anchors href and setting a bootstrap class
         */
        var $navLinks = self.$widget.find(".nav a[data-uuid]").off();
        $navLinks.on("click", function () {
                return be.Nav.URLHandler(this);
            }).filter(function () {
                return $(this).attr("data-uuid") === window.b$.portal.pageUUID;
            }).parent().addClass("active");

        self.$widget.find("ul.navbar-nav > li:first-child > a").html("<i class='lp-icon lp-icon-house'></i><span class='sr-only'>Home</span>");

        self.$widget.find(".navbar-toggle").on("click", function () {
            var navbarCollapse = self.$widget.find(".navbar-collapse"),
                isCollapsed = navbarCollapse.css('display') === 'none';

            navbarCollapse.css('display', isCollapsed ? 'block' : 'none');

        });
    };

    return function(widget) {
        var widgetWrapper = new NavBar(widget);
        widgetWrapper.init();
        return widgetWrapper;
    };
});
