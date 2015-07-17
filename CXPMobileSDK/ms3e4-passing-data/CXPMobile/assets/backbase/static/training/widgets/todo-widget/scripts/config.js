/**
 * Config
 * @module config
 */
define(function (require, exports, module) {

    'use strict';

    // @ngInject
    module.exports = function (widgetProvider) {
        var w = widgetProvider.$get(); // widget instance
        console.log('widget', w)
    };

});
