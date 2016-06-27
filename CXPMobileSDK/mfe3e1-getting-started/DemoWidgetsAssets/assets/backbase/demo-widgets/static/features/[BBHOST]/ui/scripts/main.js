define(function(require, exports, module) {
    'use strict';

    module.name = 'ui';

    var base = require('base');

    // 3rd party vendor
    // Using angular boostrap
    require('./libs/angular-ui-bootstrap/angular-ui-bootstrap');

    var deps = [
        'ui.bootstrap',
        require('./components/input-overflow/scripts/main').name,
        require('./components/amount/scripts/main').name,
        require('./components/list/scripts/main').name,
        require('./components/field/scripts/main').name,
        require('./components/responsive/scripts/main').name,
        require('./components/wizard/scripts/main').name,
        require('./components/progress-indicator/scripts/main').name,
        require('./components/input/scripts/main').name,
        require('./components/checkbox/scripts/main').name,
        require('./components/timer/scripts/main').name,
        require('./components/switcher/scripts/main').name,
        require('./components/card/scripts/main').name,
        require('./components/focus/scripts/main').name,
        require('./components/nav-icon/scripts/main').name,
        require('./components/aria/scripts/main').name,
        require('./components/scrolling-hook/scripts/main').name,
        require('./components/number-input/scripts/main').name,
        require('./components/modal-dialog/scripts/main').name,
        require('./components/smartsuggest/scripts/main').name,
        require('./components/touch/scripts/main').name,
        require('./components/placeholder/scripts/main').name,
        require('./components/color-picker/scripts/main').name,
        require('./components/infinite-scroll/scripts/main').name,
        require('./components/element-resize/scripts/main').name,
        // ui utils
        require('./utils/main').name
   ];

    module.exports = base.createModule(module.name, deps);

});
