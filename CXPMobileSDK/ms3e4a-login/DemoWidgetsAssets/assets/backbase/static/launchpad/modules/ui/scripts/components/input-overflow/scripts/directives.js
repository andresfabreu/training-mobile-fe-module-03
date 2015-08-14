define(function(require, exports) {
    'use strict';

    var angular = require('base').ng;

    /** @ngInject */
    exports.lpInputOverflow = function ($timeout) {

        function $getWrapper(fontSize) {
            return angular.element(
                '<div class="lp-input-overflow">' +
                    '<div class="lp-input-overflow-indicator">' +
                        '<span class="lp-input-overflow-elipsis">...</span>' +
                    '</div>' +
                    '<span class="lp-input-overflow-input-text" style="font-size: ' + fontSize + '"></span>' +
                '</div>'
            );
        }

        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrls) {

                var fontSize = element.css('font-size'),
                    $wrapper = element.after($getWrapper(fontSize)).next().append(element),
                    $span = $wrapper.find('.lp-input-overflow-input-text'),
                    $indicator = $wrapper.find('.lp-input-overflow-indicator');


                function showIndicator() {

                    var textWidth = $span.text(ngModelCtrls.$modelValue).width(),
                        inputWidth = element.width();

                    $indicator.toggleClass('inactive', textWidth < inputWidth);
                }

                function hideIndicator() {
                    if (!$indicator.hasClass('inactive')) {
                        $indicator.addClass('inactive');
                        element.focus();
                    }
                }

                // Listen events to show/hide indicator
                element.on('blur', showIndicator);
                element.on('click focus', hideIndicator);
                $indicator.on('click', hideIndicator);

                // Add a little delay for overflow check just in case
                $timeout(showIndicator, 100);
            }
        };
    };

});
