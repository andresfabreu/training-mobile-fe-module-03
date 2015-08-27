define( function (require, exports, module) {
	'use strict';

	// @ngInject
	exports.lpCheckbox = function() {

		function lpCheckboxCtrl(scope, el, attrs) {
			scope.label = attrs.label || '';
		}

		var tmpl = [
			'<label>',
				'<input type="checkbox" ng-model="checked" ng-disabled="disabled" /> {{label | translate}}',
			'</label>'
		].join('');

		function compileFn() {
			return lpCheckboxCtrl;
		}

		return {
			scope: {
				config: '=lpCheckbox',
				checked: '=ngModel',
				disabled: '=ngDisabled'
			},
			restrict: 'AE',
			require: '?^ngModel',
			compile: compileFn,
			template: tmpl
		};
	};
});
