/**
 * Core utilities module exposed as `lpCoreUtils` angular constant object.
 * @name utils
 * @memberof core
 * @ngModule
 */

define(function (require, exports, module) {

    'use strict';

    module.name = 'core.utils';

    var base = require('base');

    /**
     * @name lpCoreUtils
     * @memberof core.utils
     * @ngConstant
     */
    var utils = base.utils;

    var url = require('./url');
    var date = require('./date');
    var portal = require('./portal');
    var is = require('./is');
    var parse = require('./parse');
    var string = require('./string');
    var cookie = require('./cookie');
    var ngUtils = require('./ng');

    utils.mixin(url);
    utils.mixin(date);
    utils.mixin(portal);
    utils.mixin(is);
    utils.mixin(parse);
    utils.mixin(string);
    utils.mixin(cookie);
    utils.mixin(ngUtils);

    module.exports = base.createModule( module.name, [])
        .constant( { 'lpCoreUtils': utils });
});
