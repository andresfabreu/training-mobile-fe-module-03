define(function (require, exports, module) {

    'use strict';

    var Hammer = require('hammerjs');

    /**
     * Supported directives
     * define Hammerjs EVENTS/RECOGNIZERS and turn them into angularjs directives
     * http://hammerjs.github.io/getting-started/
     * use them as human-case directive
     * FOR Example <div on-swipe="mySwipeHandler">
     */
    // Hammer 2.x GestureEvents
    var gestureDirectivesNames = [
        // pan/drag events
        'onPan', 'onPanUp', 'onPanDown', 'onPanLeft', 'onPanRight', 'onPanStart', 'onPanEnd', 'onPanMove', 'onPanCancel',
        // swipe events
        'onSwipe', 'onSwipeUp', 'onSwipeDown', 'onSwipeLeft', 'onSwipeRight',
        // pinch events
        'onPinch', 'onPinchIn', 'onPinchOut', 'onPinchStart', 'onPinchEnd', 'onPinchMove', 'onPinchCancel',
        // rotate events
        'onRotate', 'onRotateMove', 'onRotateStart', 'onRotateEnd', 'onRotateCancel',
        // tap/press events
        'onTap', 'onPress'
    ];

    // Store all Directives under a directives object
    var directives = {};

    /**
     * Linking method attach touch event only if the window supports touch events
     * @param  {string} dirName Directive name for example onSwipe... etc.
     * @return {array}         angularjs directive
     */
    function linkGestureDirective(dirName) {

        var _isTouch = ('ontouchstart' in window);

        return ['$parse', function ($parse) {
            var eventType = dirName.substr(2).toLowerCase();
            return function ($scope, $element, $attr) {

                var gesture;
                var mc = $element.data('touch');
                var fn = $scope.$eval($attr[dirName]);
                var opts = $parse($attr.onGestureOptions)($scope, {});
                var listener = function (ev) {
                    $scope.$apply(function () {
                        fn.call(null, $scope, {$event: ev, $element: $element});
                    });
                };

                // creatxe only one instance;
                if (typeof Hammer !== 'undefined' && _isTouch) {
                    if (!mc) {
                        mc = new Hammer($element[0], opts);
                        $element.data('touch', mc);
                    }
                    gesture = mc.on(eventType, listener);
                    $scope.$on('$destroy', function () {
                        gesture.off(eventType, listener);
                    });
                }
            };
        }];
    }

    gestureDirectivesNames.forEach(function (dirName) {
        directives[dirName] = linkGestureDirective(dirName);
    });

    exports.directives = directives;

});
