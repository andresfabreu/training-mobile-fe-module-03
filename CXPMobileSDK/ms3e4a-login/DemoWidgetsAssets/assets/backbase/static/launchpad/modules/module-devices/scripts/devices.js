define(function(require, exports, module) {
    'use strict';

    exports.lpDevices = function() {
        var errorType = 'ModuleDevicesError';
        var config = {
            devicesEndpoint: '/mock/v1/authorized-devices',
            revokeEndpoint: '/mock/v1/authorized-devices/revoke/$(deviceId)'
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

                    lpCoreUtils.forEach(list, function (item, index) {
                        // handle date format
                        item.lastAccess = new Date(item.lastAccess).getTime();

                        // add 'real' boolean values
                        lpCoreUtils.forEach(['isCurrentDevice', 'isCurrentSession'], function (prop) {
                            if (!lpCoreUtils.isBoolean(item[prop])) {
                                item[prop] = item[prop] === 'true' ? true : false;
                            }
                        });
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
                            lpCoreError.throwException( new CustomException(error) );
                        });

                    return d.promise;
                };

                // revoke a device from the list of authorized
                DevicesModel.prototype.revoke = function(deviceId) {
                    if (!deviceId) {
                        lpCoreError.throwException( new CustomException('No device ID provided!') );
                    }

                    var d = $q.defer();

                    $http.put(config.revokeEndpoint, {
                        data: { deviceId: deviceId },
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json;'
                        }
                    })
                        .then(function(response) {
                            d.resolve(true);
                        }, function (error) {
                            lpCoreError.throwException( new CustomException(error) );
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
