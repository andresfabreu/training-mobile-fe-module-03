define(function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.CurrencyModel = function(httpService) {
        /**
         * Constructor for the CurrencyModel
         * @constructor
         */
        var CurrencyModel = function(config) {

            var self = this;

            self.groups = {
                defaultCurrency: 'aDefault',
                preferredCurrencies: 'bPreferred',
                rest: 'cOther'
            };

            self.disableExtraCurrencies = config.disableExtraCurrencies;

            self.defaultCurrencyService = httpService.getInstance({
                endpoint: config.defaultCurrencyEndpoint
            });

            self.currencyListService = httpService.getInstance({
                endpoint: config.currencyListEndpoint
            });



            self.orderedCurrencies = [];
        };

        /**
         * Loads the default currency from the service
         */
        CurrencyModel.prototype.loadDefaultCurrency = function() {

            var self = this;

            var xhr = self.defaultCurrencyService.read();

            xhr.error(function() {
                self.error = 'currencyServiceError';
            });

            return xhr;
        };

        /**
         * Configures the currency models default currency based on data from the service
         * @param defaultCurrencyData data object
         */
        CurrencyModel.prototype.configureDefaultCurrency = function(defaultCurrencyData) {

            var self = this;

            var dc = {
                currency_code: defaultCurrencyData.currency_code,
                exchange_rate: 1.0,
                group: self.groups.defaultCurrency
            };

            self.defaultCurrency = dc;
            self.selected = self.defaultCurrency;

            //add the default currency to the top of the list
            self.orderedCurrencies.push(self.defaultCurrency);
        };

        /**
         * Loads the rest of the list of currencies
         */
        CurrencyModel.prototype.loadOtherCurrencies = function() {

            var self = this;

            self.currencyListService.endpoint += '?currency=' + self.defaultCurrency.currency_code;

            var xhr = self.currencyListService.read();

            xhr.success(function(data) {
                if(data) {
                    self.sortCurrencies(data);
                }
            });

            xhr.error(function() {
                self.error = 'currencyServiceError';
            });

            return xhr;
        };

        /**
         * Formats and sorts the list of currencies from the service
         * @param currencyData
         */
        CurrencyModel.prototype.sortCurrencies = function(currencyData) {

            var self = this;

            //add the preferred currencies to the top of the list under default
            for(var i = 0; i < currencyData.preferred.length; i++) {
                currencyData.preferred[i].group = self.groups.preferredCurrencies;
            }

            self.orderedCurrencies.push.apply(self.orderedCurrencies, currencyData.preferred);


            if(!self.disableExtraCurrencies) {
                for(var j = 0; j < currencyData.rest.length; j++) {
                    currencyData.rest[j].group = self.groups.rest;
                }

                currencyData.rest.sort(function(a, b) {
                    //sort rest of currencies alphabetically
                    var currencyA = a.currency_code.toLowerCase(), currencyB = b.currency_code.toLowerCase();

                    if(currencyA < currencyB) {
                        return -1;
                    } else if(currencyA > currencyB) {
                        return 1;
                    } else {
                        return 0;
                    }

                });

                //once the list has been sorted, and if it should be added, add the rest of the currencies to the list
                self.orderedCurrencies.push.apply(self.orderedCurrencies, currencyData.rest);
            }
        };

        /**
         * Finds a currency by Currency name
         * @param currencyCode
         */
        CurrencyModel.prototype.findCurrency = function(currencyCode) {

            var self = this;

            return self.orderedCurrencies.filter(function(currency){ return currency.currency_code === currencyCode; })[0];
        };

        /**
         * Selected a currency by Currency Name
         * @param currencyCode the ISO code for the currency to select
         */
        CurrencyModel.prototype.selectCurrency = function(currencyCode) {

            var self = this;
            self.selected = self.findCurrency(currencyCode);

        };

        return {
            getInstance: function(config) {
                return new CurrencyModel(config);
            }
        };

    };

});
