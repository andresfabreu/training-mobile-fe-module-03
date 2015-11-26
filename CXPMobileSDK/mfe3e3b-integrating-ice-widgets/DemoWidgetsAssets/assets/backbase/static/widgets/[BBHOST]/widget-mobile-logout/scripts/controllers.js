define(function(require, exports, module) {
	'use strict';

	exports.logoutController = function($scope, widget, $http) {


		function buildRequest() {
			var LOGOUTENDPOINT = 'j_spring_security_logout';

			var req = {
				method: 'POST',
				url: 'http://localhost:7777/portalserver/' + LOGOUTENDPOINT,
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
			}
			return req;
		}


		$scope.getLogout = function() {
			var logoutProm = $http(buildRequest());
			logoutProm.success(function(res) {
				console.log("logout-success", res)
				gadgets.pubsub.publish("login-success");
			})
		};


		// The widget needs to inform it's done loading so preloading works as expected
		gadgets.pubsub.publish('cxp.item.loaded', {
			id: widget.model.name
		});
	};
})