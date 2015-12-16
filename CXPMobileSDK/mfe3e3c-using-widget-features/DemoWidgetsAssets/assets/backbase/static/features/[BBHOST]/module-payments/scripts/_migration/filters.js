define(function(require, exports, module) {
    'use strict';

    /**
     * Angular filter to put visual indicator between every set of 4 characters
     */
    exports.addSeperator = function() {

        var visualIndicator = " ";

        //add spaces function
        var addVisualIndicator = function(input) {
            if(input.length === 4) {
                input += visualIndicator;
            }

            return input;
        };

        return function(input) {
            if(input) {

                //remove all spaces from input
                input = input.split(visualIndicator).join("");
                input = input.toUpperCase();

                //split every 4 characters and remainder
                var tempArray = input.match(/.{1,4}/g);
                var newInput = "";

                for(var i = 0; i < tempArray.length; i++) {
                    if(i !== tempArray.length - 1) {
                        tempArray[i] = addVisualIndicator(tempArray[i]);
                    }

                    //append new value to newInput
                    newInput += tempArray[i];
                }

                return newInput;
            }
        };
    };

    /**
     * Angular filter to put visual indicator between every set of 4 characters
     */
    exports.addSeperator = function() {

        var visualIndicator = " ";

        //add spaces function
        var addVisualIndicator = function(input) {
            if(input.length === 4) {
                input += visualIndicator;
            }

            return input;
        };

        return function(input) {
            if(input) {

                //remove all spaces from input
                input = input.split(visualIndicator).join("");
                input = input.toUpperCase();

                //split every 4 characters and remainder
                var tempArray = input.match(/.{1,4}/g);
                var newInput = "";

                for(var i = 0; i < tempArray.length; i++) {
                    if(i !== tempArray.length - 1) {
                        tempArray[i] = addVisualIndicator(tempArray[i]);
                    }

                    //append new value to newInput
                    newInput += tempArray[i];
                }

                return newInput;
            }
        };
    };
});