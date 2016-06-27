/**
 * UI utilities module exposed as `lpUIUtils` angular constant object.
 * @name utils
 * @memberof ui
 * @ngModule
 */

define(function (require, exports, module) {

    'use strict';

    module.name = 'ui.utils';
    var base = require('base');

    /**
     * @name lpUIUtils
     * @memberof ui.utils
     * @ngConstant
     */

    var utils = base.utils;

    utils.mixin(require('./input'));
    utils.mixin(require('./images'));

    module.exports = base.createModule(module.name, [])
        .constant({ 'lpUIUtils': utils });
});
