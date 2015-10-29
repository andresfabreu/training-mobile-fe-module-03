define(function (require, exports, module) {

    'use strict';

    module.name = 'core.utils';

    var base = require('base');
    var utils = base.utils;
    var url = require('./url');
    var date = require('./date');
    var portal = require('./portal');
    var is = require('./is');
    var parse = require('./parse');
    var string = require('./string');

    utils.mixin(url);
    utils.mixin(date);
    utils.mixin(portal);
    utils.mixin(is);
    utils.mixin(parse);
    utils.mixin(string);

    module.exports = base.createModule( module.name, [])
        .constant( { 'lpCoreUtils': utils });
});
