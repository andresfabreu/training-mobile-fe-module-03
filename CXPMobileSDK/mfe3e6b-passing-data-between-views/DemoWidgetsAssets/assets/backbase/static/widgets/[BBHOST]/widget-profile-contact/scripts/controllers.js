define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.ProfileContactCtrl = function($scope, $rootElement, lpUserDetails, lpWidget, lpCoreUtils) {

        var endpoint = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('saveUrl'));

        $scope.errorMessages = {
            'invalid_phone': 'This phone is not valid.',
            'invalid_email': 'This email is not valid.'
        };

        $scope.control = {
            address: {
                value: []
            },
            phoneNumber: {
                value: '',
                errors: [],
                loading: false,
                validate: function(phone) {
                    var re = /^\+(?:[0-9]?){6,14}[0-9]$/;
                    if (!re.test(phone)) {
                        return 'invalid_phone';
                    }
                    return true;
                }
            },
            emailAddress: {
                value: '',
                errors: [],
                loading: false,
                validate: function(email) {
                    var re = /^[A-Za-z0-9+_.\-]+@[A-Za-z0-9.\-]+$/;
                    if (!re.test(email)) {
                        return 'invalid_email';
                    }
                    return true;
                }
            }
        };

        var checkAttr = function(attr) {
            return attr || '';
        };

        lpUserDetails.get(endpoint).then(function(response) {
            $scope.control.phoneNumber.value = response.phoneNumber === [] ? '' : checkAttr(response.phoneNumber);
            $scope.control.emailAddress.value = response.emailAddress === [] ? '' : checkAttr(response.emailAddress);

            var address = [];
            if (response.correspondenceAddress) {
                var addr = response.correspondenceAddress;
                address.push(checkAttr(addr.house) + ' ' + checkAttr(addr.street));
                address.push(checkAttr(addr.zip) + ' ' + checkAttr(addr.town) + ', ' + checkAttr(addr.stateAbbr));
            }

            $scope.control.address.value = address.join('\n');
        });

        $scope.save = function(fieldName, value) {
            var data = {};
            data[fieldName] = value;

            $scope.isLoading = true;
            lpUserDetails
                .put(endpoint, data)
                .finally(function() {
                    $scope.isLoading = false;
                });
        };
    };

});
