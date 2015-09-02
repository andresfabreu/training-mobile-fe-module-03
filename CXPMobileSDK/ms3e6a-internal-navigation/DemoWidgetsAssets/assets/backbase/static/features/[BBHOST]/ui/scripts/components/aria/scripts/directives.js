define(function(require, exports) {
    'use strict';

    /** @ngInject */
    exports.lpAriaNumber = function ($filter) {
        function link(scope) {
            scope.$watch('lpAriaNumber', function (val) {
                scope.srNumber = $filter('lpAriaNumber')(val);
            });
        }

        return {
            restrict: 'A',
            link: link,
            scope: {
                lpAriaNumber: '='
            },
            template:
                '<span aria-hidden="true">{{lpAriaNumber}}</span>' +
                '<span class="sr-only">{{srNumber}}</span>'
        };
    };

});
