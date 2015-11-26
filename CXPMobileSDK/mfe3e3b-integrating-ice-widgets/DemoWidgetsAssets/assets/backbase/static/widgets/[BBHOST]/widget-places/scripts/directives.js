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

    // @ngInject
    exports.tabContentsFillHeight = function($window, lpCoreUtils, lpCoreBus, lpWidget, $timeout) {

        function getPosition(element){
            var body = document.body,
              win = document.defaultView,
              docElem = document.documentElement,
              box = document.createElement('div');
            box.style.paddingLeft = box.style.width = '1px';
            body.appendChild(box);
            var isBoxModel = box.offsetWidth === 2;
            body.removeChild(box);
            box = element.getBoundingClientRect();
            var clientTop = docElem.clientTop || body.clientTop || 0,
              clientLeft = docElem.clientLeft || body.clientLeft || 0,
              scrollTop = win.pageYOffset || isBoxModel && docElem.scrollTop || body.scrollTop,
              scrollLeft = win.pageXOffset || isBoxModel && docElem.scrollLeft || body.scrollLeft;
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft};
        }

        return {
            restrict: 'C',
            replace: true,
            priority: 500,
            link: function (scope, element) {
                if(!scope.fillViewportHeight){
                    return;
                }
                function changeHeightHandler() {
                    $timeout(function () {
                        var node = element[0],
                          doc = $window.document,
                          tabsContent = doc.querySelector('.tabs-content'),
                          position = getPosition(tabsContent),
                          style = $window.getComputedStyle(tabsContent, null),
                          marginBottom = parseInt(style.marginBottom, 10),
                          viewPort = {
                              width: Math.max(doc.documentElement.clientWidth, window.innerWidth || 0),
                              height: Math.max(doc.documentElement.clientHeight, window.innerHeight || 0)
                          };
                        node.style.height = ((viewPort.height - position.top) - marginBottom) + 'px';
                        if (node.offsetHeight < node.scrollHeight) {
                            node.style.overflowY = 'scroll';
                        } else {
                            node.style.overflowY = 'visible';
                        }
                    });
                }

                scope.$on('view-changed', changeHeightHandler);
                $window.addEventListener('resize', changeHeightHandler);
            }
        };
    };

});
