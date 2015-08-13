define( function (require, exports, module) {

    'use strict';

    var utils = require('base').utils;

    /*----------------------------------------------------------------*/
    /* Constants and some utility functions
    /*----------------------------------------------------------------*/
    var CURRENCY_MAP = [{
            code: 'USD',
            name: 'US Dollar',
            symbol: '$'
        }, {
            code: 'EUR',
            name: 'Euro',
            symbol: '€'
        }, {
            code: 'GBP',
            name: 'British Pound',
            symbol: '£'
        }, {
            code: 'HUF',
            name: 'Hungarian Forint',
            symbol: 'Ft'
        }, {
            code: 'PLN',
            name: 'Polish Zloty',
            symbol: 'zł'
        }, {
            code: 'CHF',
            name: 'Swiss Franc',
            symbol: 'CHF'
        }
    ];

    // normalize response from the endpoints
    function normalize(res) {
        return utils.union(res.preferred, res.rest).map(function(item) {
            return {
                code: item.currency_code,
                rate: item.exchange_rate
            };
        });
    }

    // deal with different status's
    function status(res) {
        if (res.status < 200 && res.status > 300) {
            throw new Error('error message');
        }
        return res.data;
    }

    // enhance data object
    function enhance(data) {
        return CURRENCY_MAP.map(function(item) {
            item.rate = 1;
            data.forEach(function(el) {
                if(el.code === item.code){
                    item.rate = el.rate;
                }
            });
            return item;
        });
    }
    /**
     * @constructor
     * @ngInject
     */
    function WidgetModel($http, lpWidget) {
        this.data = [];
        this.fetch = $http;
        this.widget = lpWidget;
        this.url = this.widget.getPreference('currencyRatesEndpoint');
    }

    /**
     * Fetch Currency rates from the endpoint
     * @param  {object} params query string
     * @return {object}        Promise $http
     */
    WidgetModel.prototype.fetchCurrencyRates = function(params) {
        return this.fetch({ url: this.url, params: params || {} })
            .then(status)
            .then(normalize)
            .then(enhance.bind(this))
            .then(function(data){
                this.data = data;
                return data;
            }.bind(this));
    };

    /**
     * Small helper to find item by currency
     * @param  {string} currency code EUR
     * @return {object}          currency object
     */
    WidgetModel.prototype.item = function(currency) {
        return utils.findWhere(this.data, {code: currency });
    };
    /**
     * Exports
     */
    exports.WidgetModel = WidgetModel;

});
