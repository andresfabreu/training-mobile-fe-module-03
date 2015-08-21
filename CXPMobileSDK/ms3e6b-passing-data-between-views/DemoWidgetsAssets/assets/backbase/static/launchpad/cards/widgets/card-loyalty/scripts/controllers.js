define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.cardLoyaltyController = function($scope, lpWidget, CardsModel, lpCoreBus) {
        var bus = lpCoreBus;
        /**
         * Fetch data from source.
         */
        var readCardLoyaltyData = function(cardId) {

            $scope.cardsModel.loadCardLoyaltyDetails(cardId);
        };

        var initialize = function() {
            $scope.cardsModel = CardsModel.getInstance({
                cardsEndpoint: lpWidget.getPreference('cardDataSrc')
            });

            bus.subscribe('launchpad-retail.cardSelected', function(params) {
                var account = params.account;
                if (account && account.id) {
                    readCardLoyaltyData(account.id);
                }
            });
        };

        initialize();
    };
});
