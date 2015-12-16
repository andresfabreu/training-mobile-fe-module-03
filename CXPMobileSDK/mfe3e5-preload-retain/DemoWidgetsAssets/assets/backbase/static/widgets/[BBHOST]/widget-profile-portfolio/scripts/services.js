define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.PortfolioService = function($http, lpWidget, lpCoreUtils) {
        var url = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('data-source'));
        this.read = function() {
            return $http.get(url);
        };
    };
});
