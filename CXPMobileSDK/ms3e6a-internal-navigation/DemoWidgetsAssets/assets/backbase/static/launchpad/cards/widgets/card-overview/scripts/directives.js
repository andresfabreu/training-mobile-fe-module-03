// #TODO componentized
define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.cardDesign = function() {
        return {
            restrict: 'A',
            replace: true,
            require: 'ngModel',
            scope: {},
            template:
                '<div class="card-design" element-resize="updateFontSize(data)">' +
                    '<img ng-src="{{card.image}}" alt="" class="card-image" />' +
                    '<span class="card-text card-holder">{{card.name}}</span>' +
                    '<span class="card-text card-number">{{card.number}}</span>' +
                    '<span class="card-text card-expiry">{{card.expiry}}</span>' +
                '</div>',
            link: function (scope, element, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }

                var cardImages = {
                    'VISA': scope.$parent.mediaDir + '/cc-visa.png',
                    'Mastercard': scope.$parent.mediaDir + '/cc-mastercard.png',
                    'AMEX': scope.$parent.mediaDir + '/cc-amex.png',
                    'Discover': scope.$parent.mediaDir + '/cc-discover.png',
                    'other': scope.$parent.mediaDir + '/cc-other.png'
                };
                scope.card = {};

                var formatter = function(value) {
                    if (value && typeof value.brand !== 'undefined') {

                        var cardBrand = cardImages.other;
                        Object.keys(cardImages).forEach(function(brand){
                            if(brand === value.brand) {
                                cardBrand = cardImages[value.brand];
                            }
                        });
                        scope.card.image = cardBrand;
                        scope.card.name = value.cardHolderName;
                        scope.card.number = value.cardNumber;
                        scope.card.expiry = value.expiryDate;
                        return value;
                    }
                };
                ctrl.$formatters.push(formatter);

                scope.updateFontSize = function(data) {
                    element[0].style.fontSize = (data.width / 250 * 100) + '%';
                };
            }
        };
    };

    // @ngInject
    exports.accountWidgetRewards = function() {
        return {
            restrict: 'A',
            scope: {
                value: '@'
            },
            template:
            '<div class="column">' +
                '<div class="chunk-name"><i class="glyphicon glyphicon-calendar"></i><span lp-i18n="rewards"></span></div>' +
                '<div class="chunk-value text-right">{{value}}</div>' +
            '</div>',
            link: function (scope, element, attrs) {

            }
        };
    };

    // @ngInject
    exports.accountWidgetPayment = function() {
        return {
            restrict: 'A',
            scope: {
                value: '@',
                currency: '@'
            },
            template:
            '<div class="column">' +
                '<div class="chunk-name"><i class="glyphicon glyphicon-calendar"></i><span lp-i18n="minimum"></span></div>' +
                '<div class="chunk-value text-right"><span lp-amount="numberValue" lp-amount-currency="currency"/></div>' +
            '</div>',
            link: function (scope, element, attrs) {
                scope.$watch('value', function(value) {
                    scope.numberValue = !isNaN(parseFloat(scope.value)) ? parseFloat(scope.value) : 0;
                });
            }
        };
    };

    // @ngInject
    exports.accountWidgetPayDue = function() {
        return {
            restrict: 'A',
            scope: {
                value: '@',
                currency: '@'
            },
            template:
            '<div class="column" ng-class="{\'bg-danger\':daysToPay<1}">' +
                '<div class="chunk-name"><i class="glyphicon glyphicon-calendar"></i><span lp-i18n="due date"></span></div>' +
                '<div class="chunk-value text-right">{{daysToPay}} day{{daysToPay > 1 || daysToPay < -1 ? \'s\' : \'\'}}</div>' +
            '</div>',
            link: function (scope, element, attrs) {
                scope.$watch('value', function(value){
                    var dateDue = new Date(parseInt(value, 10)).getTime(),
                        currentDate = new Date().getTime(),
                        daysToPay = parseInt((dateDue - currentDate) / (1000 * 3600 * 24), 10);
                    scope.daysToPay = daysToPay;
                });
            }
        };
    };
});
