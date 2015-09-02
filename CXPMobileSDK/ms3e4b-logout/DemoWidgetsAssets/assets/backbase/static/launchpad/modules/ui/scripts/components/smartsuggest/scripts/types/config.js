/*global define */
define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var core = require('core');

    module.name = 'ui.smartsuggest-engine-config';

    module.exports = base.createModule(module.name, [
        core.name
    ]);
    
    /////////////////////
    //   Main Config   //
    /////////////////////
    var list = {
        DATE: {
            type:'date',
            label: 'On',
            icon: 'lp-icon-calendar'
        },
        AMOUNT: {
            type:'amount',
            label: 'Of',
            icon: 'lp-icon-transactions-v1'
        },
        ACCOUNT: {
            type:'account',
            label: 'Account',
            icon: 'lp-icon-search2'
        },
        CONTACT: {
            type:'contact',
            label: 'Contact',
            icon: 'lp-icon-search2'
        },
        CATEGORY: {
            type:'category',
            label: 'Category',
            icon: 'lp-icon-tag'
        },
        GENERAL: {
            type:'general',
            label: 'Description',
            icon: 'lp-icon-search2'
        },
        TITLE: {
            type:'title',
            label: ''
        }
    };

    // Factory function
    // ----------------
    // @ngInject
    var configFactory = function (lpCoreUtils) {

        /**
         * Get an object with same keys, but with single property as a value
         *
         * @param prop
         * @returns {Object}
         */
        var getByValue = function(prop) {
            return lpCoreUtils.mapValues(list, function(n) {
                return n[prop];
            })
        };

        /**
         * Get an object where different properties create key-value object
         *
         * @param keyName
         * @param valueName
         * @returns {Object}
         */
        var getValuesPairs = function(keyName, valueName) {
            var res = {};
            var keys = lpCoreUtils.pluck(list, keyName);
            var values = lpCoreUtils.pluck(list, valueName);
            
            lpCoreUtils.forEach(keys, function(k, index) {
                res[k] = values[index];
            });

            return res;
        };

        /**
         * Helper method, allowing customize properties in config lists for the respective type
         *
         * @param {Object} targetList
         * @param {String} type
         * @param {String} propName
         * @param {String} newValue
         * @returns {boolean}
         */
        var updateProp = function(targetList, type, propName, newValue) {
            if (lpCoreUtils.isObject(targetList)
                && lpCoreUtils.isObject(targetList[type])
                && lpCoreUtils.isString(propName)
                && lpCoreUtils.isString(newValue)) {

                // update value
                targetList[type][propName] = newValue;
                return true;
            } else {

                // TODO: log properly
                console.warn('updateProp: input arguments validation failed...');
                return false;
            }
        };
        
        // get config with types only
        var getTypes = function() {
            return getByValue('type');
        };
        
        // get type-label object
        var getLabelsByType = function() {
            return getValuesPairs('type', 'label');
        };

        // get type-iconClassName object
        var getIconsByType = function() {
            return getValuesPairs('type', 'icon');
        };
        
        // Lists to be shared
        var TYPES = getTypes(), LABELS = getLabelsByType(), ICONS = getIconsByType();
        
        // Update lists (to apply recent changes)
        var updateLists = function () {
            TYPES = getTypes();
            LABELS = getLabelsByType();
            ICONS = getIconsByType();
        };

        // update icon class name in a Config
        var updateIcon = function(targetList, type, iconClassName) {
            if (updateProp(targetList, type, 'icon', iconClassName)) {
                updateLists();
            }
        };

        // update label name in a Config
        var updateLabel = function(targetList, type, newLabelValue) {
            if (updateProp(targetList, type, 'label', newLabelValue)) {
                updateLists();
            }
        };

        // update type name in a Config
        var updateType = function(targetList, type, newTypeValue) {
            if (updateProp(targetList, type, 'type', newTypeValue)) {
                updateLists();
            }
        };

        /**
         * Add new Config prop (not to overwrite existing ones)
         *
         * @param {String} prop
         * @param {Object} item
         */
        var addConfigItem = function(prop, item) {
            if (lpCoreUtils.isObject(item) && lpCoreUtils.isString(item.type) && !list[prop]) {

                // add new config item
                list[prop] = item;

                // update lists
                updateLists();
            } else {
                // TODO: log properly
                console.warn('addConfigItem: input arguments validation failed...');
            }
        };

        // API
        return {
            TYPES: TYPES,
            LABELS: LABELS,
            ICONS: ICONS,
            addConfigItem: addConfigItem,
            updateConfigIcon: updateIcon,
            updateConfigLabel: updateLabel,
            updateConfigType: updateType
        }
    };
    
    module.exports.factory('SmartSuggestConfig', configFactory);
});