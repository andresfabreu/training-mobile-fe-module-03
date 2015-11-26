define(function (require, exports, module) {
    'use strict';

    exports.lpPlacesUtils = {
        maxLengthLabel: 3, // Marker's label maximum size
        markerColorPool: ['#FF8355', '#6FADD4', '#E69215', '#74AED3', '#C73935', '#443647', '#38706D', '#1D415B'],
        markerWidth: 25,
        markerHeight: 35,
        markerFontFamily: 'Arial',
        titleField: 'name', // Field used as title on the marker
        alertTimeout: 5000, // Milliseconds until an alert will auto-close,
        isCanvasSupported: function isCanvasSupported() {
            return !!document.createElement('canvas').getContext;
        },
        maps: window.google && window.google.maps

    };

});
