define(function(require, exports, module) {
	'use strict';

	exports.loginController = function($scope, widget, $http) {

		function buildRequest(user, password) {

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
					j_username: user,
					j_password: password
				}
			}
			return req;
		}


		$scope.user = {
			username :'',
			password : ''
		}


		$scope.getLogin = function() {
			var loginProm = $http(buildRequest($scope.user.username, $scope.user.password));
			loginProm.success(function(res) {
				console.log("login-success", res)
				gadgets.pubsub.publish("login-success");
			})
		};

		$scope.checkLogin = function() {
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