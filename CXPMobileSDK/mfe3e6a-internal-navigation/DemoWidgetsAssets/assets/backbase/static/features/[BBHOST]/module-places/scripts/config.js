define(function (require, exports, module) {
    'use strict';

    /**
     * @ngInject
     */
    module.exports = function($provide) {
        $provide.decorator('angulargmUtils', ['$delegate', function ($delegate) {
            var isOldBrowser = $delegate.isOldBrowser;
            var isOldIE = function() {
                var rv = -1;
                if (navigator && navigator.appName === 'Microsoft Internet Explorer') {
                    var re = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
                    if (re.exec(navigator.userAgent || '') !== null) {
                        rv = parseFloat(RegExp.$1);
                    }
                }
                return rv > 0 && rv <= 8;
            };

            $delegate.isOldBrowser = function() {
                return isOldBrowser.call(this) || isOldIE();
            };

            return $delegate;
        }]);
    };
});
