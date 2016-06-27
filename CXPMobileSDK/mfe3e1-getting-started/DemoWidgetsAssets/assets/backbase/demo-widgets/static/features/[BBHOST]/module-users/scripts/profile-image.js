define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.profileImage = function(lpCoreUtils, lpDefaultProfileImage) {
        return {
            restrict: 'EA',
            replace: true,
            template: '<img height="{{size}}" width="{{size}}" ng-src="{{dataUrl}}"" />',
            scope: {
                fullname: '@',
                color: '@',
                size: '='
            },
            link: function(scope, element, attrs) {
                var updateSrc = function(width, height) {
                    scope.dataUrl = lpDefaultProfileImage(scope.fullname, width, height, scope.color);
                };

                scope.$watch('size + fullname + color', function() {
                    var width = scope.size || 100;
                    var height = scope.size || 100;
                    updateSrc(width, height);
                });
            }
        };
    };
});

