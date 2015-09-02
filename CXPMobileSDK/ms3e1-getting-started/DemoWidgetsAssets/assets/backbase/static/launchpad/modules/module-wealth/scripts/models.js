define(function (require, exports, module) {
    'use strict';

    var d3 = require('d3');

    exports.factories = {};

    function identity(x) {
        return x;
    }

    function model($http, $q, config) {
        var parser = identity;

        function getData(accountId) {
            if (this.deferred) {
                return this.deferred.promise;
            }

            this.deferred = $q.defer();

            $http.get(config.getConfig('portfolioEndPoint').replace(/\{id}/, accountId)).then(function (res) {
                if (res.status !== 200 || !res.data) {
                    return false; // or throw new Error
                }

                this.data = parser(res.data);
                this.deferred.resolve(this.data);
                delete this.deferred;
                return this.data;
            }.bind(this));

            return this.deferred.promise;
        }

        function setParser(fn) {
            parser = fn;
            return this;
        }

        return {
            getData: getData,
            parser: setParser
        };
    }


    /*----------------------------------------------------------------*/
    /* Aggregated Model
    /*----------------------------------------------------------------*/

    // @ngInject
    exports.factories.aggregatedModel = function ($http, $q, lpWealth) {
        return model($http, $q, lpWealth);
    };


    /*----------------------------------------------------------------*/
    /* Portfolio Model
    /*----------------------------------------------------------------*/

    function parsePortfolio(data) {
        data = data.totalPortfolioValueOverPeriod;
        var parsers = {
            monthly: d3.time.format('%Y%m').parse,
            yearly: d3.time.format('%Y').parse
        };
        var freq;
        function parseDate(d) {
            d.date = parsers[freq](d.date);
        }
        for (freq in data) {
            data[freq].forEach(parseDate);
        }
        return data;
    }

    // @ngInject
    exports.factories.ptfModel = function ($http, $q, lpWealth) {
        return model($http, $q, lpWealth).parser(parsePortfolio);
    };


    /*----------------------------------------------------------------*/
    /* Assets Model
    /*----------------------------------------------------------------*/

    function parseAssets(data) {
        data = data.allocations;
        var parse = d3.time.format('%Y%m').parse;
        data.forEach(function (d) {
            d.date = parse(d.date);
        });
        return data;
    }

    // @ngInject
    exports.factories.assetModel = function ($http, $q, lpWealth) {
        return model($http, $q, lpWealth).parser(parseAssets);
    };

});
