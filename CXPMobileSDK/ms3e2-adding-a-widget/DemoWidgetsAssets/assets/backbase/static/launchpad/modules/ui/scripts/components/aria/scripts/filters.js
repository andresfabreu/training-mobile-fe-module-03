define(function(require, exports) {
    'use strict';

    exports.lpAriaNumber = function () {
        return function(input) {
            return input ? String(input).split('').join(' ') : '';
        };
    };
});
