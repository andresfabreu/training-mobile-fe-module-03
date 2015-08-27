define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.dynamicCredentialInput = function($templateCache) {

		$templateCache.put('credentialInput.html',
				'<div ng-switch on="credential.inputFieldType">' +
					'<div ng-switch-when="text">' +
						'<input type="text" class="form-control" ng-model="credential.fieldValue" aria-label="{{credential.inputFieldLabel}}" />' +
					'</div>' +
					'<div ng-switch-when="password">' +
						'<input type="password" class="form-control" ng-model="credential.fieldValue" aria-label="{{credential.inputFieldLabel}}" />' +
					'</div>' +
					'<div ng-switch-when="hidden">' +
						'<input type="hidden" class="form-control" ng-model="credential.fieldValue" aria-label="{{credential.inputFieldLabel}}" />' +
					'</div>' +
					'<div ng-switch-when="select">' +
						'<div dropdown-select="dropdown-select" ng-model="credential.fieldValue" ng-options="option as option for option in credential.options"></div>' +
					'</div>' +
					'<div ng-switch-when="checkbox" class="checkbox">' +
						'<div ng-repeat="option in credential.options">' +
							'<label>' +
								'<input type="checkbox" ng-click="handleMultiCheckbox(option)" aria-label="{{option}}" />' +
								'{{option}}' +
							'</label>' +
						'</div>' +
					'</div>' +
					'<div ng-switch-when="radio" class="radio">' +
						'<div ng-repeat="option in credential.options">' +
							'<label>' +
								'<input type="radio" ng-model="credential.fieldValue" name="radio-{{credential.id}}" value="{{option}}" aria-label="{{option}}" />' +
								'{{option}}' +
							'</label>' +
						'</div>' +
					'</div>' +
					'<div ng-switch-when="img">' +
						'<img ng-src="{{credential.metaData}}" alt="{{credential.inputFieldlabel}}" />' +
						'<br /><br />' +
						'<label class="radio-inline">' +
							'<input type="radio" ng-model="credential.fieldValue" name="radio-{{credential.id}} value="true" aria-label="Yes" />' +
							'Yes' +
						'</label>' +
						'<label class="radio-inline">' +
							'<input type="radio" ng-model="credential.fieldValue" name="radio-{{credential.id}} value="false" aria-label="False" />' +
							'No' +
						'</label>' +
					'</div>' +
					'<div ng-switch-when="imgd">' +
						'<img ng-src="data:{{credential.metaData}}" alt="{{credential.inputFieldlabel}}" />' +
						'<br /><br />' +
						'<label class="radio-inline">' +
							'<input type="radio" ng-model="credential.fieldValue" name="radio-{{credential.id}} value="true" aria-label="Yes" />' +
							'Yes' +
						'</label>' +
						'<label class="radio-inline">' +
							'<input type="radio" ng-model="credential.fieldValue" name="radio-{{credential.id}} value="false" aria-label="False" />' +
							'No' +
						'</label>' +
					'</div>' +
				'</div>');

		return {
			restrict: 'A',
			replace: true,
			require: 'ngModel',
			scope: {
				credential: '='
			},
			template: $templateCache.get('credentialInput.html'),
			link: function (scope, element, attrs, ngModelCtrl) {

				var modelCtrl = ngModelCtrl;

				var inputTypes = {
					"TEXT": "text",
					"PASSWORD": "password",
					"OPTIONS": "select",
					"LOGIN": "text",
					"CHECKBOX": "checkbox",
					"RADIO": "radio",
					"URL": "text",
					"HIDDEN": "hidden",
					"IMAGE_URL": "img",
					"CONTENT_URL": "text",
					"CUSTOM": "text",
					"CLUDGE": "text",
					"TOKEN": "text",
					"IMAGE_DATA": "imgd"
				};

				var initialize = function () {

					formatCredentialType(scope.credential);
				};

				scope.handleMultiCheckbox = function(option) {

					var found = false;

					for(var i = 0; i < scope.credential.fieldValue.length; i++) {
						if(scope.credential.fieldValue[i] === option) {
							found = true;
							scope.credential.fieldValue.splice(i, 1);
							break;
						}
					}

					if(!found) {
						scope.credential.fieldValue.push(option);
					}
				};

				var formatCredentialType = function (credential) {

					credential.inputFieldType = inputTypes[credential.inputFieldType];

					if(credential.inputFieldType === inputTypes.CHECKBOX) {
						credential.fieldValue = [];
					}
				};

				initialize();
			}
		};
	};
});
