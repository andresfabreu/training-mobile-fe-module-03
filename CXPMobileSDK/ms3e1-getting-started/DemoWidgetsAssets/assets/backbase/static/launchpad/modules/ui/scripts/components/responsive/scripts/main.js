define(function(require, exports, module) {
    'use strict';

    module.name = 'ui.responsive';

    var base = require('base');
    var core = require('core');

    var responsive = require('./libs/responsive');

    module.exports = base
        .createModule(module.name, [
            core.name
        ])
        .constant('lpUIResponsiveConfig', {
            classPattern: 'lp-{{size}}-size',
            rules: [
                { max: 200, size: 'tile' },
                { min: 201, max: 350, size: 'small' },
                { min: 351, size: 'large' }
            ]
        })
        .controller(require('./controllers'))
        .directive(require('./directives'))
        .factory('lpUIResponsive', function(){
            return responsive;
        });
});
