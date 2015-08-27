define( function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpTrustedDeviceCheckbox = function($timeout, lpCoreUtils, lpCoreBus, lpTrustedDevice) {
        var tmpl = [
            '<div class="lp-trusted-device">',
                '<span lp-checkbox="lp-checkbox" ng-model="trusted" label="Trust this device" ng-disabled="disabled"></span> ',
                '<i class="lp-icon lp-icon-info-sign"></i>',
                '<div class="panel-body" ng-show="displayInfoMessage">',
                    '<small class="text-muted" lp-i18n="Please indicate whether you are using a personal device (PC, laptop, etc.) in a \'private\' environment, or whether you are in a public environment, like on a public wifi network"></small>',
                '</div>',
            '</div>'
        ].join('');

        function linkFn(scope, el, attrs) {
            var model = {};
            var delay = scope.hideDelay || 500;
            var timeoutPromise;
            var toggleInfoMessage = function() {
                scope.displayInfoMessage = !scope.displayInfoMessage;
            };

            scope.displayInfoMessage = false;
            scope.disabled = true;

            // Event listeners
            el.find('i').on('touchstart click', function() {
                scope.$apply(function() {
                    scope.$eval(toggleInfoMessage);
                });
            });

            scope.showInfoMessage = function() {
                if (timeoutPromise) {
                    $timeout.cancel(timeoutPromise);
                    timeoutPromise = null;
                }
                scope.displayInfoMessage = true;
            };

            scope.hideInfoMessage = function() {
                timeoutPromise = $timeout(function() {
                    scope.displayInfoMessage = false;
                    timeoutPromise = null;
                }, delay);
            };

            lpTrustedDevice.requestDevice().then(function(data) {
                model.deviceId = data.deviceID || '';
                model.deviceSignature = data.deviceSignature;

                scope.trusted = !!model.deviceId;
                scope.disabled = false;
            });

            lpTrustedDevice.getDeviceId().then(function(deviceId) {
                lpTrustedDevice.storeDeviceId(scope.trusted ? deviceId : '');
            });

            scope.$watch('trusted', function(current, old) {
                if (!current) {
                    delete scope.model.deviceId;
                    delete scope.model.deviceSignature;
                } else {
                    scope.model.deviceId = model.deviceId;
                    scope.model.deviceSignature = model.deviceSignature;
                }
            });
        }

        function compileFn() {
            return linkFn;
        }

        return {
            scope: {
                trusted: '=',
                hideDelay: '=',
                model: '=ngModel'
            },
            restricted: 'A',
            require: '?^ngModel',
            template: tmpl,
            compile: compileFn
        };
    };
});
