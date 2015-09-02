define(function(require, exports, module) {

    'use strict';

    var $ = window.jQuery;
    var util = window.lp && window.lp.util; // to be refactored;

    // @ngInject
    exports.i18nUtils = function($http, $q) {

		var i18nUtils = {};

		// TODO: Needs to be removed, for backwards compatibility
		var configUrlVars = function(endpoint) {
			var urlVars = {};
			urlVars.contextRoot = util.getContextPath();
			urlVars.contextPath = util.getServicesPath();
			urlVars.servicesPath = util.getServicesPath();
			return util.replaceUrlVars(endpoint, urlVars);
		};

		var httpService = {
			getInstance: function(options) {
				var req = {
					url: configUrlVars(options.endpoint),
					method: 'GET',
					cache: true,
					data: {},
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded;'
					}
				};

				return {
					read: function() {
						return $http(req);
					}
				};
			},
			resolvePromise: function(data) {
				// Returns an already resolved promise with the `data` value
				var promise = $q.when(data);
				return {
					success: function(fp) {
						promise.then(fp);
						return promise;
					},
					error: function(fp) {
						promise.then(null, fp);
						return promise;
					},
					always: function(fp) {
						promise['finally'](fp);
						return promise;
					}
				};
			}
		};

		i18nUtils.loadMessages = function(lpWidget, locale, messageSrcPref) {

			var response;
			messageSrcPref = messageSrcPref || "messageSrc";
			var messageSrc = lpWidget.getPreference(messageSrcPref);
			if(messageSrc) {
				var messagesService = httpService.getInstance({
					endpoint: messageSrc
				});
				response = messagesService.read();
			} else {
				response = httpService.resolvePromise({});
			}
			return response;
		};

		return i18nUtils;
	};
});
