define(function(require, exports, module) {
    'use strict';

	exports.changelogController = function($scope, widget, $http) {

		// Get content from a JSON file
		$http.get(window.b$.portal.config.resourceRoot + widget.getPreference('dataSource'))
			.success(function(data) {
			    $scope.changelog = data;			   
			});

		// Attach version tapped event handler
		$scope.versionClicked = function(version) {

			// Temporary way of passing the version to the preloaded "version" widget. In the upcoming release the "Common Preferences" widget feature is used for this
			gadgets.pubsub.publish ('versionClickedData', version);

			// Inform the native application to display the version as a child of the changelog
			gadgets.pubsub.publish ('versionClicked');
		};

		// The widget needs to inform it's done loading so preloading works as expected
		gadgets.pubsub.publish ('cxp.item.loaded', {id:widget.model.name});
	};
})