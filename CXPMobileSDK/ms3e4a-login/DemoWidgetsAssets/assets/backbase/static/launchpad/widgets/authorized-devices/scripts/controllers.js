define(function(require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function(lpWidget, $scope, lpDevices, lpCoreError) {

        var ctrl = this;
        var lpDevicesModel = lpDevices.api();
        var deviceRevokeEnabled = lpWidget.getPreference('deviceRevokeEnabled') || false;

        // load all devices from server
        var loadDevices = function () {
            lpDevicesModel.getAll()
                .then(function(devices) {
                    ctrl.devices = devices;
                }, function(error) {
                    lpCoreError.captureException(error);
                });
        };

        // revoke specific device from list
        var revokeCallback = function(item) {
            lpDevicesModel.revoke(item.deviceId)
                .then(function() {
                    loadDevices();
                }, function(error) {
                    lpCoreError.captureException(error);
                });
        };

        // here we store action buttons
        ctrl.cardButtons = [];

        // add revoke button (if enabled)
        if (deviceRevokeEnabled) {
            ctrl.cardButtons.push({
                label: 'Revoke',
                onclick: revokeCallback
            });
        }

        loadDevices();
    };
});
