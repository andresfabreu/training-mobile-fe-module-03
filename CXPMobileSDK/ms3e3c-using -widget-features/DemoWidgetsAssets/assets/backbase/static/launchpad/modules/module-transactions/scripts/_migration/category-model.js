define(function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.CategoryModel = function(httpService) {
        /**
         * Constructor for the CategoryModel
         * @constructor
         */
        var CategoryModel = function(config) {

            this.config = config;
            this.categories = [];

            this.categoryService = httpService.getInstance({
                endpoint: config.endpoint,
                contentType: 'application/json'
            });
        };

        /**
         *
         */
        CategoryModel.prototype.readList = function() {

            var self = this;
            var xhr = self.categoryService.read();
            xhr.success(function(data) {
                if (data) {
                    self.categories = data;
                }
            });
            xhr.error(function() {
                self.error = 'categoryReadError';
            });

            return xhr;
        };

        CategoryModel.prototype.create = function(name, color) {

            var self = this;
            var xhr = self.categoryService.create({
                data: {
                    'name': name,
                    'color': color
                }
            });
            xhr.success(function(data) {
                if (data) {
                    self.categories.push(angular.extend({}, data, {priority:3}));
                }
            });
            xhr.error(function() {
                self.error = 'categoryCreateError';
            });

            return xhr;
        };

        CategoryModel.prototype.del = function(id) {
            var self = this;
            var service = httpService.getInstance({
                endpoint: this.config.endpoint + '/' + id,
                contentType: 'application/json'
            });
            var xhr = service.del();
            xhr.success(function() {
                for (var i = 0; i < self.categories.length; i++) {
                    if (self.categories[i].id === id) {
                        self.categories.splice(i, 1);
                        break;
                    }
                }
            });
            xhr.error(function() {
                self.error = 'categoryDeleteError';
            });

            return xhr;
        };

        CategoryModel.prototype.getById = function (id) {
            for (var i = 0; i < this.categories.length; ++i) {
                var category = this.categories[i];
                if (category.id === id) { return category; }
            }
            return null;
        };

        return {
            getInstance: function(config) {
                return new CategoryModel(config);
            }
        };

    };

});
