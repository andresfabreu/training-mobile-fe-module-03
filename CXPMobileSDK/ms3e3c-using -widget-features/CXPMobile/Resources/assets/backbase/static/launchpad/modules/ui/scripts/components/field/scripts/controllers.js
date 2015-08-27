define(function(require, exports, module) {

	'use strict';
	var base = require('base');
	// var utils = base.utils;
	var angular = base.ng;

	// @ngInject
	exports.FieldController = function($scope, $templateCache, $sce, $attrs, $parse, defaultErrorMessages) {

		var self = this, getErrors, setErrors;

		$scope.errors = [];

		var errorMessages = angular.isDefined($attrs.errorMessages) ? angular.copy($scope.$parent.$eval($attrs.errorMessages)) : {};
		errorMessages = angular.extend({}, defaultErrorMessages, errorMessages);

		if ( $attrs.errors ) {
			getErrors = $parse($attrs.errors);
			setErrors = getErrors.assign;

			$scope.$parent.$watch(getErrors, function(errors) {
				$scope.errors = errors;
				$scope.setErrorMessages();
			}, true);

			$scope.$watch('errors', function(errors) {
				if ( setErrors ) {
					setErrors($scope.$parent, errors);
				}
			});
		}

		$scope.setErrorMessages = function() {
			var messages = [];
			if ($scope.errors) {
				for (var i = 0, n = $scope.errors.length; i < n; i++) {
					var error = $scope.errors[i];
					messages.push(self.getErrorMessage(error));
				}
			}
			$scope.errorMessages = messages;
		};

		this.getErrorMessage = function(error) {
			return (errorMessages && errorMessages[error]) ? errorMessages[error] : error;
		};

		this.addError = function(error) {
			$scope.errors.push(error);
		};

		this.clearErrors = function() {
            if ($scope.errors) {
                $scope.errors.length = 0;
            }
		};
	};
});
