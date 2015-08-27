define(function(require, exports, module) {

    'use strict';

    var util = window.lp && window.lp.util; // to be refactored

    // @ngInject
    exports.profileImage = function() {
        return {
            restrict:'EA',
            replace: true,
            template: '<img height="{{size}}" width="{{size}}" ng-src="{{dataUrl}}"" />',
            scope: {
                fullname: '@',
                color: '@',
                size: '='
            },
            link: function(scope, element, attrs) {
                scope.$watch('size + fullname + color', function() {
                    var width = scope.size || 100;
                    var height = scope.size || 100;
                    updateSrc(width, height);
                });

                var updateSrc = function(width, height) {
                    scope.dataUrl=  util.getDefaultProfileImage(scope.fullname, width, height, scope.color);
                };
            }
        };
    };
});
