define(function(require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    // @ngInject
    exports.placeholder = function() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var placeholder = attrs.placeholder;
                if (placeholder) {
                    $(element).placeholder();
                }
            }
        };
    };
});
