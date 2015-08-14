/*globals window, console, jQuery, $ , launchpad, b$, bd, lp, gadgets*/
(function(window, bd, $) {

    "use strict";

    window.lp = window.lp || {};
    window.lp.SpringboardBehaviors = (function() {

        /**
         * Callback for handling the Perspective modified event
         * @param {Object} evt the triggered event
         */
        var onPerspectiveModified = function(evt){

            try {
                var perspective = evt.newValue;
                var $widget = $(evt.target.htmlNode);
                var $area = $widget.closest(".lp-springboard-area-holder");

                this._resetPerspectiveClasses($widget, $area);

                if(perspective === "Widget") {
                    this._restore($widget, $area);
                } else if(perspective === "Minimized") {
                    this._minimize($widget);
                } else if(perspective === "Maximized") {
                    this._maximize($widget, $area);
                }
                evt.stopPropagation();
            } catch (e) {
                window.console.log("Unable to set perspective: " + e.message);
            }
        };

        return {
            behaviors: {
                "PerspectiveModified": onPerspectiveModified
            }
        };

    })();
})(window, bd, jQuery);
