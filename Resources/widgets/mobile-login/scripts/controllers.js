/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function(widget, $http) {
        var ctrl = this;

        ctrl.user = {
            username :'',
            password : ''
        };

        function buildRequest(formData) {

            var LOGINENDPOINT = 'j_spring_security_check';
            var LOGOUTENDPOINT = 'j_spring_security_logout';

            var endpoint = arguments.length > 0 ? LOGINENDPOINT : LOGOUTENDPOINT;

            var req = {
                method: 'POST',
                url: 'http://localhost:7777/portalserver/' + endpoint,
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
                },
                data: {
                    j_username: formData.username || '',
                    j_password: formData.password || ''
                }
            };

            return req;
        }

        ctrl.authenticate = function(data) {
            var req = buildRequest(data);

            $http(req)
                .success(function(res) {
                    if(res && res.status && res.status === 'OK') {
                        gadgets.pubsub.publish('login-success');
                    }
                });
        };

        // The widget needs to inform it's done loading so preloading works as expected
        gadgets.pubsub.publish('cxp.item.loaded', {
            id: widget.model.name
        });
    };
});
