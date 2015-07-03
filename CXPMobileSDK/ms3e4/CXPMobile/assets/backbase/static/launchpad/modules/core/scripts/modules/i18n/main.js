/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : main.js
 *  Description:
 *  For translations
 *  See: http://angular-translate.github.io/
 *  Native i18n support
 *  https://hacks.mozilla.org/2014/12/introducing-the-javascript-internationalization-api
 * ----------------------------------------------------------------
 */

define(function (require, exports, module) {
    'use strict';

    module.name = 'core.i18n';

    var base = require('base');
    // 3rd party modules
    require('angular-translate');
    require('angular-dynamic-locale');

    // some core modules
    var utils = require('../utils/main');
    var bus = require('../bus/main');
    var error = require('../error/main');
    var cache = require('../cache/main');

    var deps = [
        'pascalprecht.translate',
        'tmh.dynamicLocale',
        utils.name,
        error.name,
        cache.name,
        bus.name
    ];

    // @ngInject
    function run(lpCoreBus, lpCoreI18n, lpCoreI18nUtils) {

        lpCoreBus.subscribe(lpCoreI18nUtils.LOCALE_CHANGE_EVENT, function (locale) {
            lpCoreI18n.setLocale(locale);
        });
    }

    module.exports = base.createModule(module.name, deps)
        .value('lpI18nCommonTranslation') // store the common translations here
        .constant(require('./utils'))
        .directive(require('./directives'))
        .provider(require('./providers'))
        .filter(require('./filters'))
        .factory(require('./_migration/utils'))
        .directive(require('./_migration/lp-message'))
        .run(run);
});
