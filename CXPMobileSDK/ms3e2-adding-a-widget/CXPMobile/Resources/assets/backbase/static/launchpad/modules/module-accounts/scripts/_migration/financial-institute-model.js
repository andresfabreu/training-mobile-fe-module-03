define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.FinancialInstituteModel = function(httpService, $resource, lpCoreUtils) {

		/**
		 * Financial Institutes service constructor
		 * @param config
		 * @constructor
		 */
		var FIModel = function(config) {

			var self = this;

			self.enableGrouping = config.enableGrouping;

			config.financialInstitutesEndpoint = lpCoreUtils.resolvePortalPlaceholders(config.financialInstitutesEndpoint);
			self.financialInstitutesService = $resource(config.financialInstitutesEndpoint);

			config.membershipRequestsEndpoint = lpCoreUtils.resolvePortalPlaceholders(config.membershipRequestsEndpoint);
			self.membershipRequestsService = $resource(config.membershipRequestsEndpoint);

			self.selected = {};
			self.selectedMembership = {};
			self.financialInstitutes = [];
			self.membershipRequests = [];
			self.errors = [];
			self.warnings = [];
		};

		/**
		 * Loads the financial institutes from the back end
		 * @param searchConfig { name, accountType[]}
		 * @returns promise
		 */
		FIModel.prototype.searchFinancialInstitutes = function(searchConfig, loadMore) {

			var self = this;

			searchConfig.search = "search";

			var promise = self.financialInstitutesService.query(searchConfig).$promise;

			promise.then(function(response) {

				if(!loadMore) {
					self.financialInstitutes = response;
				} else {
					for(var i = 0; i < response.length; i++) {
						self.financialInstitutes.push(response[i]);
					}
				}
			}, function(response) {

				self.addError({captionCode: "badConnection"});
			});

			return promise;
		};

		/**
		 * Sets the passed FI as the currently selected one
		 * @param fi {}
		 */
		FIModel.prototype.setSelected = function(fi) {

			var self = this;

			self.selected = fi;
		};

		/**
		 * Loads membership requests from the service
		 * @returns promise
		 */
		FIModel.prototype.loadMembershipRequests = function() {

			var self = this;

			var promise = self.membershipRequestsService.query().$promise;

			promise.then(function(response) {

				self.membershipRequests = response;
			}, function() {

				self.addError({captionCode: "badConnection"});
			});

			return promise;
		};

		/**
		 * Loads a single membership request By ID
		 * @param membershipRequestID
		 * @returns promise
		 */
		FIModel.prototype.loadMembershipRequestByID = function(membershipRequestID) {

			var self = this;

			var promise = self.membershipRequestsService.get({id: membershipRequestID}).$promise;

			promise.then(function(response) {

				self.selectedMembership = response;
			}, function() {

				self.addError({captionCode: "badConnection"});
			});

			return promise;
		};

		/**
		 * Returns a list of the required credentials to be supplied by user
		 * @param fiId - financial institute ID
		 */
		FIModel.prototype.getRequiredCredentials = function() {

			var self = this;

			var config = {
				"id": self.selected.id,
				"credentials": "credentials"
			};

			var promise = self.financialInstitutesService.query(config).$promise;

			promise.then(function(response) {

				self.selected.requiredUserCredentials = response;
			}, function(response) {

				self.addError({captionCode: "badConnection"});
			});

			return promise;
		};

		/**
		 * Creates a membership request, then delegates the resulting response to the correct handler
		 * @param financialInstitute {}
		 * @returns promise
		 */
		FIModel.prototype.createMembershipRequest = function(financialInstitute) {

			var self = this;

			var membershipRequest = new self.membershipRequestsService();

			membershipRequest.institutionId = financialInstitute.id;
			membershipRequest.credentials = [];

			for(var i = 0; i < financialInstitute.requiredUserCredentials.length; i++) {
				var credential = {};
				credential.credentialId = financialInstitute.requiredUserCredentials[i].id;
				credential.value = financialInstitute.requiredUserCredentials[i].fieldValue;

				membershipRequest.credentials.push(credential);
			}

			var promise = membershipRequest.$save();

			promise.then(function(response) {

				self.selectedMembership = response;
			}, function() {

				self.addError({captionCode: "invalidCredentials"});
			});

			return promise;
		};

		/**
		 * Updates and already existing membership request
		 * @param membershipRequest
		 * @returns promise
		 */
		FIModel.prototype.updateMembershipRequest = function(membershipRequest) {

			var self = this;

			//small hack to deal with API
			var updatedRequest = new self.membershipRequestsService();
			updatedRequest.institutionId = membershipRequest.institutionId;
			updatedRequest.credentials = [];

			for(var i = 0; i < self.selected.requiredUserCredentials.length; i++) {
				var credential = {};
				credential.credentialId = self.selected.requiredUserCredentials[i].id;
				credential.value = self.selected.requiredUserCredentials[i].fieldValue;

				updatedRequest.credentials.push(credential);
			}

			var promise = updatedRequest.$save({id: membershipRequest.id, credentials: "credentials"});

			promise.then(function(response) {
				self.selectedMembership = response;
			}, function(response) {

				if(response.status === 401) {
					self.addError({captionCode: "invalidCredentials"});
				} else {
					self.addError({captionCode: "badConnection"});
				}

			});

			return promise;
		};

		/**
		 * Adds an error to the list of errors on the model
		 * @param error
		 */
		FIModel.prototype.addError = function(error) {

			var self = this;
			var found = false;

			for(var i = 0; i < self.errors.length; i++) {
				if(self.errors[i].captionCode === error.captionCode) {
					//error already exists
					found = true;
				}
			}

			if(!found) {
				self.errors.push(error);
			}
		};

		/**
		 * Adds an warning to the list of warnings on the model
		 * @param warning
		 */
		FIModel.prototype.addWarning = function(warning) {

			var self = this;
			var found = false;

			for(var i = 0; i < self.warnings.length; i++) {
				if(self.warnings[i].captionCode === warning.captionCode) {
					//warning already exists
					found = true;
				}
			}

			if(!found) {
				self.warnings.push(warning);
			}
		};

		FIModel.prototype.clearErrors = function() {

			var self = this;

			self.errors = [];
		};

		FIModel.prototype.clearWarnings = function() {

			var self = this;

			self.warnings = [];
		};

		return {
			getInstance: function(config) {
				return new FIModel(config);
			}
		};
	};
});
