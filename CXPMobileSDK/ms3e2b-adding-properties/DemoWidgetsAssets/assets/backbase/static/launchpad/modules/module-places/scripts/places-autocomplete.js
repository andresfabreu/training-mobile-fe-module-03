
define(function (require, exports, module) {
    'use strict';
    // @ngInject
    exports.placesAutocomplete = function() {
        var angular = require('base').ng;
        var google = window.google;
      return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            onPlaceChange: '&placesAutocomplete'
        },
        replace: false,
        link: function(scope, element, attrs, ngModelCtrl) {

            var autocomplete = new google.maps.places.Autocomplete(element[0]);

            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace(),
                    isValid = !!place.geometry;

                var args = {
                    place: place
                };

                if ( isValid ) {
                    var location = place.geometry.location;
                    angular.extend(args, {
                        lat: location.lat(),
                        lng: location.lng()
                    });
                }

                scope.$apply(function() {
                    ngModelCtrl.$setValidity('place', isValid);
                    ngModelCtrl.$setViewValue(element.val());
                    scope.onPlaceChange(args);
                });
            });

            // Prevent IE from closing widget on enter
            element.bind('keydown', function(e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                }
            });
        }
      };
    };
});
