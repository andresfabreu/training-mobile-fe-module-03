/**
 * Configures
 * <a href="https://docs.google.com/document/d/1BtDNCvYegmyzel4YPBFNxJaUZ2ywYUeBbzkLB4LpQzM/edit">updating</a>
 * widgets' models depending on other widgets actions.
 *
 * @copyright Backbase B.V.
 * @author Backbase R&D - Amsterdam - New York
 *
 * @name update
 * @memberof core
 * @ngModule
 */

define(function (require, exports, module) {
    'use strict';

    module.name = 'core.update';

    var base = require('base');
    // core modules
    var utils = require('../utils/main');

    var deps = [
        utils.name
    ];

    module.exports = base.createModule(module.name, deps)
        .provider(require('./providers'));
});
