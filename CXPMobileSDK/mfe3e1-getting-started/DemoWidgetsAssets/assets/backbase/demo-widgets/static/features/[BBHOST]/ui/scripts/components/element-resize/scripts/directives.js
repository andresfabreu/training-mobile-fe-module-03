define(function(require, exports, module) {
    'use strict';

    var angular = require('base').ng;

    /**
     * Uses the correct implementation of requestAnimationFrame,
     *     or uses setTimeout as a fallback.
     *
     * @param   {Function} fn The callback function to be called
     * @returns Returns the requestAnimationFrame function result
     */
    var requestFrame = function(fn) {
        var raf = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function() { return window.setTimeout(fn, 20); };

        return raf(fn);
    };

    /**
     * Funtion that cancels the requestAnimationFrame callback or it's setTimeout fallback.
     *
     * @param  id {Object} The id of the requestAnimationFrame to be canceled
     * @return    Returns the cancelAnimationFrame function result
     */
    var cancelFrame = function(id) {
        var cancel = window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.clearTimeout;

        return cancel(id);
    };

    // @ngInject
    exports.lpElementResize = function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                // function to be called when a resize happens (passed in as the value for the directive attribute)
                var callback = $parse(attrs.elementResize || attrs.lpElementResize); // 'elementResize' for backwards compat.

                var shadowElement;
                var resizeTarget = element[0];
                var resizeId;
                var previousSize = {};
                // Interval id for initializing the shadow element when the element is visible
                var initializeInterval;
                // boolean value defining attachEvent/addEventListener support
                var hasAttachEvent = false;

                // Returns true if the size of the element has changed
                var checkResize = function() {
                    return resizeTarget.offsetWidth !== previousSize.width ||
                        resizeTarget.offsetHeight !== previousSize.height;
                };

                // Resets the size of the resize elements after size change
                var resetTriggers = function() {
                    var triggers = shadowElement[0];
                    var expand = triggers.querySelector('.expand-trigger');
                    var contract = triggers.querySelector('.contract-trigger');
                    var expandChild = triggers.querySelector('.expand-trigger > div');

                    // move the scroll to it's maximum so in case of a resize it will trigger a scroll event
                    contract.scrollLeft = contract.scrollWidth;
                    contract.scrollTop = contract.scrollHeight;
                    expandChild.style.width = expand.offsetWidth + 1 + 'px';
                    expandChild.style.height = expand.offsetHeight + 1 + 'px';
                    expand.scrollLeft = expand.scrollWidth;
                    expand.scrollTop = expand.scrollHeight;
                };

                // The "resize" event callback function
                var resizeListener = function(event) {
                    // no need to reset the elements on IE
                    if (!hasAttachEvent) {
                        resetTriggers();
                    }

                    // if the previous callback hasn't fired yet, cancel it in favour of the new one
                    if (resizeId) {
                        cancelFrame(resizeId);
                    }
                    // schedule the callback to be called during the next browser repaint cycle
                    resizeId = requestFrame(function() {
                        if (checkResize()) {
                            previousSize.width = resizeTarget.offsetWidth;
                            previousSize.height = resizeTarget.offsetHeight;

                            // fire the callback function with width and height as params
                            callback(scope, { data: { element: element, width: resizeTarget.offsetWidth, height: resizeTarget.offsetHeight } });
                        }
                    });
                };

                var resizeEventInit = function() {
                    previousSize.width = resizeTarget.offsetWidth;
                    previousSize.height = resizeTarget.offsetHeight;

                    // for IE lt 11 use the native element resize event
                    resizeTarget.attachEvent('onresize', resizeListener);

                    // fire the callback function when the directive is initialized
                    callback(scope, { data: { element: element, width: resizeTarget.offsetWidth, height: resizeTarget.offsetHeight } });
                };

                var scrollEventInit = function() {
                    // create and append to the DOM the resize helper elements
                    shadowElement = angular.element('<div class="responsive-shadow">' +
                        '<div class="expand-trigger"><div></div></div>' +
                        '<div class="contract-trigger"></div>' +
                    '</div>');
                    element.append(shadowElement);

                    resetTriggers();
                    previousSize.width = resizeTarget.offsetWidth;
                    previousSize.height = resizeTarget.offsetHeight;

                    // for IE11 and other browsers, use scroll event to for fire the resize check
                    resizeTarget.addEventListener('scroll', resizeListener, true);

                    // fire the callback function when the directive is initialized
                    callback(scope, { data: { element: element, width: resizeTarget.offsetWidth, height: resizeTarget.offsetHeight } });
                };

                var initialize = function() {
                    // set the existance of attachEvent (only on IE lt 11)
                    hasAttachEvent = !!document.attachEvent;

                    if (hasAttachEvent) {
                        resizeEventInit();
                    } else {
                        if (resizeTarget.offsetWidth === 0 && resizeTarget.offsetHeight === 0) {
                            if (!initializeInterval) {
                                initializeInterval = window.setInterval(function() {
                                    if (resizeTarget.offsetWidth !== 0 && resizeTarget.offsetHeight !== 0) {
                                        window.clearInterval(initializeInterval);
                                        scrollEventInit();
                                    }
                                }, 250);
                            }
                        } else {
                            scrollEventInit();
                        }
                    }
                };

                // initialization function
                initialize();
            }
        };
    };

    /*
     * @deprecated, will remove in LP 0.13.0
     */
    exports.elementResize = exports.lpElementResize; // backwards compatible.
});

