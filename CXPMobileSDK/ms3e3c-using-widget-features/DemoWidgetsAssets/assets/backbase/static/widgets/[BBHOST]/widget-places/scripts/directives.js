define(function (require, exports, module) {

    'use strict';

    // @ngInject
    exports.placesList = function(lpCoreUtils, lpCoreBus, lpWidget) {

        return {
            restrict: 'A',
            replace: true,
            scope: {
                places: '=placesObjects',
                map: '=mapObject',
                filters: '=filterObject'
            },
            controller: ['$scope', '$element', 'angulargmUtils', function($scope, $element, angulargmUtils) {
                $scope.isOldBrowser = angulargmUtils.isOldBrowser();

                $scope.css = {
                    'detailSection': 'col-md-6 col-xs-6'
                };


                $scope.openDetails = function(place) {

                    if(place.showDetails === false || place.showDetails === undefined) {
                        place.showDetails = true;

                        place.mapUrl = $scope.map.staticMapApiUrl +
                                        '?zoom=' + $scope.map.staticMapZoom +
                                        '&size=' + $scope.map.staticMapThumbSize +
                                        '&markers=color:red%7C' + place.location.latitude + ',' +
                                        place.location.longitude;

                        place.directionUrl = $scope.map.directionApiUrl + '?daddr=' + place.location.latitude + ',' + place.location.longitude;

                    }
                };

                $scope.closeDetails = function(place, $event) {
                    $event.stopPropagation();
                    place.showDetails = false;
                };

                $scope.loadMorePlaces = function() {
                    lpCoreBus.publish('launchpad-retail.places.loadMore', {}, true);
                };

            }],

            templateUrl: lpCoreUtils.getWidgetBaseUrl(lpWidget) + '/templates/placesList.html'
        };
    };

});
