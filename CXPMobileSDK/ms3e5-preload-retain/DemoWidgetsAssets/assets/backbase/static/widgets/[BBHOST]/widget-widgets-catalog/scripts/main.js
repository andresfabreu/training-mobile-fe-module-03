define(function(require, exports, module){

    'use strict';

    module.name = 'widgets-catalog';
    var base = require('base');
    var core = require('core');

    require('./libs/jquery.slides.min'); // jquery plugin

    var deps = [
        core.name
    ];

    // @ngInject
    function run(WidgetCatalog, widget) {
        var widgetWrapper = new WidgetCatalog(widget);
        widgetWrapper.init();
        widget.addEventListener('preferencesSaved', function () {

            // TODO: make sure the widget refreshes when you change the
            // "Filter By Tag" preference
            //widgetWrapper.onFilterByTagUpdate();
        });
    }
    console.log(module.name);

    module.exports = base.createModule(module.name, deps)
        .factory(require('./factories'))
        .run(run);

});
