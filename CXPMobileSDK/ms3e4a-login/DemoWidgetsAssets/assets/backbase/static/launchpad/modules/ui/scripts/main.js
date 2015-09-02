define(function(require, exports, module) {
    'use strict';

    module.name = 'ui';

    var base = require('base');

    // 3rd party vendor
    // Using angular boostrap
    require('./libs/angular-ui-bootstrap/angular-ui-bootstrap');

    // Components.
    var inputOverflow = require('./components/input-overflow/scripts/main');
    var amount = require('./components/amount/scripts/main');
    var list = require('./components/list/scripts/main');
    var field = require('./components/field/scripts/main');
    var responsive = require('./components/responsive/scripts/main');
    var sample = require('./components/sample/scripts/main');
    var wizard = require('./components/wizard/scripts/main');
    var progressIndicator = require('./components/progress-indicator/scripts/main');
    var textInput = require('./components/input/scripts/main');
    var checkbox = require('./components/checkbox/scripts/main');
    var timer = require('./components/timer/scripts/main');
    var switcher = require('./components/switcher/scripts/main');
    var card = require('./components/card/scripts/main');
    var focus = require('./components/focus/scripts/main');
    var navIcon = require('./components/nav-icon/scripts/main');
    var aria = require('./components/aria/scripts/main');
    var scrollingHook = require('./components/scrolling-hook/scripts/main');
    var numberInput = require('./components/number-input/scripts/main');
    var modalDialog = require('./components/modal-dialog/scripts/main');
    var smartSuggest = require('./components/smartsuggest/scripts/main');
    var touch = require('./components/touch/scripts/main');
    var placeholder = require('./components/placeholder/scripts/main');
    var colorPicker = require('./components/color-picker/scripts/main');

    var deps = [
        'ui.bootstrap',
        inputOverflow.name,
        touch.name,
        amount.name,
        list.name,
        field.name,
        responsive.name,
        sample.name,
        wizard.name,
        progressIndicator.name,
        textInput.name,
        checkbox.name,
        timer.name,
        switcher.name,
        card.name,
        aria.name,
        focus.name,
        numberInput.name,
        navIcon.name,
        modalDialog.name,
        scrollingHook.name,
        smartSuggest.name,
        placeholder.name,
        colorPicker.name
    ];

    module.exports = base.createModule(module.name, deps);

});
