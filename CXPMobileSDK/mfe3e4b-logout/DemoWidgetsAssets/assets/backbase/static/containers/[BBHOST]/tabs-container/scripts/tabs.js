/*global b$, window, console $*/
(function (b$, window, $) {
    "use strict";

    var NS = b$.bdom.getNamespace('launchpad');
    var DeckContainer = NS.classes.DeckContainer;
    //  ----------------------------------------------------------------
    var Tabs = DeckContainer.extend(function (bdomDocument, node) {
        DeckContainer.apply(this, arguments);
        this.isPossibleDragTarget = false;
    }, {
        localName: 'Tabs',
        namespaceURI: 'launchpad',
        DOMReady: function() {
            DeckContainer.prototype.DOMReady.call(this, arguments);
            var self = this;
            $(this.getDisplay('tab', true)).on('click', function(event) {
                var sId = event.currentTarget.getAttribute('data-id');
                self.setTabSelected(sId);
            });
        },
        setTabSelected: function(sId) {
            this.showPanel(sId);
            //this.updateUrl();
        },

        showPanel: function(panelId){
            var aTabs = this.getDisplay('tab', true);

            for (var i = 0; i < aTabs.length; i++) {
                $(aTabs[i]).removeClass('active');
            }

            $(this.htmlNode).find('.--tab[data-id="'+ panelId +'"]').addClass('active');

            DeckContainer.prototype.showPanel.apply(this, arguments);
        }
    }, {
        template: function (json) {
            var data = {
                item: json.model.originalItem
            };
            var sTemplate = window['templates_' + this.localName][this.localName](data);
            return sTemplate;
        }
    }
);
})(b$, window, $);
