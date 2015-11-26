define(function(require, exports, module) {
    'use strict';

	exports.aboutController = function($scope, widget) {

		// Check if the Contact widget feature is available, if this is the case we process triggers for its services
		var contactFeature = widget.features && widget.features['ContactFeature'];
		if(contactFeature) {

			// Enable the call button
			$scope.callUsEnabled = true;

			// Check if the app is able to send an email via a widget feature
			var isEmailAvailableSuccessCallback = function(data) {
				if(data.result) {
					$scope.emailUsEnabled = true;
				} else {
					$scope.emailUsEnabled = false;
				}
				$scope.$apply();
			};
			var isEmailAvailableErrorCallback = function(data) {
				$scope.emailUsEnabled = false;
			};
			contactFeature.isEmailAvailable().then(
				isEmailAvailableSuccessCallback, 
				isEmailAvailableErrorCallback
			);

			// Define the method that is triggered when the user clicks the email button
			$scope.emailUs = function() {
				
				// Send email
				contactFeature.sendEmail('support@backbase.com', 'Support request from the CXP Mobile app', 'Dear Backbase,\n\n');
			};

			// Define the method that is triggered when the user clicks the call button
			$scope.callUs = function() {
				
				// Call phone number
				contactFeature.callPhoneNumber('0031204658888');
			};

			// Define the method that is triggered when the user clicks on the website button
			$scope.visitWebsite = function() {

				// Redirect the user to the website
				window.location = 'http://www.backbase.com';
			};
		}

		// The widget needs to inform it's done loading so preloading works as expected
		gadgets.pubsub.publish('cxp.item.loaded', {id:widget.model.name});
	};
})