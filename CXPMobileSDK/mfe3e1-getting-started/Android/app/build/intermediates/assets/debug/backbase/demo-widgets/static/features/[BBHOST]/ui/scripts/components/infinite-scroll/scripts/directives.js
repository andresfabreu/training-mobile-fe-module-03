define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpInfiniteScroll = function($parse) {
        function linkFn(scope, element, attr) {
            var raw = element[0];
            var isDisabled = $parse(attr.lpInfiniteScrollDisabled);
            var isEnd = $parse(attr.lpInfiniteScrollEnd);

            var handler = function(event) {
                var scrollTop, yMax;
                var disabled = isDisabled(scope);
                if ( !isEnd(scope) ) {
                    if (!disabled) {
                        scrollTop = raw.scrollTop;
                        yMax = raw.scrollHeight - raw.offsetHeight;
                        if (scrollTop === yMax) {
                            scope.$apply(attr.lpInfiniteScroll);
                        }
                    }
                }
            };

            var wheelHandler = function(event) {
                var scrollTop, yMax;

                if( !isEnd(scope) ) {
                    scrollTop = raw.scrollTop;
                    yMax = raw.scrollHeight - raw.offsetHeight;
                    if (scrollTop === yMax) {
                        return isDisabled(scope) ? undefined : event.preventDefault();
                    }
                }
            };

            scope.$on('$destroy', function() {
                element.unbind('scroll', handler);
                return element.unbind('mousewheel', wheelHandler);
            });

            element.bind('scroll', handler);
            element.bind('mousewheel', wheelHandler);
        }

        return {
            restrict: 'A',
            link: linkFn
        };
    };

});
