/**
 * Error handler system. Overrides the default Angular
 * <a href="https://docs.angularjs.org/api/ng/service/$exceptionHandler">$exceptionHandler</a> action.
 *
 * @copyright Backbase B.V.
 * @author : Backbase R&D - Amsterdam - New York
 *
 * @name error
 * @memberof core
 * @ngModule
 */

define(function (require, exports, module) {

    'use strict';

    module.name = 'error';

    var base = require('base');

    var deps = [
        // no dependencies
    ];

    module.exports = base.createModule(module.name, deps)
        .config(require('./config'))
        .factory(require('./handler'));
});
