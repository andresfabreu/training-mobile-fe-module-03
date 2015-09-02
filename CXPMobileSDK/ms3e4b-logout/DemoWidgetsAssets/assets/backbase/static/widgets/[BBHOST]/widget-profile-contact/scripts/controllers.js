define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.ProfileContactCtrl = function($scope, $rootElement, ProfileContactService) {

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

        ProfileContactService.read().success(function(response) {
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

        $scope.save = function(field, value) {
            $scope.isLoading = $scope.control[field].loading;

            $scope.isLoading = true;
            var xhr = ProfileContactService.save(field, value)
            .error(function() {
                // console.log('there was an error saving');
            });

            xhr['finally'](function() {
                $scope.isLoading = false;
            });
        };
    };

});
