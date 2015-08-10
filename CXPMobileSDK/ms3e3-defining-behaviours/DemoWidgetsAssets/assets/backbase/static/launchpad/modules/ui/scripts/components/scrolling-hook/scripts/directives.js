define(function(require, exports) {
    'use strict';

    var base = require('base');
    var angular = base.ng;
    var utils = base.utils;

    /** @ngInject */
    exports.scrollingHook = function ($window) {

        // Trying to avoid using jQuery. This is $(window).scrollTop() replacement
        function getScrollTop() {
            return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        }

        return {
            scope: {
                className: '=scrollClass',
                distance: '=scrollDistance',
                hookCallback: '='
            },
            link: function (scope, element, attrs) {

                // Get current distance from top
                var lastScrollTop = getScrollTop(),
                    className = scope.className;

                var doClassChange = function() {

                    // New distance from top once scrolled
                    var st = getScrollTop();

                    if (st >= scope.distance) {

                        if (lastScrollTop - st >= 5 || lastScrollTop <= 0) {
                            // Scrolling up
                            if (element.hasClass(className)) {
                                element.removeClass(className);
                            }
                        }
                        else if (st > lastScrollTop) {
                            // Scrolling down
                            if (!element.hasClass(className)) {
                                element.addClass(className);
                            }
                        }
                    }
                    else {
                        if (element.hasClass(className)) {
                            // We are not low enough on the page, return to default setting
                            element.removeClass(className);
                        }
                    }

                    // Reset scrollTop to current pageYOffset
                    lastScrollTop = st;

                    if (scope.hookCallback) {
                        scope.hookCallback(element);
                    }
                };

                angular.element($window).on('scroll', utils.debounce(doClassChange, 10));

            }
        };
    };

});
