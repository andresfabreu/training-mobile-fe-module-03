define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.dynamicFocus = function() {
        return {
            restrict: "A",
            scope: {
                "contact": "=dynamicFocus"
            },
            link: function(scope, element) {

                if(scope.contact.accounts.length === 1) {
                    element.attr("tabindex", "0");
                    element.attr("aria-label", scope.contact.name + " " + scope.contact.accounts[0].type.toLowerCase() + " " + scope.contact.accounts[0].account);
                }
            }
        };
    };
});