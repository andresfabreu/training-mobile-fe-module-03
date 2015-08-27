
define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.CardOverviewController = function($scope, lpWidget, i18nUtils, httpService, CardsModel, lpCoreBus, lpCoreUtils) {

        var bus = lpCoreBus;
        $scope.cardRewards = 0;
        $scope.cardMinimum = 0;
        $scope.cardDueDate = (new Date()).getTime();

        var loadCardDetails = function(cardId) {
            var promise = $scope.cardsModel.loadCardDetails(cardId);

            promise.then(function() {
                // console.log($scope.cardsModel.selected.details[5].value);
                $scope.cardsModel.loadCardLoyaltyDetails().then(function() {
                    var i;
                    for (i = 0; i < $scope.cardsModel.selected.loyalty.length; i++) {
                        if ($scope.cardsModel.selected.loyalty[i].id === 'TOTAL_REWARDS') {
                            $scope.cardRewards = $scope.cardsModel.selected.loyalty[i].value;
                            break;
                        }
                    }
                    if ($scope.cardsModel.selected.details) {
                        for (i = 0; i < $scope.cardsModel.selected.details.length; i++) {
                            if ($scope.cardsModel.selected.details[i].id === 'NEXT_CLOSING_DATE') {
                                $scope.cardDueDate = $scope.cardsModel.selected.details[i].value;
                            }
                            if ($scope.cardsModel.selected.details[i].id === 'MINIMUM_PAYMENT_DUE') {
                                $scope.cardMinimum = $scope.cardsModel.selected.details[i].value;
                            }
                        }
                    }
                });
                bus.publish('launchpad-retail.cardSelected', {
                    account: $scope.cardsModel.selected,
                    originType: 'card-overview'
                });
            });
        };

        var loadCards = function() {

            var promise = $scope.cardsModel.load();

            promise.then(function() {
                //cards have been loaded, load first card details
                loadCardDetails($scope.cardsModel.cards[0].id);
            });
        };



        // Initialize
        var initialize = function () {

            $scope.mediaDir = lpCoreUtils.getWidgetBaseUrl(lpWidget) + '/media';
            $scope.cardsModel = CardsModel.getInstance({
                cardsEndpoint: lpWidget.getPreference('cardDataSrc')
            });

            loadCards();

            bus.subscribe('launchpad-retail.cardSelected', function(params) {
                var account = params.account;
                if (account && account.id && params.originType !== 'card-overview') {
                    loadCardDetails(account.id);
                }
            });
        };

        $scope.cardChanged = function () {
            loadCardDetails($scope.cardsModel.selected.id);
        };



        initialize();
    };
});
