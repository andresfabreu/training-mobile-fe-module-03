if (window.jQuery) {
    define('jquery', function () {
        'use strict';
        return window.jQuery;
    });
    setTimeout(function(){
        window.jQuery(document.body).on('click', '.bd-tCont-menu', function(ev) {
            ev.preventDefault();
        });
    }, 1000);
}

require.config({
    config: {
        portal: window.bd && window.bd.portal || b$.portal || {},
        locale: 'en-US'
    },

    waitSeconds: 24,

    baseUrl: (function(portal) {
        'use strict';
        var root = portal.contextRoot || portal.config.serverRoot || '';
        return root +  '/static';
    })(window.bd && window.bd.portal || b$.portal || {} ),

    paths: {
        'zenith'                : 'backbase.com.2014.zenith/scripts',
        'mustache'              : 'ext-lib/mustache-0.8.1/mustache',
        'underscore'            : 'ext-lib/underscore-1.6.0/underscore-min',
        'jsonpointer'           : 'ext-lib/jsonpointer/jsonpointer',
        'conf'                  : 'conf'
    },

    map: {
        '*': {
            'css'    : 'ext-lib/requirejs/require-css',
            'i18n'   : 'ext-lib/requirejs/require-i18n',
            'text'   : 'ext-lib/requirejs/require-text',
            'tpl'    : 'ext-lib/requirejs/require-tpl'
        }
    }
});