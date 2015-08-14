define(function(require, exports, module) {
    'use strict';

    var LINK_TYPE_PDF = 'application/pdf';
    var LINK_TYPE_HTML = 'application/html';
    var CFG_LIST_ENDPOINT = 'estatementListEndpoint';
    var CFG_ENROLLMENT_ENDPOINT = 'estatementEnrollmentEndpoint';

    var utils = require('base').utils;

    // @ngInject
    exports.lpEstatements = function(lpEstatementsUtils) {
        var defaults = {
            'estatementListEndpoint': '/mock/v1/documents',
            'estatementEnrollmentEndpoint': '/mock/v1/enrollment'
        };

        /*
         * Take the estatement object as the REST API returns it, and enhance it to have
         * some convenient attributes.
         *
         * @param object estatement
         *
         * @return object
         */
        function enhanceEstatement(estatement) {
            // Create 'link' properties for the pdf and html links.
            if (utils.isObject(estatement)) {
                estatement.linkPdf = lpEstatementsUtils.estatementLink(estatement, LINK_TYPE_PDF);
                estatement.linkHtml = lpEstatementsUtils.estatementLink(estatement, LINK_TYPE_HTML);
            }
            return estatement;
        }

        /*
         * Provides an instance of the estatement module.
         */
        // @ngInject
        this.$get = function($http, $q, lpCoreUtils, lpCoreConfiguration) {

            var API = function(config) {
                if (lpCoreUtils.isObject(config)) {
                    this.setConfig(config);
                }
            };

            /*
             * Set the configuration object for the estatement provider.
             *
             * @param core.configuration config
             *
             * @return void
             */
            API.prototype.setConfig = function(options) {
                this.config = lpCoreUtils(options).chain()
                    .mapValues(lpCoreUtils.resolvePortalPlaceholders)
                    .defaults(defaults)
                    .value();
                return this;
            };

            API.prototype.getConfig = function(prop) {
                if (prop && lpCoreUtils.isString(prop)) {
                    return this.config[prop];
                } else {
                    return this.config;
                }
            };
            /**
             * Get model config.
             */
            // deprecate
            API.prototype.getAttribute = API.prototype.getConfig;

            API.prototype.getAll = function() {
                var self = this;
                var d = $q.defer();
                $http.get(self.getAttribute(CFG_LIST_ENDPOINT)).then(function(response) {
                    // TODO: Validate response, handle errors.
                    // Enhance raw API results.
                    d.resolve(lpCoreUtils(response.data.documents).map(enhanceEstatement).value());
                });

                return d.promise;
            };

            API.prototype.getEnrollmentStatus = function() {
                var self = this;
                var d = $q.defer();

                $http.get(self.getAttribute(CFG_ENROLLMENT_ENDPOINT)).then(
                    function(response) {
                        // TODO: Validate response, handle errors.
                        d.resolve(!!(response && response.data && +response.data.status));
                    }
                );

                return d.promise;
            };

            API.prototype.setEnrollmentStatus = function(status) {
                var self = this;
                var d = $q.defer();
                var statusValue = (status) ? 1 : 0;

                $http({
                    url: self.getAttribute(CFG_ENROLLMENT_ENDPOINT),
                    method: 'PUT',
                    data: JSON.stringify({
                        status: statusValue
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(
                    function(response) {
                        d.resolve(!!(response && response.data && response.data.status === 'OK'));
                    }
                );

                return d.promise;
            };

            return new API(defaults);
        };
    };
});
