/**
 * Main lpCoreHttp module
 *
 * @copyright Backbase B.V.
 * @author Backbase R&D - Amsterdam - New York
 *
 * @name http
 * @memberof core
 * @ngModule
 */

define(function(require, exports, module) {
    'use strict';

    module.name = 'http';

    var base = require('base');
    // 3rd Party
    // Add angular ressources after base
    require('angular-resource');

    // module dependencies
    var deps = [
        'ngResource'
    ];

    module.exports = base.createModule(module.name, deps)
        .config(require('./config'))
        .factory(require('./httpInterceptor'));
});
