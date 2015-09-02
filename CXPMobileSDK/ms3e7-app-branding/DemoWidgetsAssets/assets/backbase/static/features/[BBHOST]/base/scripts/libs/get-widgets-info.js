/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : get-widgets-info.js
 *  Description : Return a global function to check the
 *  widgets information used on the current page.
 *  ----------------------------------------------------------------
 */

define(function(require, exports, module) {
    'use strict';

    var NS = require('../config').NS;
    var utils = require('../modules/utils/main');
    var $ = require('jquery');
    var global = window;
    // @todo  use portal module, when ready
    var portal = global.b$ && global.b$.portal;

    /**
     * Expose to global namespace
     *
     * @return {[type]} [description]
     */
    global[NS].getWidgetsInfo = module.exports = function getWidgetsInfo() {
        function collectWidgets(rootNode, init) {

            var widgets = [],
                childWidgets;

            if (init) {
                for (var key in rootNode) {
                    childWidgets = collectWidgets(rootNode[key]);
                    widgets = widgets.concat(childWidgets);
                }
            }
            else if ((rootNode.childNodes && rootNode.childNodes.length) || (rootNode['_children'] && rootNode['_children'].length)) {
                var children = (rootNode.childNodes || []).concat(rootNode['_children'] || []);
                children.forEach(function(child) {
                    childWidgets = collectWidgets(child);
                    widgets = widgets.concat(childWidgets);
                });
            }
            else if (rootNode.tag === 'widget') {
                widgets.push({
                    name: rootNode.extendedItemName,
                    version: 'x.x.x',
                    src: rootNode.originalItem.preferences.src.value
                        .replace('$(contextRoot)', portal.config.serverRoot)
                        .replace('index.html', '')
                });
            }

            // Filter unique and sort by name
            return utils.chain(widgets).uniq('name').sortBy('name').value();
        }

        var all = global.b$.portal.portalModel.all;
        var widgetsList = collectWidgets(all, true);

        // Retrieve version information
        var promises = widgetsList.map(function(item) {
            return $.getJSON(item.src + 'bower.json').then(function(data) {
                item.version = data.version;
            });
        });

        $.when.apply(null, promises).then(function() {
            console.table(widgetsList);
        });
    };
});
