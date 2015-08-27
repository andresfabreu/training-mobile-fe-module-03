define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.portfolioController = function($scope, $timeout, widget, i18nUtils, PortfolioService) {

        var getPortfolio = function() {
            var xhr = PortfolioService.read();

            xhr.success(function(data) {
                if(data && data !== 'null') {
                    $scope.isLoading = false;
                    for(var i = 0; i < data.length; i++) {
                        for(var x = 0; x < data[i].conditions.length; x++) {
                            var condition = data[i].conditions[x];
                            if(condition.value instanceof Array) {
                                data[i].conditions[x].type = 'list';
                            }
                        }
                        $scope.products.push(data[i]);
                    }
                }
            });

            xhr.error(function(error) {
                $scope.isLoading = false;
                $scope.errorCode = error.errors[0].code || 500;
                $scope.errorText = 'There is no account information available for this user';
            });

            xhr['finally'](function() {
                $scope.isLoading = false;
            });
        };

        var initialize = function() {
            $scope.title = 'Products';
            $scope.isLoading = true;
            $scope.errorCode = null;
            $scope.errorText = '';

            $scope.products = [];

            $scope.locale = widget.getPreference('locale');
            i18nUtils.loadMessages(widget, $scope.locale).success(function(bundle) {
                $scope.messages = bundle.messages;
            });

            getPortfolio();
        };

        initialize();
    };
});
