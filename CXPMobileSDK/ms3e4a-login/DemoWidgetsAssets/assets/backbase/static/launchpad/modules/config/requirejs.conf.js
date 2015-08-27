
(function(root, factory) {
    'use strict';
    var USEMIN = true;
    var LOCALDEV = !root.launchpad;

    var DIST = USEMIN ? 'dist/' : '';
    var MODULESPATH = LOCALDEV ? '/bower_components': 'launchpad/modules';
    var host;
    if (typeof exports === 'object') {
        host = require('os').hostname();
        module.exports = factory(root, '');
    } else if (typeof requirejs === 'function') {
        require.config(factory(root, MODULESPATH, DIST));
        host = root.location.host;
    }
    if(!USEMIN && host.indexOf('local') > -1) {
        console.info('You are using unminified version!!! @', host);
    }

}(this, function(root, path, dist) {

    'use strict';

    var config = {

        baseUrl: (function(launchpad) {
            return launchpad.staticRoot || './';
        })(root.launchpad || {}),

        paths: {
            // common libs
            'lodash'             : [ path + '/lodash/lodash.min', path + '/lodash/lodash' ],
            'hammerjs'           : [ path + '/hammerjs/hammer.min', path + '/hammerjs/hammer' ],
            'moment'             : [ path + '/moment/min/moment.min', path + '/moment/moment' ],
            'd3'                 : [ path + '/d3/d3.min', path + '/d3/d3' ],

            // angular & 3rd party ng libs
            'angular'            : [ path + '/angular/angular.min', path + '/angular/angular' ],
            'angular-resource'   : [ path + '/angular-resource/angular-resource.min' ],
            'angular-translate'  : [ path + '/angular-translate/angular-translate.min' ],
            'angular-dynamic-locale': [ path + '/angular-dynamic-locale/tmhDynamicLocale.min' ],

            // LP foundation
            'base'               : path + '/base/'+ dist +'scripts',
            'core'               : path + '/core/'+ dist +'scripts',
            'ui'                 : path + '/ui/'+ dist +'scripts',

            // LP modules
            'module-ng-sample'   : path + '/module-ng-sample/'+ dist +'scripts',
            'module-accounts'    : path + '/module-accounts/'+ dist +'scripts',
            'module-automation'  : path + '/module-automation/'+ dist +'scripts',
            'module-estatements' : path + '/module-estatements/'+ dist +'scripts',
            'module-payments'    : path + '/module-payments/'+ dist +'scripts',
            'module-users'       : path + '/module-users/'+ dist +'scripts',
            'module-wealth'      : path + '/module-wealth/'+ dist +'scripts',
            'module-freshness'   : path + '/module-freshness/'+ dist +'scripts',
            'module-tags'        : path + '/module-tags/'+ dist +'scripts',
            'module-charts'      : path + '/module-charts/'+ dist +'scripts',
            'module-badges'      : path + '/module-badges/'+ dist +'scripts',
            'module-expenses'    : path + '/module-expenses/'+ dist +'scripts',
            'module-places'      : path + '/module-places/'+ dist +'scripts',
            'module-ebilling'    : path + '/module-ebilling/'+ dist +'scripts',
            'module-transactions': path + '/module-transactions/'+ dist +'scripts',
            'module-transactions-2': path + '/module-transactions-2/'+ dist +'scripts',
            'module-contacts'    : path + '/module-contacts/'+ dist +'scripts',
            'module-spring-transition'    : path + '/module-spring-transition/'+ dist +'scripts',

            // requirejs-plugins
            // #TODO use requirejs-plugins in bower.json
            'async': 'launchpad/support/requirejs/async',
            'goog': 'launchpad/support/requirejs/goog'

        },
        // Register packages
        packages: [
            'base',
            'core',
            'ui',

            'module-ng-sample',
            'module-accounts',
            'module-automation',
            'module-estatements',
            'module-payments',
            'module-users',
            'module-wealth',
            'module-freshness',
            'module-tags',
            'module-charts',
            'module-badges',
            'module-expenses',
            'module-places',
            'module-ebilling',
            'module-transactions',
            'module-transactions-2',
            'module-contacts',
            'module-spring-transition'
        ],
        shim: {
            'angular': {
                exports: 'angular'
            },
            'angular-resource': {
                deps: ['angular']
            },
            'angular-translate': {
                deps: ['angular']
            },
            'angular-dynamic-locale': {
                deps: ['angular']
            }
        }
    };


    if(root.jQuery) {
        define('jquery', function() { return root.jQuery });
    }
    if(root.angular) {
        define('angular', function() { return root.angular });
    }

    return config;
}));
