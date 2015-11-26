define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var angular = base.ng;
    var lpCoreUtils = base.inject('lpCoreUtils', require('core').name);

    // @ngInject
    exports.IbanModel = function(httpService) {

        /**
         * IbanModel constructor
         */
        var IbanModel = function(config) {

            this.enableCountrySearch = config.enableCountrySearch;

            this.countryListService = httpService.getInstance({
                endpoint: config.countryListEndpoint
            });

            this.value = '';
            this.valid = false;
            this.countryList = [];
            this.selectedCountry = {};
        };

        /**
         * Loads the list of countries to use for the dropdown from a REST API
         * Default URL: /services/rest/iban
         */
        IbanModel.prototype.loadCountryList = function() {
            var self = this;

            var xhr = self.countryListService.read();
            xhr.then(function(response) {
                self.countryList = response.data;
            }, function() {
                self.error = "countryListServiceError";
            });

            return xhr;
        };

        /**
         * Function that returns the country code from the IBAN
         * returns null if the country isn't in the countryList array
         */
        IbanModel.prototype.getCountryCode = function(value) {
            var self = this,
                countryCode = null,
                iban = value || self.value;

            if (iban.match(/^[A-Za-z]{2}/g)) {
                var code = iban.substr(0, 2);
                angular.forEach(self.countryList, function(value) {
                    if (value.country_code === code.toUpperCase()) {
                        countryCode = code;
                        self.selectedCountry = value;
                        return;
                    }
                });
            }

            return countryCode;
        };

        /**
         * Update the IBAN string to have capitalized letters and remove any dashes, dots or spaces
         * @param  {string} iban The IBAN string
         */
        IbanModel.prototype.normalizeIban = function(iban) {
            if (iban) {
                // change to uppercase
                iban = iban.toUpperCase();
                // strip out unneeded characters
                iban = iban.replace(/[\-\. ]/g, '');
            }

            return iban || '';
        };

        /**
         * Function that validates the IBAN value
         * Order of checks executed:
         *     1. checks for correct length
         *     2. checks if it matches the regular expression
         *     3. checks with the validateIbanChecksum function
         */
        IbanModel.prototype.validate = function() {

            // Check if the IBAN has the correct length
            if (this.value.length !== parseInt(this.selectedCountry.iban_length, 10)) {
                this.valid = false;
                return false;
            }

            // Check if the IBAN matches the regular expression
            var regex = new RegExp(this.selectedCountry.iban_regex);
            if (!regex.test(this.value)) {
                this.valid = false;
                return false;
            }

            if (!lpCoreUtils.isValidISO7064Checksum(this.value)) {
                this.valid = false;
                return false;
            }

            this.valid = true;
            return true;
        };

        return {
            getInstance: function(config) {
                return new IbanModel(config);
            }
        };
    };
});

