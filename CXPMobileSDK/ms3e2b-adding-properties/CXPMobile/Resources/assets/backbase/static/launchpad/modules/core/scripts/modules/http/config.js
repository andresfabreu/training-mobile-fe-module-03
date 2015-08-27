/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : config.js
 *  Description: http Configuration Module
 *  ----------------------------------------------------------------
 */

define(function(require, exports, module) {

    'use strict';

    /**
     * [httpConfig description]
     * @param  {[type]} $provide [description]
     * @return {[type]}          [description]
     */

     // @ngInject
    module.exports = function($httpProvider, $provide) {
        // create the interceptor factory
        $httpProvider.interceptors.push('lpCoreHttpInterceptor');
        var defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        $httpProvider.defaults.headers.common = defaultHeaders;
        $httpProvider.defaults.headers.post = defaultHeaders;
        $httpProvider.defaults.headers.put = defaultHeaders;
        //* #TODO add general $resourceProvider.defaults
    };

});
