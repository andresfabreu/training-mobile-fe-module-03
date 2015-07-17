define(function(require, exports) {
    'use strict';

    // @ngInject
    exports.lpFocus = function ($rootScope, $timeout) {
        return function(name) {
            $timeout(function() {
                $rootScope.$broadcast('lpFocusId', name);
            }, 100);
        };
    };
});
