define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.PlacesCtrl = function($scope, $q, $filter, $timeout, lpWidget, lpPlaces, lpPlacesUtils, lpCoreUtils, httpService, angulargmUtils, lpCoreError) {

        var PlacesError = lpCoreError.createException('PlacesError');
        var assignedColors = {}; // Colors assigned to types
        var markerColorPool = lpCoreUtils.clone(lpPlacesUtils.markerColorPool); // Color polor for instance

        function centerMap() {
            $scope.map.zoom = parseInt(lpWidget.getPreference('zoom'), 10);
            $timeout(function() {
                $scope.map.center = new lpPlacesUtils.maps.LatLng($scope.latitude, $scope.longitude);
            }, 250);
        }

        function handleError(err) {
            var message = err.message || err.data;
            $scope.status.isError = true;
            lpCoreError.captureException(err);
            $scope.addAlert(message, 'danger', lpPlacesUtils.alertTimeout);
        }

        function mapFilterResults(data) {
            $scope.filters = lpCoreUtils
                .merge(data.types, data.services) // combine
                .map(function(filter) {
                    return {
                        id: filter.id,
                        label: filter.label,
                        selected: true //select them all
                    };
                });
        }

        function readFilterData() {
            var filterService = httpService.getInstance({
                endpoint: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('filterDataSrc'))
            });
            return filterService.read()
                .success(mapFilterResults)
                .error(function(){
                    lpCoreError.throwException( new PlacesError('Unable to fetch data.') );
                });
        }

        function getSelectedFilterTypes() {
            return lpCoreUtils($scope.filters).chain()
                .filter({'selected': true})
                .pluck('id')
                .value();
        }

        function readLocationData() {
            $scope.status.isLoading = true;
            var hasCoords = lpCoreUtils.isUndefined($scope.latitude) && lpCoreUtils.isUndefined($scope.longitude);
            lpCoreError.assert(hasCoords === false, 'Missing coordonates.');

            $scope.selectedTypes = getSelectedFilterTypes();
            /**
             * Fetch data from source.
             */
            var locationService = httpService.getInstance({
                endpoint: lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('placesDataSrc'))
            });

            return locationService.read({
                lat: $scope.latitude,
                long: $scope.longitude,
                // services types
                type: $scope.selectedTypes.join(','),
                //Radius in ok from current location
                radius: $scope.radius
                    //Pagination
                    // limit: params.pageSize,
                    // offset: params.nextPage * params.pageSize,

            }).success(function(data) {
                $scope.status.isLoading = false;
                // TODO fix api on no results found now is returning
                // data returns ["No Results Found."] should be empty array
                var locations = data.locations || [];
                if (locations[0] && lpCoreUtils.isString(locations[0]) && locations[0].indexOf('No') > -1) {
                    $scope.data = {
                        locations: []
                    };
                } else {
                    // locations
                    //#TODO create a Widget data Service to enhance/transform the API response model
                    lpCoreUtils.each(locations, function(place) {
                        var hasTimes = lpCoreUtils.isPlainObject(place.openingHours) &&
                                        lpCoreUtils.isUndefined(place.openingHours.periods) === false;
                        if( hasTimes ){
                            lpCoreUtils.map(place.openingHours.periods, function(period) {
                                var weekDay = lpCoreUtils.date().isoWeekday(parseInt(period.day, 10));
                                period.dayShort = weekDay.format('ddd');
                                period.day = weekDay.format('dddd');
                                period.time = lpCoreUtils.trim(period.time, '-');
                            });
                        }
                    });
                    $scope.data = locations;
                }
                centerMap();

            });
        }

        function getColor(type) {
            /*
             * Check if given id is already assigned a color, otherwise return one from the pool
             */

            if (!assignedColors[type]) {
                assignedColors[type] = markerColorPool.shift();
            }
            return assignedColors[type];
        }

        // move module to lpPlaces
        function getLocation() {
            var deferred = $q.defer();
            var promise = deferred.promise;
            if ('geolocation' in window.navigator && lpWidget.getPreference('currentPosition')) {
                navigator.geolocation.getCurrentPosition(function(geo) {
                    $scope.latitude = geo.coords.latitude;
                    $scope.longitude = geo.coords.longitude;
                    deferred.resolve($scope);
                });

            } else if (lpWidget.getPreference('latitude') && lpWidget.getPreference('longitude')) {
                $scope.latitude = lpWidget.getPreference('latitude');
                $scope.longitude = lpWidget.getPreference('longitude');
                deferred.resolve($scope);
            } else {
                lpCoreError.throwException( new PlacesError('Missing Latitude and Longitude.') );
            }
            return promise;
        }

        function attachEvents() {
            // Re-initialize on preferences change
            lpWidget.addEventListener('preferencesSaved', function() {
                lpWidget.refreshHTML();
            });

            $scope.onZoomChanged = function(map, $event) {
                var maxZoomOut = $scope.options.map.maxZoomOut;
                if (map.getZoom() < maxZoomOut) {
                    map.setZoom(maxZoomOut);
                }
            };
        }

        function initialize() {

            readFilterData()
                .then(getLocation)
                .then(readLocationData)
                .then(attachEvents)
                ['catch'](handleError)
                ['finally'](function(){
                    $scope.status.isLoading = false;
                });


        }

        $scope.mapId = lpWidget.id;

        $scope.title = lpWidget.getPreference('title');

        // Initial options
        $scope.options = {
            map: {
                maxZoomOut: lpWidget.getPreference('maxZoomOut') || 0,
                mapTypeId: lpPlacesUtils.maps.MapTypeId.ROADMAP,
                panControl: lpCoreUtils.parseBoolean(lpWidget.getPreference('panControl')),
                styles: [{
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{
                        visibility: lpCoreUtils.parseBoolean(lpWidget.getPreference('showPOI')) ? 'on' : 'off'
                    }]
                }]
            }
        };

        $scope.status = {
            isLoading: true,
            isError: false,
            isopen: false
        };

        $scope.map = {};

        $scope.map.staticMapApiUrl = lpWidget.getPreference('staticMapApiUrl');
        $scope.map.staticMapZoom = lpWidget.getPreference('staticMapZoom');
        $scope.map.staticMapThumbSize = lpWidget.getPreference('staticMapThumbSize');
        $scope.map.directionApiUrl = lpWidget.getPreference('directionApiUrl');
        $scope.radius = lpWidget.getPreference('placesFilterRadius') || 50;
        $scope.viewStatus = '';

        /**
         * Responsive logic to handle size changes.
         */
        $scope.sizeRules = [{
            max: 200,
            size: 'tile'
        }, {
            min: 201,
            max: 450,
            size: 'small'
        }, {
            min: 451,
            size: 'normal'
        }];

        /**
         * Alert messages.
         */
        $scope.alerts = [];
        $scope.selectedTypes = getSelectedFilterTypes();
        $scope.$watch('data', function() {
            // Redraw locations
            if( !lpCoreUtils.isUndefined($scope.data) ){
                $scope.places = $scope.data;
                $scope.redraw();
            }

        }, true);

        $scope.$watch('filters', lpCoreUtils.debounce(function() {
            if (!$scope.status.isLoading && !$scope.status.isError) {
                readLocationData();
            }
        }, 800), true);


        /**
         * Define marker's properties and visibility.
         * Called every time map is redraw.
         */
        $scope.getMarkerOptions = function(object) {
            var label = object.abbr || object.type.label,
                icon = object.icon,
                title = object[lpPlacesUtils.titleField];

            // Shorten label to fit inside the marker
            if (label.length > lpPlacesUtils.maxLengthLabel) {
                label = label.charAt(0);
            }

            // Create custom icon
            if (!icon) {
                var color = object.color || getColor(object.type.id);
                icon = lpPlacesUtils.isCanvasSupported() ? lpPlaces.canvasIcon(label, color) : lpPlaces.googleIcon(label, color);
                object.icon = icon;
            }

            return {
                title: title ? title + '' : '', // Make sure this is a string
                icon: icon
            };
        };

        function selectFirstResult() {
            var $ = require('jquery');
            var firstResult = $('.pac-container .pac-item:first').text();
            var result;
            var deferred = $q.defer();
            var promise = deferred.promise;
            var geocoder = new lpPlacesUtils.maps.Geocoder();
            geocoder.geocode({'address': firstResult }, function(results, status) {
                if (status === lpPlacesUtils.maps.GeocoderStatus.OK) {
                    result = {
                        place: results[0],
                        location: results[0].geometry.location
                    };
                    deferred.resolve(result);
                    return result;
                } else {
                    deferred.reject();
                }
            });

            return promise;
         }
        /**
         * Search places based on lat/lng coordinates.
         */
        $scope.search = function(result) {
            if (lpCoreUtils.isEmpty(result.location) ) {
                selectFirstResult().then(function(firstResult) {
                    $scope.latitude = firstResult.location.lat();
                    $scope.longitude = firstResult.location.lng();
                    readLocationData().then(function(){
                        $scope.filters.searchname = firstResult.place['formatted_address'];
                    });

                }, function() {
                    $scope.addAlert('The location you provided is not valid!', 'warning', lpPlacesUtils.alertTimeout);
                    return;
                });
            } else {
                $scope.latitude = result.location.lat();
                $scope.longitude = result.location.lng();
                readLocationData();
            }

        };

        // Refresh map
        $scope.redraw = function() {
            $scope.$broadcast('gmMarkersRedraw', 'places');
        };

        $scope.addAlert = function(msg, type, timeout) {
            var alert = {
                msg: msg,
                type: type || 'error'
            };
            $scope.alerts.push(alert);

            if (timeout) {
                $timeout(function() {
                    $scope.closeAlert($scope.alerts.indexOf(alert));
                }, timeout, false);
            }
        };

        $scope.closeAlert = function(index) {
            // debugger;
            if (index > -1) {
                $scope.alerts.splice(index, 1);
            }
        };

        /**
         * Open info window for specific marker
         */
        $scope.openInfoWindow = function(object, marker) {
            $scope.place = object;
            $scope.infoWindow.open(marker.getMap(), marker);
        };

        $scope.resized = function(width) {
            $scope.$broadcast('gmMapResize', $scope.mapId);
        };

        $scope.setView = function(tab) {
            var splitSize = 'col-xs-6',
                fullSize = 'col-xs-12',
                hideMe = 'hidden';

            $scope.viewStatus = tab;
            $scope.mapClass = '';
            $scope.listClass = '';
            $scope.listSize = '';
            $scope.mapSize = '';

            switch ($scope.viewStatus) {
                case 'map':
                    $scope.listClass = hideMe;
                    $scope.mapSize = fullSize;
                    break;
                case 'list':
                    $scope.mapClass = hideMe;
                    $scope.listSize = fullSize;
                    break;
                case 'split':
                    $scope.listSize = splitSize;
                    $scope.mapSize = splitSize;
            }
        };

        // re-drawing markers to make them visible in old browsers (like IE8)
        if (angulargmUtils.isOldBrowser()) {
            $timeout($scope.redraw, 2000);
        }

        $scope.toggleFilter = function($event, filter) {
            $event.stopPropagation(); // avoid the dropdown to close after click
        };

        // Start application
        initialize();
    };
});
