define(function(require, exports, module) {
    'use strict';

	exports.overviewContentController = function($scope, widget, $http) {

		// Workaround for desktop environment - $(contextRoot) will not be replace automatically
		var source = widget.getPreference('dataSource').replace("$(contextRoot)", "");

		// Get content from a JSON file
		$http.get(window.b$.portal.config.resourceRoot + source).success(function(data) {
		    $scope.features = data;
		});

		// The widget needs to inform it's done loading so preloading works as expected
		gadgets.pubsub.publish('cxp.item.loaded', {id:widget.id});
	};
})