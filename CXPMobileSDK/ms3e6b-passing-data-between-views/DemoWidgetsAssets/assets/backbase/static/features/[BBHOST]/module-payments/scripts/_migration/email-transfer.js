define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var angular = base.ng;
    var lpCoreUtils = base.inject('lpCoreUtils', require('core').name);

    // @ngInject
    exports.emailTransfer = function($templateCache, transferTypes) {

		$templateCache.put("$emailTransferTemplate.html",
				'<div class="lp-email-transfer">' +
					'<div ng-class="{\'email-input\': true, \'has-feedback\': email.length > 0, \'has-success\': email.length > 0 && validEmail, \'has-error\': email.length > 0 && !validEmail}">' +
						'<input type="input" ng-model="email" ng-keyup="handleAutoSuggest($event)" placeholder="Email address" class="form-control" aria-label="Email Address" />' +
						'<span ng-if="validEmail && email.length > 0" class="glyphicon glyphicon-ok form-control-feedback"></span>' +
						'<span ng-if="!validEmail && email.length > 0" ng-click="clear()" style="cursor: pointer;" class="glyphicon glyphicon-remove form-control-feedback"></span>' +
					'</div>' +
					'<span ng-if="autoSuggestActive">Did you mean <span ng-click="doAutoSuggest()" class="auto-correct-suggestion">{{autoSuggestion}}</span>?<br /></span>' +
					'<span class="text-muted" style="font-size: 13px;">' +
						'Transfers up to $10.00 will be free of charge. For transfers above $10.00 a fee of $0.25 per transaction will be charged and debited from your account' +
					'</span>' +
				'</div>'
		);

		return {
			restrict: 'EA',
			replace: true,
			require: ["ngModel", "^form"],
			scope: {
				"email": "=ngModel",
				"transferType": "=lpTransferType"
			},
			template: $templateCache.get("$emailTransferTemplate.html"),
			link: function(scope, element, attrs, ctrls) {

				var $inputElement;

				//Initial set up
				/**
				 * intialisation function
				 * @constructor
				 */
				var initialize = function() {

					scope.validEmail = false;

					scope.autoSuggestActive = false;
					scope.autoSuggestion = "";

					$inputElement = angular.element(element.find("input")[0]);

					//initialize suggestions and map only once
					var suggestions = {
						gmail: "gmail",
						yahoo: "yahoo",
						backbase: "backbase"
					};

					scope.suggestionsMap = {
						"gmaik": suggestions.gmail,
						"gmain": suggestions.gmail,
						"gmal": suggestions.gmail,
						"gmakl": suggestions.gmail,
						"mgail": suggestions.gmail,
						"yaho": suggestions.yahoo,
						"yahooo": suggestions.yahoo,
						"yagoo": suggestions.yahoo,
						"bakbase": suggestions.backbase,
						"backbas": suggestions.backbase,
						"baclbase": suggestions.backbase

					};
				};

				//controllers
				var modelCtrl = ctrls[0], formCtrl = ctrls[1], associatedTransferType = transferTypes.p2pEmail;

				modelCtrl.$name = attrs.name;
				formCtrl.$addControl(modelCtrl);

				modelCtrl.$formatters.push(function(value) {

					if(value !== undefined || value !== null) {
						//validate email
						scope.validEmail = validateEmail(value ? value.toLowerCase() : "");
					}

					if(value && value.indexOf("@") === -1) {
						//no @ symbol, deactive suggestions
						scope.autoSuggestActive = false;
					}

					return value;
				});

				//scope functions
				scope.clear = function() {
					scope.email = "";
				};

				scope.handleAutoSuggest = function(event) {
					//if the key was a period or a backspace
					var temp, domain;
					if(event.which === 190) {
						if(scope.email.indexOf("@") > -1) {
							temp = scope.email.split("@");

							//second half of email
							if(temp[1] && temp[1] !== "") {

								domain = getDomainFromEmail(temp[1]);

								if(scope.suggestionsMap[domain] !== undefined) {
									//if it is a valid mapped suggestion
									scope.autoSuggestion = scope.suggestionsMap[domain];
									scope.autoSuggestActive = true;
								}
							}
						}
					} else if(event.originalEvent.toString() === "[object KeyboardEvent]" && event.which === 8) {
						//will keep autosuggest active until no valid suggestion available
						if(scope.email.indexOf("@") > -1) {
							temp = scope.email.split("@");

							if (temp[1] && temp[1] !== "") {

								domain = getDomainFromEmail(temp[1]);

								if (scope.suggestionsMap[domain] === undefined) {

									scope.autoSuggestion = "";
									scope.autoSuggestActive = false;
								}
							}
						}
					}

					return;
				};

				scope.doAutoSuggest = function() {

					var temp = scope.email.split("@");

					if(temp[1]) {
						var domain = getDomainFromEmail(temp[1]);

						//replace corrected word
						temp[1] = temp[1].replace(domain, scope.autoSuggestion);

						//rejoin full email together
						scope.email = temp.join("@");
						scope.autoSuggestActive = false; //deactivate auto suggest
						scope.autoSuggestion = "";
					}
				};


				//other functions
				var validateEmail = function(email) {
					//validate required
					if(email.length === 0 && scope.transferType === associatedTransferType) {
						modelCtrl.$setValidity("emailRequired", false);
						return false;
					} else if(scope.transferType === associatedTransferType) {
						modelCtrl.$setValidity("emailRequired", true);

						//validate email format
						var result = lpCoreUtils.isValidEmail(email);
						modelCtrl.$setValidity("validEmailRequired", result);
						return result;
					}
				};

				//get the domain from the split email
				var getDomainFromEmail = function(emailDomainAndTLD) {

					var indexOfPeriod = emailDomainAndTLD.indexOf(".");
					var domain;

					if(indexOfPeriod > -1) {
						domain = emailDomainAndTLD.substring(0, indexOfPeriod);
					} else {
						domain = emailDomainAndTLD;
					}

					return domain;
				};

				//watch the transfer type to activate or de-activate validation
				scope.$watch("transferType", function(newValue, oldValue) {

					if(newValue !== associatedTransferType) {
						modelCtrl.$setValidity("emailRequired", true);
						modelCtrl.$setValidity("validEmailRequired", true);
					} else {
						scope.validEmail = validateEmail(scope.email);
					}
				});



				initialize();

			}
		};
	};
});
