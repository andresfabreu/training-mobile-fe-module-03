/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function(widget, $http) {
        var ctrl = this; //self this controller

        function buildRequest() {
            var serverUrl = b$.portal.config.serverRoot;
            var LOGOUTENDPOINT = 'j_spring_security_logout';

            var req = {
                method: 'POST',
                url: serverUrl + '/' + LOGOUTENDPOINT,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Req-X-Auth-Token': 'JWT'
                },
                //https://docs.angularjs.org/api/ng/service/$httpParamSerializerJQLike
                transformRequest: function(obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            };

            return req;
        }

        ctrl.logout = function() {
            var req = buildRequest();

            $http(req)
                .success(function(res) {
                    gadgets.pubsub.publish('logout-success');
                });
        };

        // The widget needs to inform it's done loading so preloading works as expected
        gadgets.pubsub.publish('cxp.item.loaded', {
            id: widget.model.name
        });
    };
});
