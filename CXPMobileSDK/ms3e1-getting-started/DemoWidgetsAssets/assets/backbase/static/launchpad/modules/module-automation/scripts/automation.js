define(function(require, exports, module) {
    'use strict';

    var baseUtils = require('base').utils;
    var headers = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    /**
     * Get FILTERS object in required shape
     *
     * @param filters
     * @returns {Object}
     */
    var handleFiltersCondition = function(filters) {
        filters.forEach(function(filter, index) {
            var res;
            var key = baseUtils.keys(filter)[0];
            var obj = filter[key];
            res = [{
                value: obj.value,
                condition: obj.condition ? obj.condition.value : 'gt'
            }];
            filters[index][key] = res;
        });
        return filters;
    };

    /**
     * Update trigger object for layout displaying purposes
     *
     * @param trigger
     * @returns {*}
     */
    var normalizeTrigger = function(trigger) {
        if (!trigger || !trigger.triggerDefinition || !trigger.triggerDefinition.selectors) {
            return trigger;
        }
        var result = [];
        var selectors = trigger.triggerDefinition.selectors;
        var keys = baseUtils.keys(selectors) || [];
        keys.forEach(function(key) {
            result.push({
                name: key,
                returnType: selectors[key]
            });
        });
        trigger.selectors = result;

        return trigger;
    };

    /**
     * Form automation object (for creation or update)
     *
     * @param automation
     * @returns {{name: (*|null), id: (*), isActive: *, parent: *, trigger: {id: (AutomationModel.recipes.triggerDefinition.name|*), selectors: {accountId: (*|null)}, filters: Object}, actions: *}}
     */
    var formAutomationObject = function(automation) {
        var result = {
            name: automation.data.name,
            isActive: automation.data.enabled,
            trigger: {
                id: automation.trigger.triggerDefinition.name,
                selectors: {
                    accountId: automation.data.accountId || null
                },
                filters: handleFiltersCondition(automation.data.filters)
            },
            actions: automation.data.actions
        };

        if (automation.id) {
            result.id = automation.id;
        }

        if (automation.parent) {
            result.parent = automation.parent;
        }

        return result;
    };

    // @ngInject
    exports.lpAutomation = function() {
        var config;
        var CFG_LIST_ENDPOINT = 'automationsEndpoint';
        var CFG_SINGLE_ENDPOINT = 'automationEndpoint';
        var CFG_STATUS_ACTIVATE_ENDPOINT = 'automationsActivationEndpoint';
        var CFG_STATUS_DEACTIVATE_ENDPOINT = 'automationsDeactivationEndpoint';
        var CFG_RECIPES_ENDPOINT = 'recipesEndpoint';


        /*
         * Provides an instance of the automation module.
         */
        // @ngInject
        this.$get = function($http, $q, lpCoreUtils, lpCoreBus) {
            var API = function() {};

            API.prototype.setConfig = function(options) {
                config = lpCoreUtils(options).chain()
                    .mapValues(lpCoreUtils.resolvePortalPlaceholders)
                    .defaults(config)
                    .value();
                return this;
            };

            API.prototype.getConfig = function(prop) {
                if (prop && lpCoreUtils.isString(prop)) {
                    return config[prop];
                } else {
                    return config;
                }
            };

            /**
             * Load stored automations
             */
            API.prototype.loadAutomations = function() {
                var self = this;
                return $http.get(self.getAttribute(CFG_LIST_ENDPOINT)).then(function(res) {

                    if (!res || res === null || res === 'null' || !res.data || typeof res.data === 'string') {
                        res = {};
                    }
                    return res.data || [];
                });
            };

            /**
             * Load stored recipes
             */
            API.prototype.loadRecipes = function() {
                var self = this;
                this.recipes = [];

                return $http.get(self.getAttribute(CFG_RECIPES_ENDPOINT)).then(function(res) {
                    var recipes;

                    if (!res || res === null || res === 'null' || !res.data || typeof res.data === 'string') {
                        res = {};
                    }

                    recipes = res.data || [];

                    for (var i = 0; i < recipes.length; i++) {
                        self.recipes[i] = recipes[i];
                    }

                    return self.recipes;
                });
            };

            /**
             * Create new automation
             * @param  {object} automation
             * @return {promise}
             */
            API.prototype.create = function(automation) {
                var self = this;

                var result = formAutomationObject(automation);

                return $http.post(self.getAttribute(CFG_LIST_ENDPOINT), result, headers).then(function(response) {
                    response.result = result;
                    return response;
                }, function() {
                    console.log('save error');
                });
            };

            /**
             * Update automation
             *
             * @param automation
             * @returns {*}
             */
            API.prototype.update = function(automation) {
                var self = this;
                var result = formAutomationObject(automation);

                return $http.put(self.getAttribute(CFG_SINGLE_ENDPOINT), result, headers).then(function(response) {
                    return result;
                }, function(response) {
                    // error
                    console.log('update error');
                });
            };

            /**
             * Enable or disable the specified automation
             * @param  {object} automation
             * @return {promise}
             */
            API.prototype.toggleStatus = function(automation) {
                var self = this;
                var endpoint = automation.isActive ? CFG_STATUS_DEACTIVATE_ENDPOINT : CFG_STATUS_ACTIVATE_ENDPOINT;

                return $http.put(self.getAttribute(endpoint).replace('{id}', automation.id)).then(function(response) {
                    return response;
                }, function(response) {
                    // error
                    console.log('toggle status error');
                });
            };

            /**
             * Delete an automation
             * @param  {object} automation
             * @return {promise}
             */
            API.prototype.remove = function(id) {
                var self = this;

                return $http.delete(self.getAttribute(CFG_SINGLE_ENDPOINT) + id).then(function(response) {
                    return response;
                }, function(response) {
                    // error
                    console.log('remove error');
                });
            };

            /**
             * Get model config.
             */
            API.prototype.getAttribute = function(attr) {
                // #TODO use getConfig method
                return config[attr];
            };



            /**
             * ----------------------
             *   Data model helpers
             * ----------------------
             */

            API.prototype.getAccountFlag = function(trigger) {
                return trigger.triggerDefinition.selectors.accountId;
            };

            API.prototype.getActionLocation = function(action) {
                return baseUtils.keys(action.location)[0] || false;
            };

            API.prototype.normalizeTrigger = normalizeTrigger;

            return new API();
        };
    };
});
