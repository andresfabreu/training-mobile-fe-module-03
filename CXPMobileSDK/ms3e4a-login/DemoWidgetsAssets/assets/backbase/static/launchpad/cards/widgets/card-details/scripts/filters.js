define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.percentage = function($filter) {
        return function (input, decimals) {
            return $filter('number')(input * 100, decimals) + '%';
        };
    };

});
