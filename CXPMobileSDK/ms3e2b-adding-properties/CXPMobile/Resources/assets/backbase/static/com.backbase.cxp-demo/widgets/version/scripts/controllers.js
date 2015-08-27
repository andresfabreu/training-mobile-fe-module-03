define(function(require, exports, module) {
    'use strict';

	exports.versionController = function($scope, widget, $http) {

		// Listen for a pub/sub event notifying that the version content is changed (caused by the user clicking another version)
		gadgets.pubsub.subscribe('versionClickedData', function(data) {
			 $scope.version = data;
			 $scope.$apply();
		});
	};
})