/*global bd, lp, gadgets, window, console, jQuery */
(function($, lp) {

    "use strict";

    var selector = ".bp-tCont-tab a.bp-tCont-link";

    var targetingModel;

	function parseBoolean(val) {

		return (typeof val === "boolean" && val) ||
			(typeof val === "string" && /\s*true\s*/i.test(val)) ||
			(typeof val === "number" && val !== 0);
	}

    var callback = function(event) {

        if(!parseBoolean(bd.designMode)){
            return;
        }

        if(this.nodeName === "TCont") {
            targetingModel = this.model;//.childNodes;
            return;
        }

        var widget = this;


        setTimeout(function() {

            if(targetingModel) {
                var selectedTC = targetingModel.attributes[6].nodeValue;

                for(var i = 0; i < targetingModel.childNodes.length; i++) {
                    if(selectedTC === targetingModel.childNodes[i].name) {
                        if(targetingModel.childNodes[i].childNodes[0].name === widget.id) {
                            widget.updateBackground();
                        }
                    }
                }

                var $buttons = $(document).find(selector);

                $buttons.on("click", function() {

                    var thisDataId = this.text === "*" ? 0 : parseInt(this.text, 10);


                    if(targetingModel.childNodes[thisDataId].childNodes[0].name === widget.id) {
                        widget.updateBackground();
                    }
                });
            }
        }, 2000);
    };

    /**
     * Export
     */
    window.lp = window.lp || {};
    window.lp.retail = window.lp.retail || {};
    window.lp.retail.portalManagerBehaviors = {
        behaviors: {
            "DOMNodeInsertedIntoDocument": callback
        }
    };
})(jQuery, lp);
