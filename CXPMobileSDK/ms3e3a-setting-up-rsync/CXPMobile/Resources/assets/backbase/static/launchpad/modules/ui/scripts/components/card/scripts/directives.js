define(function(require, exports) {

    'use strict';

    exports.lpCard = function() {

        function templateFn() {
            return [
                '<div>',
                    '<div class="panel panel-default">',
                        '<div class="panel-heading clearfix">',
                        '<h5 class="pull-left">{{title}}</h5>',
                        '<div class="buttons pull-right">' +
                            '<button ng-repeat="button in buttons" class="btn btn-default {{button.className}}" role="button" ' +
                        '        ng-click="button.onclick(data)" ' +
                        '        lp-i18n="{{button.label}}"></button>',
                        '</div>',
                    '</div>',
                    '<div class="panel-body" ng-transclude></div>',
                '</div>'
            ].join('');
        }

        return {
            restrict: 'AE',
            transclude: true,
            scope: {
                data: '=',
                title: '@',
                buttons: '='
            },
            template: templateFn
        };
    };

});
