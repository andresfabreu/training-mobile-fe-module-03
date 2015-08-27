define( function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpTrustedDevice = function(lpCoreBus, lpCoreUtils, lpCoreError, $q) {
        var deviceIdDeferred = $q.defer();
        var deviceDeferred = $q.defer();

        lpCoreBus.subscribe('widget-device-dna:data:ready', function(data) {
            deviceDeferred.resolve(data);
        });

        var API = {
            requestDevice: function() {
                return deviceDeferred.promise;
            },

            setDeviceId: function(id) {
                deviceIdDeferred.resolve(id || '');
            },

            getDeviceId: function() {
                return deviceIdDeferred.promise;
            },

            storeDeviceId: function(id) {
                lpCoreBus.publish('widget-device-dna:device:ready', id);
            }
        };

        return API;
    };
});
