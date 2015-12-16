define(function (require, exports, module) {
    'use strict';

    var Hammer = require('hammerjs');

    // @ngInject
    exports.lpCategoryDisplay = function($templateCache, lpCoreBus) {
        $templateCache.put('$categoryDisplay.html',
            '<div class="lp-transaction-category" ng-click="categoryClick($event, transaction)">' +
                '<span class="category-marker" ng-style="markerStyle"></span>' +
                '<div class="category-name"><span class="h4">{{category.name}}</span></div>' +
            '</div>'
        );

        return {
            restrict : 'A',
            replace: true,
            require: 'ngModel',
            scope: {
                isCategoryView: '=lpCategoryView',
                categoryList: '=lpCategoryList',
                transaction: '=ngModel',
                categoryClick: '='
            },
            template: $templateCache.get('$categoryDisplay.html'),
            link: function (scope, element, attrs) {

                var marker = element.find('span')[0],
                    transactionRow = element.parent().parent(),
                    dragStartWidth = 0;

                scope.markerStyle = {};
                scope.category = null;

                var gestures = {} , swipeHammer =  transactionRow.data('touch');

                var panright = function (event) {
                    event.srcEvent.stopPropagation();
                    event.preventDefault();
                    element.parent().addClass('no-animation');
                    var newWidth = dragStartWidth + Math.floor(event.deltaX);
                    if (newWidth > 160) {
                        newWidth = 160;
                    }
                    if (newWidth > dragStartWidth) {
                        element.parent().css('width', newWidth + 'px');
                    }
                };

                var panstart = function (event) {
                    event.srcEvent.stopPropagation();
                    event.preventDefault();
                    dragStartWidth = parseInt(element.css('width'), 10);
                };

                var panend = function (event) {
                    event.srcEvent.stopPropagation();
                    event.preventDefault();
                    element.parent().removeClass('no-animation');
                    var newWidth = dragStartWidth + Math.floor(event.deltaX);
                    if (newWidth > 160) {
                        newWidth = 160;
                    }
                    if (newWidth > 150) {
                        if (scope.categoryClick && typeof scope.categoryClick === 'function') {
                            scope.categoryClick.apply(this, [null, scope.transaction]);
                        }
                    }
                    element.parent().css('width', '');
                };

                if (!scope.isCategoryView && typeof Hammer !== 'undefined') {
                    if (! swipeHammer )  {
                            swipeHammer = new Hammer( transactionRow[0]);
                            transactionRow.data('touch', swipeHammer);
                        }


                    gestures.panright = swipeHammer.on('panright', panright);

                    gestures.panstart = swipeHammer.on('panstart', panstart);

                    gestures.panend = swipeHammer.on('panend', panend);
                }

                scope.$on('$destroy', function() {
                    Object.keys(gestures).forEach(function(eventType) {
                        var ev = gestures[eventType];
                        ev.off(eventType, ev.handlers[eventType][0]);
                    });
                });

                scope.$watch('transaction.categoryId', function(value) {
                    scope.setCategory(value);
                });

                scope.setCategory = function (id) {
                    if (scope.categoryList) {
                        for (var i = 0; i < scope.categoryList.length; i++) {
                            if (scope.categoryList[i].id === id) {
                                scope.category = scope.categoryList[i];
                            }
                        }
                    }

                    if (scope.category && id) {
                        scope.markerStyle.backgroundColor = scope.category.color;
                    } else {
                        // temporary fix to set 'Uncategorised' if transaction category id isn't valid
                        scope.transaction.categoryId = '00cc9919-ba0c-4702-917b-1fba4c256b4d';
                    }
                };

                lpCoreBus.subscribe('launchpad-retail.categoryDelete', function(data) {
                    if (data.id === scope.transaction.categoryId) {
                        scope.setCategory();
                    }
                });
            }
        };
    };
});
