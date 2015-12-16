define(function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.lpUserSettings = function($http) {
        return {
            changePassword: function(url, oldPassword, newPassword) {
                return $http.post(url, {
                    data: {
                        'oldPassword': oldPassword,
                        'password': newPassword
                    }
                });
            }
        };
    };
});
