/*global define, gadgets*/
define(function (require, exports, module) {
    'use strict';

    var base = require('base');
    var util = window.lp.util;
    var angular = base.ng;


    // @ngInject
    exports.placesList = function(lpWidget, lpUIResponsive) {


        var responsive = lpUIResponsive;
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
                $scope.weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                $scope.css = {
                    'detailSection': 'col-md-6 col-xs-6'
                };
                function formatTime(time) {
                    //time format is: 0900-1700
                    var splittedTime = time.split('-'),
                        formatted;
                        formatted = splittedTime[0].substring(0, 2) + ':' + splittedTime[0].substring(2);
                        formatted += ' - ' + splittedTime[1].substring(0, 2) + ':' + splittedTime[1].substring(2);

                    return formatted;
                }

                function formatOpeningHours(place) {
                    place.openingHours.formattedPeriods = [];
                    angular.forEach(place.openingHours.periods, function(period){
                        place.openingHours.formattedPeriods.push({
                            'day': $scope.weekdays[period.day],
                            'time': formatTime(period.time)
                        });
                    });
                }



                function initialize() {

                    responsive.enable($element)
                        .rule({
                            'max-width': 420,
                            then: function() {
                                $scope.css.detailSection = 'col-md-12 col-xs-12';
                            }
                        })
                        .rule({
                            'min-width': 421,
                            then: function() {
                                $scope.css.detailSection = 'col-md-6 col-xs-6';
                            }
                        });
                }

                $scope.openDetails = function(place) {

                    if(place.showDetails === false || place.showDetails === undefined) {
                        place.showDetails = true;

                        place.mapUrl = $scope.map.staticMapApiUrl +
                                        '?zoom=' + $scope.map.staticMapZoom +
                                        '&size=' + $scope.map.staticMapThumbSize +
                                        '&markers=color:red%7C' + place.location.latitude + ',' +
                                        place.location.longitude;

                        place.directionUrl = $scope.map.directionApiUrl + '?daddr=' + place.location.latitude + ',' + place.location.longitude;

                        formatOpeningHours(place);
                    }
                };

                $scope.closeDetails = function(place, $event) {
                    $event.stopPropagation();
                    place.showDetails = false;
                };

                $scope.loadMorePlaces = function() {
                    gadgets.pubsub.publish('launchpad-retail.places.loadMore', {}, true);
                };


                initialize();
            }],
            templateUrl: util.widgetBaseUrl(lpWidget) + '/templates/placesList.html'
        };
    };

});
