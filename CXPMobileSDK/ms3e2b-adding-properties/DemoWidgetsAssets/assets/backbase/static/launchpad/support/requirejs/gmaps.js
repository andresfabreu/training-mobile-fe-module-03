// Convert Google Maps into an AMD module
define(["async!http://maps.google.com/maps/api/js?libraries=places&sensor=true&"], function() {
    return window.google.maps;
});
