/**
 * NOT IMPLEMENTED
 * @name store
 * @memberof core
 * @ngModule
 */

define(function(require, exports, module) {
    'use strict';

    module.name = 'core.store';
    var base = require('base');
    var deps = [];

    // https://developer.mozilla.org/en-US/docs/Web/API/Storage
    function storeProvider() {
        this.$get = function() {
            var API = {};

            /**
             * When passed a key name, will return the value stored in that key.
             * @param   {String} key  Name of the key you want to retrieve.
             * @returns {*} Value stored in the key, if it is not present it will return null.
             */
            API.getItem = function(key) {};

            /**
             * When passed a key name and value, will add that key to the storage, or update
             * that key's value if it already exists.
             *
             * @param {String} key Name of the key you want to create/update.
             * @param {*} value Value you want to give the key you are creating/updating.
             */
            API.setItem = function(key, value) {};

            /**
             * When passed a key name, will remove the value stored in the key
             * and the key itself
             *
             * @param  {String} key Name of the key woy want to remove.
             */
            API.removeItem = function(key) {};

            /**
             * Will empty all keys out of the storage.
             */
            API.reset = function() {};

            return API;
        };
    }

    module.exports = base.createModule( module.name, deps )
        .provider( 'lpCoreStore', storeProvider );
});
