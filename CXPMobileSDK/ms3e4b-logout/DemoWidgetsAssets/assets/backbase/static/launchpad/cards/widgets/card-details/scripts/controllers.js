define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.cardDetailsController = function($scope, i18nUtils, lpWidget, CardsModel, lpCoreBus) {

        var bus = lpCoreBus;
         //read the details of a card based on its id
        var readCardData = function(cardId) {

            var promise = $scope.cardsModel.loadCardDetails(cardId);

            promise.then(function(card) {
                $scope.control.nickname.value = card.alias;
                $scope.iconPicker.selectedColor = card.iconColor;
            });

        };

        var initialize = function() {

            $scope.cardsModel = CardsModel.getInstance({
                cardsEndpoint: lpWidget.getPreference('cardDataSrc')
            });

            $scope.control = {
                nickname: {
                    value: '',
                    errors: [],
                    loading: false,
                    validate: function(value) {
                        if(value.length < 3) {
                            return 'invalid_nickname';
                        }
                        return true;
                    }
                }
            };

            $scope.iconPicker = {
                label: 'Icon Color',
                iconClass: 'lp-icon-credit-card',
                selectedColor: ''
            };

            $scope.errorMessages = {
                'invalid_nickname': 'Please fill in your card\'s Nickname.'
            };

            bus.subscribe('launchpad-retail.cardSelected', function(params) {
                var account = params.account;
                if (account && account.id) {
                    readCardData(account.id);
                }
            });
        };


        $scope.save = function(field, value) {

            if($scope.cardsModel.selected.id) {
                $scope.cardsModel.selected[field] = value;

                $scope.cardsModel.selected.$update({id: $scope.cardsModel.selected.id});
            }
        };

        initialize();
    };
});
