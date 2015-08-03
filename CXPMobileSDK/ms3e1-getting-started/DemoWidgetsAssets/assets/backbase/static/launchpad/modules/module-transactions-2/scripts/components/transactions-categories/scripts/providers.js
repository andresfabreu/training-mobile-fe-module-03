/**
 * Providers
 * @module transactions
 */
define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpTransactionsCategory = function(lpCoreUtils) {
        var messages = {
            generic: 'Generic error',
            badId: 'The id must be a string'
        };

        // @ngInject
        this.$get = function($http, $q, lpCoreError) {
            var config = {
                endpoint: ''
            };

            function API() {
                function TransactionsCategoryModel() {
                    this.categories = [];
                }

                /**
                 * Returns all the categories
                 * @return {Objcet} A promise
                 */
                TransactionsCategoryModel.prototype.getAll = function() {
                    var deferred = $q.defer();
                    var self = this;

                    $http.get(config.endpoint)
                    .success(function(data, status, headers, options) {
                        if (lpCoreUtils.isArray(data)) {
                            self.categories = data;
                            deferred.resolve(data);
                        } else {
                            lpCoreError.throwException(new Error(messages.generic));
                        }
                    })
                    .error(function(data, status, headers, options) {
                        lpCoreError.throwException(new Error(messages.generic));
                    });

                    return deferred.promise;
                };

                /**
                 * Returns the category that corresponds to `id`
                 * @param  {String} id the `id` of the category
                 * @return {Object}    A promise
                 */
                TransactionsCategoryModel.prototype.getById = function(id) {
                    if (!lpCoreUtils.isString(id)) {
                        lpCoreError.throwException(new TypeError(messages.badId));
                    }

                    var deferred = $q.defer();

                    $http.get(config.endpoint + '/' + id)
                    .success(function(data, status, headers, options) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, options) {
                        lpCoreError.throwException(new Error(messages.generic));
                    });

                    return deferred.promise;
                };

                /**
                 * Creates a new category
                 * @param  {Object} category The `category` to be created
                 * @param  {String} category.name
                 * @param  {String} category.color
                 * @return {Object}          A promise
                 */
                TransactionsCategoryModel.prototype.create = function(category) {
                    var deferred = $q.defer();

                    if (!lpCoreUtils.isObject(category) || !category.name || !category.color) {
                        lpCoreError.throwException(new Error('Bad category data: ' + category));
                    }

                    $http.post(config.endpoint, category)
                    .success(function(data, status, headers, options) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, options) {
                        lpCoreError.throwException(new Error(messages.generic));
                    });

                    return deferred.promise;
                };

                /**
                 * Deletes the category with a certain`id`
                 * @param  {String} id The `id` of the category
                 * @return {Object}    A promise
                 */
                TransactionsCategoryModel.prototype.removeById = function(id) {
                    if (!lpCoreUtils.isString(id)) {
                        lpCoreError.throwException(new TypeError(messages.badId));
                    }
                    var deferred = $q.defer();

                    $http['delete'](config.endpoint + '/' + id)
                    .success(function(data, status, headers, options) {
                        deferred.resolve(data);
                    })
                    .error(function(data, status, headers, options) {
                        lpCoreError.throwException(new Error(messages.generic));
                    });

                    return deferred.promise;
                };

                return new TransactionsCategoryModel();
            }

            return {
                setConfig: function(options) {
                    config = lpCoreUtils(options).chain()
                        .mapValues(lpCoreUtils.resolvePortalPlaceholders)
                        .defaults(config)
                        .value();
                    return this;
                },

                api: API
            };
        };
    };
});
