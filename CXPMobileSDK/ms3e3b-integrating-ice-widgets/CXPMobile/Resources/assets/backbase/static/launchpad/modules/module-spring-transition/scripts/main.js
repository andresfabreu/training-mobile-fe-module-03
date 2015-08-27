// # OLD lp-anim module
// # TO BE refactored
define(function(require, exports, module) {
    'use strict';

    var Transitn = require('./transin');

    module.exports = (function($, lp) {
       return {
            _restore: function($widget, $area, restoredPosition) {

                var duration = '.3s';
                var $title = $('.lp-springboard-tile-title', $widget);
                var $icon = $('.lp-springboard-tile-icon', $widget);

                $area.addClass('lp-animating');
                $widget.addClass('lp-springboard-widget-live');

                var boxTransition = new Transitn({
                    element: $area[0],
                    duration: duration,
                    to: {
                        left: restoredPosition.left,
                        top: restoredPosition.top,
                        width: restoredPosition.width,
                        height: restoredPosition.height
                    },
                    timingFunction: 'ease-in-out'
                });
                boxTransition.on('transitionend', function() {

                    $widget.removeClass('lp-springboard-widget-maximized');
                    $area.removeClass('lp-springboard-area-maximized lp-animating')
                        .css({
                            zIndex: 1
                        });
                    if (restoredPosition.small) {
                        $area.addClass('lp-springboard-smallcell');
                    }

                });
                boxTransition.start();

                var iconTransition = new Transitn({
                    element: $icon[0],
                    duration: duration,
                    isCleaning: true,
                    from: {
                        fontSize: '70px',
                        lineHeight: '70px'
                    },
                    timingFunction: 'ease-in-out'
                });
                iconTransition.start();

                var titleTransition = new Transitn({
                    element: $title[0],
                    duration: duration,
                    isCleaning: true,
                    from: {
                        fontSize: '15px',
                        lineHeight: '1.42857'
                    },
                    timingFunction: 'ease-in-out'
                });
                titleTransition.start();

            },

            _maximize: function($widget, $area) {
                var duration = '.4s';
                var $title = $('.lp-springboard-tile-title', $widget);
                var $icon = $('.lp-springboard-tile-icon', $widget);

                $area.addClass('lp-animating').css({
                    zIndex: 2
                });

                var boxTransition = new Transitn({
                    element: $area[0],
                    duration: duration,
                    // isCleaning: true,
                    to: {
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: '100%'
                    },
                    timingFunction: 'ease-in-out'
                });
                boxTransition.on('transitionend', function() {
                    $widget.addClass('lp-springboard-widget-maximized');
                    $area.addClass('lp-springboard-area-maximized')
                        .removeClass('lp-springboard-smallcell lp-animating')
                        .css({
                            zIndex: 2
                        });
                });
                boxTransition.start();

                var iconTransition = new Transitn({
                    element: $icon[0],
                    duration: duration,
                    isCleaning: true,
                    to: {
                        fontSize: '200px',
                        lineHeight: '200px'
                    },
                    timingFunction: 'ease-in-out'
                });
                iconTransition.start();

                var titleTransition = new Transitn({
                    element: $title[0],
                    duration: duration,
                    isCleaning: true,
                    to: {
                        fontSize: '36px',
                        lineHeight: '36px'
                    },
                    timingFunction: 'ease-in-out'
                });
                titleTransition.start();

            },
            /**
             * param = {
             *      element : element,
             *      duration: '.1s',
             *      direction: 'left',
             *      callback: function(){}
             * }
             */
            _transition: function(param) {

                var transParam = {
                    element: param.element,
                    duration: param.duration || '.3s',
                    timingFunction: param.timing || 'ease-in-out',
                    isCleaning: param.isCleaning || true,
                    from: param.from || null,
                    to: param.to || null
                };

                var transition = new Transitn(transParam);

                transition.on('transitionend', function(trans, propertyName, event) {
                    if (param.callback) {
                        param.callback();
                    }
                });

                transition.start();
            }
        };
    })(window.jQuery, window.lp);
});
