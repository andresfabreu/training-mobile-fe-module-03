define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery');

    // @ngInject
    exports.placesAutocomplete = function (lpPlacesUtils, lpCoreUtils) {

        function linkFn(scope, element, attrs, ngModelCtrl) {
            console.log('inside autocomplete');
            var autocomplete = new lpPlacesUtils.maps.places.Autocomplete(element[0]);

            lpPlacesUtils.maps.event.addListener(autocomplete, 'place_changed', function () {
                var place = autocomplete.getPlace(),
                    isValid = !!place.geometry;

                var args = {
                    place: place
                };

                if (isValid) {
                    var location = place.geometry.location;
                    lpCoreUtils.assign(args, {
                        lat: location.lat(),
                        lng: location.lng()
                    });
                }

                scope.$apply(function () {
                    ngModelCtrl.$setValidity('place', isValid);
                    ngModelCtrl.$setViewValue(element.val());
                    scope.onPlaceChange(args);
                });
            });

            // Prevent IE from closing widget on enter
            element.bind('keydown', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                }
            });
        }

        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                onPlaceChange: '&placesAutocomplete'
            },
            replace: false,
            link: linkFn,
            compile: function () {
                /**
                 * Fix to make the google maps autocomplete work in the webview using FastClick
                 * http://stackoverflow.com/questions/21158507/google-places-autocomplete-issue-on-ios7-webview
                 */
                $(document).on({
                    'DOMNodeInserted': function () {
                        $('.pac-item, .pac-item span', this).addClass('needsclick');
                    }
                }, '.pac-container');

                return linkFn;
            }
        };
    };
});
