define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.lpCalendar = function(lpCoreTemplate) {
        return {
            restrict: 'AE',
            scope: {
                content: '=content',
                list: '=list',
                view: '=view',
                config: '=config'
            },
            replace: true,
            controller: 'calendarCtrl',
            link: function(scope, element, attrs, ctrl) {
                ctrl.init();
            },
            templateUrl: lpCoreTemplate.resolveTemplateSrc('templates/calendar.html')
        };
    };
});
