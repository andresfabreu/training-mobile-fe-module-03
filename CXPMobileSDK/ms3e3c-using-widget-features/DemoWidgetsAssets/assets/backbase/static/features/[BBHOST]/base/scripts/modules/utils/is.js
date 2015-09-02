/**
 * Testing methods.
 */
define(function(require, exports, module) {

    'use strict';

    /**
     * Check and return true if mobile device/mobile SDK is detected or return false otherwise
     * @return {Boolean}
     */
    exports.isMobileDevice = function() {
        //return true if mobile SDK is present
        if (window.launchpad.mobileSDK) {
            return true;
        }

        var deviceTypes = [
            /iPhone|iPad|iPod/i,
            /Android/i,
            /BlackBerry/i,
            /Opera Mini/i,
            /IEMobile/i,
            /MeeGo/i
        ];

        for (var i = 0, l = deviceTypes.length; i < l; i++) {
            if (navigator.userAgent.match(deviceTypes[i])) {
                return true;
            }
        }

        return false;
    };

});
