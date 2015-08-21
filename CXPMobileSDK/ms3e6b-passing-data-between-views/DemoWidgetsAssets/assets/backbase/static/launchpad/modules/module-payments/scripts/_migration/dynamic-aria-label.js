define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.dynamicAriaLabel = function() {
        return {
            restrict: "A",
            scope: {
                "contact": "=ariaContact",
                "account": "=ariaAccount"
            },
            link: function(scope, element) {

                var ariaLabel = "";

                ariaLabel += scope.contact.name + " ";

                if(scope.account.name) {
                    ariaLabel += scope.account.name + " ";
                } else {
                    var type = scope.account.type.toLowerCase();
                    type = type.replace("_", " ");
                    ariaLabel += type + " ";
                }

                ariaLabel += scope.account.account;

                element.attr("aria-label", ariaLabel);
            }
        };
    };
});