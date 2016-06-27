define(function(require, exports, module) {
    'use strict';

    var utils = require('base').utils;

    // @ngInject
    exports.lpLabeledInputUtil = function() {
        /**
         * Find list item with prop as a 'name'
         *
         * @param list
         * @param prop
         * @returns {*}
         */
        var updateByMirrors = function (list) {
            if (utils.isArray(list) || utils.isPlainObject(list)) {
                utils.forEach(list, function(item) {
                    if (utils.isString(item.mirror)) {
                        item.mirror = utils.find(list, function(record) {
                            return record.name === item.mirror;
                        });
                    }
                });
            }
        };

        /**
         * Escape string to be used as a part of RegExp
         *
         * @param string
         * @returns {*}
         */
        var escapeRegExp = function (string) {
            return utils.isString(string) ? string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : string;
        };

        return {
            updateByMirrors: updateByMirrors,
            escapeRegExp: escapeRegExp
        };
    };
});
