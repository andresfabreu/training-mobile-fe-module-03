(function() {

    'use strict';

    [
        //launchpad custom elements
        'lp-template',
        'lp-accounts-select',
        'lp-accounts-header',
        'lp-bar-chart',
        'lp-donut-chart',
        'lp-card',
        'lp-line-chart',
        'lp-donut-chart',
        'lp-color-picker',
        'lp-payee-account-select',

        // ng custom elements
        'ng-pluralize',
        'ng-view',
        'ng-inject',
        'ng-include',
        'svg',
        'path',
        'g',
        'line',
        'circle',
        'rect',
        'ellipse',
        'polygon',
        'polyline',
        'image',
        'text',

        // CSS
        'ng:include',
        'ng:pluralize',
        'ng:view'
    ].forEach(function(elem) {
        document.createElement(elem);
    });

})();
