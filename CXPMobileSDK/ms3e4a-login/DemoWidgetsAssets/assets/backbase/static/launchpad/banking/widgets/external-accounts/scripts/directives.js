define(function(require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    // @ngInject
    exports.lazyLoader = function($window, lpCoreUtils) {
        return {
            restrict: 'A',
            scope: {
                callBack: '=',
                stopLoading: '='
            },
            link: function(scope, element, attrs) {
                var win;

                var getHeight = function() {
                    return scope.widgetElement.height() + scope.widgetElement.offset().top;
                };

                var doLoadMore = lpCoreUtils.debounce(function () {
                    if(win.scrollTop() > (getHeight() - 150)) {
                        win.off('scroll', doLoadMore);
                        scope.callBack(true).then(function() {
                            if(!scope.stopLoading) {
                                win.on('scroll', doLoadMore);
                            }
                        });
                    }
                }, 10);

                var initialize = function() {
                    win = $($window);
                    scope.widgetElement = element.closest('.widget');
                    win.on('scroll', doLoadMore);
                };

                scope.$watch('stopLoading', function(newValue, oldValue) {

                    if(newValue) {
                        $($window).off('scroll', doLoadMore);
                    } else if(oldValue && !newValue) {
                        win.on('scroll', doLoadMore);
                    }
                });

                initialize();
            }

        };
    };
});
