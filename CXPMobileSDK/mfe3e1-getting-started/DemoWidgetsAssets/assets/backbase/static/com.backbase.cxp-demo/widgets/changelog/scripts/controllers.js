define(function(require, exports, module) {
    'use strict';

	exports.changelogController = function($scope, widget, $http) {

		// Get content from a JSON file
		$http.get(window.b$.portal.config.resourceRoot + widget.getPreference('dataSource'))
			.success(function(data) {
			    $scope.changelog = data;			   
			});

		// Attach version tapped event handler
		$scope.versionClicked = function(versionIndex) {

			// Store the requested version so the version widget can pick it up (needed when the version widget is not preloaded)
			widget.preferences.setItem('versionClicked', versionIndex);

			// Inform the native app template that it should show the version widget (via the behaviour mapping), and potentially inform the preloaded version widget that it should show the particular selected version
			gadgets.pubsub.publish('versionClicked', {versionIndex: versionIndex});
		};

		// The widget needs to inform it's done loading so preloading works as expected
		gadgets.pubsub.publish('cxp.item.loaded', {id:widget.model.name});

		// This widget needs to request the version widget to be preloaded using Preload on Demand
		gadgets.pubsub.publish('changelog-loaded');
	};
})