define(function(require, exports, module) {

    'use strict';

	// @ngInject
	exports.lpMessage = function() {
		return {
			replace: false,
			restrict: "A",
			scope: {
				"key": "=lpMessage",
				"messages": "=lpBundle"
			},
			template: "{{value}}",
			link: function(scope, element, attrs) {

				var insertMessage = function(key, messages) {

					var value;
					if(messages && messages.hasOwnProperty(key)) {
						value = messages[key];
					} else {
						value = "[" + key + "]";
					}
					scope.value = value;
				};

				scope.$watch("key", function(key) {
					insertMessage(key, scope.messages);
				});
				scope.$watch("messages", function(messages) {
					insertMessage(scope.key, messages);
				});
			}
		};
	};
});
