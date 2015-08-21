/*global b$, bd, lp, gadgets */
(function(b$, $) {

    "use strict";

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Portal extensions
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var NS = b$.bdom.getNamespace("http://backbase.com/2013/portalView");
    var BackbaseWidget = NS.getClass("backbaseWidget");

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
            this.parentNode.tagName === "LauncherContainer" && //parent is a launcher
            (this.getPreference("area") === "2" || this.getPreference("area") === "3") && //its in the launcher sidebar
            this.getPreference("widgetChrome").indexOf("chrome-tab") > -1; //it has a tab chrome

        if(!postponeDisplay) {
            this._displayed = true;
            this.constructor.superClass.prototype.createDisplay.call(this);
        }
    };

	BackbaseWidget.prototype.getPreferenceFromParents = function(name) {

        var getPreference = function(name, node) {
            var val;
            if(node.getPreference && node.tagName !== "application") {
                val = node.getPreference(name);
                if(!val && node.parentNode) {
                    val = getPreference(name, node.parentNode);
                }
            }
            return val;
        };

        return getPreference(name, this);
    };

    var extendChromePrefs = function () {

        var addLaunchpadChromes = {
            handlers: {
                "preferences-form": function (evt) {
                    var widget = evt.detail.context;
                    var prefs = b$.portal.portalModel.filterPreferences(widget.model.preferences.array);

                    for (var i = 0; i < prefs.length; i++) {
                        if (prefs[i].name === "widgetChrome" && (!prefs[i].inputType.options||prefs[i].inputType.options.length === 0)) {
                            prefs[i].inputType.name = "select-one";
                            prefs[i].inputType.options = bd.uiEditingOptions && bd.uiEditingOptions.widgetPreferenceSelections ? bd.uiEditingOptions.widgetPreferenceSelections.widgetChrome : [];
                        }
                    }
                    // return the event with extra data on the prefsModel
                    evt.detail.customPrefsModel = prefs;
                }
            }
        };
        b$.mixin(BackbaseWidget, addLaunchpadChromes);
    };

	//expose
    window.lp = window.lp || {};
    window.lp.portalExtensions = [];
    window.lp.portalExtensions.push(extendChromePrefs);

})(b$, jQuery);
