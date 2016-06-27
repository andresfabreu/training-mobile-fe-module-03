define(function(require, exports) {
    'use strict';

    exports.navIcon = function() {

        // Predefined icons
        var icons = {
            'arrow-left': 'chevron-left'
        };

        return {
            scope: true,
            replace: true,
            template: '<span class="glyphicon glyphicon-{{icon}}"></span>',
            link: function (scope, element, attrs) {

                // Old deprecated definition uses setup like <div nav-icon="nav-icon" icon="'list'"></div>
                // In this case fallback to icon attribute evaluation instead of default navIcon
                if (attrs.icon) {
                    scope.icon = scope.$eval(attrs.icon);
                }
                else if (attrs.navIcon !== 'nav-icon') {
                    scope.icon = scope.$eval(attrs.navIcon);
                }

                // Check if scope.icon is predefined icon from the list of icons
                if (scope.icon in icons) {
                    scope.icon = icons[scope.icon];
                }
            }
        };
    };

});
