define(function(require, exports, module) {
	'use strict';

    var util = window.lp && window.lp.util; // to be refactored

    // @ngInject
    exports.p2pEnrollment = function($templateCache, transferTypes) {

		$templateCache.put("$emailTemplate.html",
				'<div class="lp-p2p-enrollment">' +
					'<p class="warning">We also need a few details from you to make the transfer</p>' +
					'<div lp-accounts-select="lp-accounts-select" designated-class="lp-normal-account-select-size" ng-model="p2pRegistration.p2pAccount" lp-accounts="accounts" name="p2pAccountSelect" ng-change="onP2PAccountChange()"></div>' +
					'<ul tabset="tabset" class="nav-tabs">' +
						'<li tab="tab">' +
							'<span tab-heading="tab-heading" class="tab-heading">Email</span>' +
							'<div ng-class="{\'email-input-form\': true, \'has-feedback\': enrollment.email.length > 0, \'has-success\': enrollment.email.length > 0 && validEmail, \'has-error\': enrollment.email.length > 0 && !validEmail}">' +
								'<input type="input" class="form-control" ng-model="enrollment.email" placeholder="Confirm your email" ng-change="onEmailChange()" aria-label="Email Address"/>' +
								'<span ng-if="validEmail && enrollment.email.length > 0" class="glyphicon glyphicon-ok form-control-feedback"></span>' +
								'<span ng-if="!validEmail && enrollment.email.length > 0" ng-click="clearEmail()" style="cursor: pointer;" class="glyphicon glyphicon-remove form-control-feedback"></span>' +
							'</div>' +
						'</li>' +
					'</ul>' +
					'<div class="ts-and-cs" class="clearfix">' +
						'<div class="pull-left ts-cs-check">' +
							'<input type="checkbox" ng-model="p2pRegistration.userAgrees" ng-change="onAgreementChange()" aria-label="Do you agree with terms and conditions?" />' +
						'</div>' +
						'<div class="pull-left ts-cs-details">' +
							'<p>By registering this mobile number or email address, I agree that I am the email or mobile account holder, and I consent to receive email and automated text message about transfers at this time. Fees from carrier may apply</p>' +
						'</div>' +
					'</div>' +
				'</div>'
		);

		return {
			restrict: 'EA',
			replace: true,
			require: ["ngModel", "^form"],
			scope: {
				'accounts': '=lpAccounts',
				'enrollment': '=ngModel',
				'transferType': '=lpTransferType'
			},
			template: $templateCache.get("$emailTemplate.html"),
			link: function(scope, element, attrs, ctrls) {

				//Initial set up
				var modelCtrl = ctrls[0], formCtrl = ctrls[1];
				modelCtrl.$name = attrs.name;
				formCtrl.$addControl(modelCtrl);

				var associatedTransferTypes = [
					transferTypes.p2pEmail,
					transferTypes.p2pMobile,
					transferTypes.p2pAddress
				];
				/**
				 * intialisation function
				 * @constructor
				 */
				var initialize = function() {

					scope.p2pRegistration = {
						p2pAccount: {},
						userAgrees: false
					};
					setDefaultValidation(scope.transferType);
				};


				//scope functions
				scope.clearEmail = function() {
					scope.enrollment.email = "";
				};

				scope.onP2PAccountChange = function() {
					scope.enrollment.receivingAccountNumber = scope.p2pRegistration.p2pAccount.identifier;
					modelCtrl.$setValidity("p2pAccountRequired", true);
				};

				scope.onEmailChange = function() {
					validateEmail();
				};

				scope.onAgreementChange = function() {
					modelCtrl.$setValidity("termsAndConditions", scope.p2pRegistration.userAgrees);
				};

				//other functions
				/*scope.$watch("accounts", function(newValue, oldValue) {
					//set the default selection and default enrollment account
					if(newValue) {
						if(scope.enrollment) {
							scope.enrollment.receivingAccountNumber = newValue[0].identifier;
						}
						scope.p2pRegistration.p2pAccount = newValue[0];
					}
				});*/

				scope.$watch("transferType", function(newValue, oldValue) {

					if(newValue === oldValue) {
						return;
					}

					setDefaultValidation(newValue);
				});

				var validateEmail = function() {

					var result;
					if(scope.enrollment) {
						result = util.isValidEmail(scope.enrollment.email);
					} else {
						result = util.isValidEmail("");
					}

					modelCtrl.$setValidity("validEmailRequired", result);

					scope.validEmail = result;
				};

				var setDefaultValidation = function(value) {
					//do we need to validate? Check new transfer type against associated transfer types
					var found = false;
					for(var i = 0; i < associatedTransferTypes.length; i++) {
						if(value === associatedTransferTypes[i]) {
							found = true;
						}
					}

					if(found) {
						//yes, we need to validate
						modelCtrl.$setValidity("termsAndConditions", scope.p2pRegistration.userAgrees);
						validateEmail();
						modelCtrl.$setValidity("p2pAccountRequired", false);
					} else {
						//no, we don't
						modelCtrl.$setValidity("termsAndConditions", true);
						modelCtrl.$setValidity("validEmailRequired", true);
						modelCtrl.$setValidity("p2pAccountRequired", true);
					}
				};

				initialize();
			}
		};
	};
});
