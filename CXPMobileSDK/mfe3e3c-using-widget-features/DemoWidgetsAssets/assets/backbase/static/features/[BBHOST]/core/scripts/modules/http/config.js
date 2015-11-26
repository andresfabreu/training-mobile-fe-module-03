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

    var base = require('base');
    var $ = require('jquery');
    var utils = require('../utils/main');

    var $injector = base.ng.injector([utils.name]);
    var lpCoreUtils = $injector.get('lpCoreUtils');

    var xsrfTokenCookie = lpCoreUtils.getCookie('XSRF-TOKEN');

    // set xsrf token for non-angular XHR requests

    // Configure global XHR requests using jQuery
    if (xsrfTokenCookie !== '') {
        $.ajaxSetup({
            global: true,
            headers: { 'X-XSRF-TOKEN': xsrfTokenCookie }
        });
    }

    /**
     * [httpConfig description]
     * @param $httpProvider
     * @param $provide
     * @returns {*}
     */
     // @ngInject
    module.exports = function($httpProvider) {
        // create the interceptor factory
        $httpProvider.interceptors.push('lpCoreHttpInterceptor');
        var defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfTokenCookie
        };
        $httpProvider.defaults.headers.common = defaultHeaders;
        $httpProvider.defaults.headers.post = defaultHeaders;
        $httpProvider.defaults.headers.put = defaultHeaders;
        //* #TODO add general $resourceProvider.defaults

    };

});
