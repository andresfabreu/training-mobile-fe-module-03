define( function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpTimer = function() {

        function lpTimerCtrl(scope, el, attrs) {

            var timeoutId, now, end,
                interval = 100,
                millis = parseInt(attrs.millis, 10),
                delayCountdown = parseInt(attrs.delayCountdown, 10) || 0,
                countdownStart = false;

            function getFormattedTime(t) {
                return Math.ceil(t / 1000) + 's';
            }

            function tick() {

                timeoutId = setTimeout(function() {
                    var delta = end - new Date();
                    var timePassed = (millis + delayCountdown) - delta;
                    var startIn = (delayCountdown - timePassed);

                    scope.onTick({
                        percentage: scope.percentage,
                        time: delta,
                        startIn: startIn
                    });

                    if (startIn > 0) {
                        scope.percentage = 100;
                        scope.formattedTime = getFormattedTime(millis);
                        tick();
                    }
                    else if (delta > 0) {
                        if (!countdownStart) {
                            countdownStart = true;
                            scope.onCountdownstart();
                        }
                        scope.percentage = (delta / (millis)) * 100;
                        scope.formattedTime = getFormattedTime(delta);
                        tick();
                    }
                    else {
                        scope.percentage = 0;
                        scope.formattedTime = '';
                        scope.onFinish();
                    }

                    scope.$apply();
                }, interval);
            }

            scope.run = function() {
                if (scope.percentage === 100 || typeof scope.percentage === 'undefined') {
                    now = +new Date();
                    end = now + delayCountdown + millis;
                    countdownStart = false;
                    tick();
                }
            };

            scope.pause = function() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };

            scope.resume = tick;

            scope.reset = function() {
                scope.pause();
                scope.animate = false;
                scope.percentage = 100;
                scope.formattedTime = getFormattedTime(millis);
                scope.animate = true;
            };

            scope.reset();

            if (attrs.autostart) {
                scope.run();
            }

            scope.$on('timer-run', scope.run);
            scope.$on('timer-pause', scope.pause);
            scope.$on('timer-resume', scope.resume);
            scope.$on('timer-reset', scope.reset);
        }

        var tmpl = [
            '<div class="lp-timer">',
                '<progressbar animate="animate" value="percentage" type="success"><b>{{formattedTime}}</b></progressbar>',
            '</div>'
        ].join('');

        function compileFn() {
            return lpTimerCtrl;
        }

        return {
            scope: {
                config: '=lpTimer',
                onTick: '&',
                onCountdownstart: '&',
                onFinish: '&'
            },
            restrict: 'AE',
            compile: compileFn,
            template: tmpl
        };
    };
});
