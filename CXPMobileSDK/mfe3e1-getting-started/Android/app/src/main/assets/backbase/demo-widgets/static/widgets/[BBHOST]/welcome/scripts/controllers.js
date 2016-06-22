define(function(require, exports, module) {
    'use strict';

	exports.welcomeController = function($scope, widget) {

		// Define the function that is triggered when the "Get started" button is clicked
		$scope.getStarted = function() {

			// Send a pub/sub event to the application that will use this event by checking if there's a matching page in the behaviour map
			gadgets.pubsub.publish("getStartedClicked");
		};

		// The widget needs to inform it's done loading so preloading works as expected
		gadgets.pubsub.publish('cxp.item.loaded', {id:widget.id});
		gadgets.pubsub.publish('home-loaded');
	};
})