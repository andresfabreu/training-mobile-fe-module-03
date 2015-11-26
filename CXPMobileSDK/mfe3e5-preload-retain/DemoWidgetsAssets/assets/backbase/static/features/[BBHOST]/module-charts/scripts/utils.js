define(function (require, exports, module) {
    'use strict';

    var utils = {};

    utils.endAll = function (transition, callback) {
        if (transition.size() === 0) {
            callback();
            return;
        }

        var n = 0;
        transition
            .each(function () { ++n; })
            .each('end', function () { if (!--n) { callback.apply(this, arguments); } });
    };

    module.exports = utils;

});
