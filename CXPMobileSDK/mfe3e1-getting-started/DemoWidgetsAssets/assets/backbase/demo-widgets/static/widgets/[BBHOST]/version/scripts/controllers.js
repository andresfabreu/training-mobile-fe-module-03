define(function(require, exports, module) {
    'use strict';

	exports.versionController = function($scope, widget, $http) {


		// Function that will request version data
		var requestVersionData = function(versionIndex) {

			// Get content from a JSON file
			$http.get(window.b$.portal.config.resourceRoot + widget.getPreference('dataSource'))
				.success(function(data) {

					// Get the selected version and apply it
				    $scope.version = data[versionIndex];
				});

		};

		// Listen for a pub/sub event notifying that the version content is changed (caused by the user clicking another version). This will only happen when this widget is already preloaded
		gadgets.pubsub.subscribe('versionClicked', function(data) {
			requestVersionData(data.versionIndex);
        });

        // Initialize the widget with data from the last-selected version (if available). This is mainly important for cases when this widget is not preloaded
        var versionIndex = widget.preferences.getItem('versionClicked');
        if(versionIndex && versionIndex.length) {
        	requestVersionData(versionIndex);
        }
       
        // The widget needs to inform it's done loading so preloading works as expected
        gadgets.pubsub.publish('cxp.item.loaded', {id:widget.id});
	};
})