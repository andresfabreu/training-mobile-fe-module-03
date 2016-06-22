define(function(require, exports, module) {
    'use strict';

    exports.lpDevices = function() {
        var errorType = 'ModuleDevicesError';
        var config = {
            devicesEndpoint: '/mock/v1/authorized-devices',
            revokeEndpoint: '/mock/v1/authorized-devices/$(deviceId)'
        };

        // @ngInject
        this.$get = function($http, $q, lpCoreUtils, lpCoreError) {
            var CustomException = lpCoreError.createException(errorType);

            function API() {

                var DevicesModel = function() {
                    this.devices = [];
                };

                var decorateDataList = function (list) {

                    if (!list || !lpCoreUtils.isArray(list)) {
                        return [];
                    }

                    lpCoreUtils.forEach(list, function (item) {
                        // handle date format
                        if (item.creationDate) {
                            item.creationDate = Date.parse(item.creationDate);
                        }
                    });

                    return list;
                };

                // get a list of authorized devices
                DevicesModel.prototype.getAll = function() {
                    var d = $q.defer();

                    $http.get(config.devicesEndpoint)
                        .then(function(response) {
                            d.resolve(decorateDataList(response.data));
                        }, function (error) {
                            d.reject(error);
                        });

                    return d.promise;
                };

                // revoke a device from the list of authorized
                DevicesModel.prototype.revoke = function(deviceId) {
                    if (!deviceId) {
                        lpCoreError.throwException( new CustomException('No device ID provided!') );
                    }

                    var d = $q.defer();

                    $http.delete(config.revokeEndpoint, {
                        data: { deviceId: encodeURI(deviceId) }
                    })
                        .then(function() {
                            d.resolve(true);
                        }, function (error) {
                            d.reject(error);
                        });

                    return d.promise;
                };

                return new DevicesModel();
            }

            return {
                setConfig: function(options) {
                    config = lpCoreUtils(options).chain()
                        .mapValues(lpCoreUtils.resolvePortalPlaceholders)
                        .defaults(config)
                        .value();
                    return this;
                },

                getConfig: function(prop) {
                    if (prop && lpCoreUtils.isString(prop)) {
                        return config[prop];
                    } else {
                        return config;
                    }
                },

                api: API
            };
        };
    };
});
