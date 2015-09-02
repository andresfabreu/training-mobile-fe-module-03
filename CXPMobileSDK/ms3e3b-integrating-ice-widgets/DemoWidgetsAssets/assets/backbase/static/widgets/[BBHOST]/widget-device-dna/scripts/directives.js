define(function(require, exports, module) {
    'use strict';

    var ca = window.ca;
    var portalName = (window.b$ && window.b$.portal && window.b$.portal.portalName) || '';

    // @ngInject
    exports.lpDeviceDna = function($http, $timeout, lpWidget, lpCoreUtils, lpCoreBus, lpCoreError) {
        function linkFn(scope, elem, attrs) {
            var client;
            var ipAddress = lpCoreUtils.getPortalProperty('ipAddress');

            function configureClient(flag){
                //configure the client properties.

                client.setProperty('format', 'json');
                // set the desired name for the cookie
                client.setProperty('didname', 'RISKFORT_COOKIE');
                client.setProperty('externalip', ipAddress);

                // turn off flash
                // client.setProperty("noFlash", true);

                /// configure MESC values
                // client.setProperty("mescmaxIterations", 2);
                // client.setProperty("mesccalibrationduration", 150);
                // client.setProperty("mescintervaldelay", 45);
            }

            function buildData() {
                return {
                    'ipAddress': ipAddress,
                    'callerID': portalName,
                    'deviceID': client.getDID(),
                    'deviceSignature': client.getDNA()
                };
            }

            function computeDDNA() {
                client.processDNA();
                $timeout(function() {
                    var data = buildData();
                    lpCoreBus.publish('widget-device-dna:data:ready', data);
                });
            }

            function readyCallback(flag){
                configureClient();
                computeDDNA();
            }

            // Initialize
            try {
                client = new ca.rm.Client();
                var contextPath = lpCoreUtils.getWidgetBaseUrl(lpWidget) + '/scripts/libs';
                client.setProperty('baseurl', contextPath);
                client.loadFlash(readyCallback);
                lpCoreBus.subscribe('widget-device-dna:device:ready', function(deviceId) {
                    client.setDID(deviceId);
                });
            } catch(e) {
                lpCoreError.captureException(e);
            }
        }

        function compileFn(elem, attrs) {
            return linkFn;
        }

        // Directive configuration
        return {
            scope: {},
            restrict: 'AE',
            compile: compileFn
        };
    };
});
