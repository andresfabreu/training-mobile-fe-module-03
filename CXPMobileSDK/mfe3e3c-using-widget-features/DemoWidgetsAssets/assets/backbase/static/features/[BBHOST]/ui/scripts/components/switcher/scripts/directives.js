define( function (require, exports, module) {
    'use strict';

    /**
     * @ngdoc directive
     * @name lpEnableDisableToggle
     *
     * @description Implements simple two-positions switcher
     *
     * Changes state depending on parameter (boolean) passing into with directive parameter itself
     *
     * @param lp-enable-disable-toggle {=boolean} Required, switcher state variable
     * @param enabled-text-long {@string} Optional, 'on' text inside switcher for wide screens (default: Enabled)
     * @param enabled-text-short {@string} Optional, 'on' text inside switcher for mobile screens (default: On)
     * @param disabled-text-long {@string} Optional, 'off' text inside switcher for wide screens (default: Disabled)
     * @param disabled-text-short {@string} Optional, 'off' text inside switcher for mobile screens (default: Off)
     *
     * @param $templateCache
     * @param $timeout
     * @returns {{scope: {active: string}, restrict: string, template: *, link: Function}}
     */
    // @ngInject
    exports.lpEnableDisableToggle = function($templateCache, $timeout) {
        $templateCache.put('enable-disable-toggle.html',
            '<div class="enable-disable-toggle-wrapper">' +
                '<div class="enable-disable-slider {{ directiveAnimationClasses }}" ng-class="{\'is-disabled\': !active}">' +
                    '<div class="enable-disable-enabled">' +
                        '<div class="note note-text note-text-wide">{{ enabledTextLong | limitTo : 8 }}</div>' +
                        '<div class="note note-text note-text-short">{{ enabledTextShort | limitTo : 3 }}</div>' +
                    '</div>' +
                    '<i class="zipper">&nbsp;</i>' +
                    '<i class="zipper">&nbsp;</i>' +
                    '<div class="enable-disable-disabled">' +
                        '<div class="note note-text note-text-wide">{{ disabledTextLong | limitTo : 8 }}</div>' +
                        '<div class="note note-text note-text-short">{{ disabledTextShort | limitTo : 3 }}</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        );

        return {
            scope: {
                active: '=lpEnableDisableToggle'
            },
            restrict: 'A',
            template: $templateCache.get('enable-disable-toggle.html'),
            link: function($scope, el, attrs) {
                // fill in configs we pass by attributes
                $scope.enabledTextLong = attrs.enabledTextLong || 'Enabled';
                $scope.disabledTextLong = attrs.disabledTextLong || 'Disabled';
                $scope.enabledTextShort = attrs.enabledTextShort || 'On';
                $scope.disabledTextShort = attrs.disabledTextShort || 'Off';

                $scope.$watch('active', function(val, old) {
                    if (val !== old) {
                        $scope.directiveAnimationClasses = $scope.active ? 'animated slideInLeft' : 'animated slideInRight';
                    } else {
                        $scope.directiveAnimationClasses = '';
                    }
                    $timeout(function() { $scope.directiveAnimationClasses = ''; }, 3500);
                });
            }
        };
    };
});
