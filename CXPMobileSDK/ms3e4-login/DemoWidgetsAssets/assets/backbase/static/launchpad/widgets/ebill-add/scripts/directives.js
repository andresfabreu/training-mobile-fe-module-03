/* globals define */

define( function (require, exports, module) {
    'use strict';

    //@ngInject
    exports.lpSelect = function() {

        function linkFn(scope, elem){
            var handler = function (ev) {
                if(ev.type === 'keyup' && ev.keyCode !== 13) {
                    return;
                }

                scope.$apply(function(){
                    scope.lpSelect.call(null, {$event: ev});
                });
            };

            elem.on('click', handler);
            elem.on('keyup', handler);

            // todo: test it
            scope.$on('$destroy', function() {
                // console.log('destroy linkFn');
                elem.off(handler);
            });
        }

        return {
            restrict: 'A',
            scope: {
                lpSelect: '&'
            },
            compile: function(elem, attrs) {
                // alter dom before linking\
                attrs.$set('tabindex', 0);
                return linkFn;
            },
            link: linkFn
        };
    };

});
