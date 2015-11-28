/*global b$, window */
(function () {
    "use strict";
    var Container = b$.bdom.getNamespace('http://backbase.com/2013/portalView').getClass('container');
//  ----------------------------------------------------------------
    var Div_soy = Container.extend(function (bdomDocument, node) {
        Container.apply(this, arguments);
        this.isPossibleDragTarget = true;
    }, {
        localName: 'PageLayoutContainer',
        namespaceURI: 'launchpad'
    }, {
        template: function(json) {
            var data = {item: json.model.originalItem};
            var sTemplate = window['templates_' + this.localName][this.localName](data);
            return sTemplate;
        }
    });
})();
