define(function(require, exports, module) {
    'use strict';

	exports.overviewContentController = function($scope, widget, $http) {

		// Get content from a JSON file
		$http.get(window.b$.portal.config.resourceRoot + widget.getPreference('dataSource')).success(function(data) {
		    $scope.features = data;
		});

		// The widget needs to inform it's done loading so preloading works as expected
		gadgets.pubsub.publish('cxp.item.loaded', {id:widget.model.name});
	};
})