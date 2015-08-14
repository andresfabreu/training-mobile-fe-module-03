define(function (require, exports, module) {
    'use strict';

    var template = '' +
        '<span>' +
        '    <i class="{{option.icon}} pull-right"></i><span class="sr-only">Sort by</span>{{option.label}} <span class="sr-only">{{option.aria}}</span>' +
        '</span>';

    return template;
});
