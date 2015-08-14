
define(function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpPlaces = function(lpPlacesUtils) {

        // Darw a canvas pin
        var drawPin = function(context, width, height) {
            var radius = width / 2;
            context.beginPath();
            context.moveTo(radius, height);
            context.arc(radius, radius, radius, 0, Math.PI, true);
            context.closePath();
            context.fill();
            context.stroke();
        };

        this.getFilterOptions = function(data) {

            var types = data.types || [],
                services = data.services || [];

            return types.concat(services);
        };

        // Get url for a google pin with custom letter and color
        this.googleIcon = function(label, color) {
            if (color.charAt(0) === '#') {
                color = color.substring(1);
            }
            return 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + label.charAt(0) + '|' + (color || 'FF0000');
        };

        // Create a data url for a canvas pin with custom label and color
        this.canvasIcon = function(label, color, width, height) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            width = width || lpPlacesUtils.markerWidth;
            height = height || lpPlacesUtils.markerHeight;

            canvas.width = width;
            canvas.height = height;

            context.clearRect(0, 0, width, height);

            context.fillStyle = color;
            context.strokeStyle = color;

            drawPin(context, width, height);

            context.fillStyle = 'white';
            context.strokeStyle = 'black';

            // Render Label
            var fontSize = 10 - label.length; // Decide font size based on label's length
            context.font = 'normal ' + fontSize + 'pt ' + lpPlacesUtils.markerFontFamily;
            context.textBaseline = 'top';

            // Centre text
            var textWidth = context.measureText(label);
            context.fillText(label, Math.floor((width / 2) - (textWidth.width / 2)), 4);

            return canvas.toDataURL();
        };

    };

});
