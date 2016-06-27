define(function (require, exports, module) {
    'use strict';

    var d3 = require('d3');
    var angular = require('base').ng;

    /**
     * D3 helpers
     */

    exports.getDomainSize = function (scale) {
        var domain = scale.domain();
        return domain[1] - domain[0];
    };


    /**
     * Makes an element sticky
     * @param {HTMLElement} el
     * @param {Number}     [offsetTop]
     */
    exports.sticky = function (el, offsetTop) {
        offsetTop = offsetTop || 0;

        var $el = angular.element(el),
            $parent = $el.parent(),
            position = $el.css('position'),
            $win = angular.element(window),
            isFixed, width, height, top;

        function reset() {
            isFixed = false;
            $el.width('auto').css('position', position);
        }

        function updateTop() {
            top = $el.offset().top;
        }

        function check() {
            var scrollTop = $win.scrollTop() + offsetTop;
            if (scrollTop > top) {
                if (isFixed) { return; }
                updateTop();
                if (scrollTop <= top) { return; }
                isFixed = true;
                $parent.height(height);
                $el.width(width).css({position: 'fixed', top: offsetTop});
            } else {
                if (isFixed) { reset(); }
            }
        }

        function resize() {
            reset();
            var w = $el.width(),
                h = $parent.height();
            if (w <= 0 || h <= 0) { return; }
            width = w;
            height = h;
            updateTop();
            check();
        }

        $win.on('resize', resize)
            .on('scroll', check);

        resize();
    };


    /**
     * PubSub with memory
     */
    exports.pubsub = (function (mod) {
        var CLEANUP_DELAY = 3600e3, // memory length, milliseconds
            events = {};
        return {
            publish: function (name, data) {
                events[name] = events[name] || [];
                events[name].push(data);

                setTimeout(function () {
                    var index = events[name].indexOf(data);
                    if (index !== -1) { events[name].splice(index, 1); }
                }, CLEANUP_DELAY);

                mod.publish.apply(mod, arguments);
            },

            subscribe: function (name, fn) {
                mod.subscribe.apply(mod, arguments);
                var e = events[name];
                if (e) {
                    for (var i = 0; i < e.length; ++i) {
                        fn(e[i]);
                    }
                }
            }
        };
    })(window.gadgets.pubsub);

});
