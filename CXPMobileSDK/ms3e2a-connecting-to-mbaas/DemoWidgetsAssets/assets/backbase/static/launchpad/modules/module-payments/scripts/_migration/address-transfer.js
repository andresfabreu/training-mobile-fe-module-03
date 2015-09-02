define(function(require, exports, module) {
    'use strict';

    // @ngInject
    exports.addressTransfer = function($templateCache, transferTypes) {

        $templateCache.put("$addressTransferTemplate.html",
                '<div class="lp-address-transfer">' +
                    '<div class="col-xs-12">' +
                        '<input type="input" class="form-control" ng-model="address.addressOne" placeholder="Address Line 1" aria-label="Address Line One" />' +
                        '<input type="input" class="form-control" ng-model="address.addressTwo" placeholder="Address Line 2" aria-label="Address Line Two"  />' +
                    '</div>' +
                    '<div class="col-xs-12">' +
                        '<input type="input" class="form-control" ng-model="address.city" placeholder="City" aria-label="City" />' +
                    '</div>' +
                    '<div class="col-xs-12">' +
                        '<div class="col-xs-5">' +
                            '<input type="input" class="form-control" ng-model="address.state" placeholder="State" aria-label="State" />' +
                        '</div>' +
                        '<div ng-class="{\'col-xs-offset-1\': true, \'col-xs-6\': true, \'has-feedback\': address.zip.length > 0, \'has-error\': address.zip.length > 0 && !validZip, \'has-success\': address.zip.length > 0 && validZip}">' +
                            '<input type="input" class="form-control" ng-model="address.zip" placeholder="Zip" aria-label="Zip" />' +
                            '<span ng-if="validZip && address.zip.length > 0" class="glyphicon glyphicon-ok form-control-feedback"></span>' +
                            '<span ng-if="!validZip && address.zip.length > 0" ng-click="clear()" class="glyphicon glyphicon-remove form-control-feedback"></span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="warning">' +
                        '<span>Selecting this means a cheque will be printed and posted on your behalf. Can take 7-14 days.</span>' +
                    '</div>' +
                '</div>'
        );
        //display table row clearfix

        return {
            restrict: 'EA',
            replace: true,
            require: ["ngModel", "^form"],
            scope: {
                counterpartyAddress: '=ngModel',
                transferType: '=lpTransferType'
            },
            template: $templateCache.get("$addressTransferTemplate.html"),
            link: function(scope, element, attrs, ctrls) {

                //Initial set up
                /**
                 * intialisation function
                 * @constructor
                 */
                var initialize = function() {

                    scope.address = {
                        addressOne: "",
                        addressTwo: "",
                        city: "",
                        state: "",
                        zip: ""
                    };

                    setDefaultValidation(scope.transferType);
                };

                //controllers
                var modelCtrl = ctrls[0], formCtrl = ctrls[1], associatedTransferType = transferTypes.p2pAddress;

                modelCtrl.$name = attrs.name;
                formCtrl.$addControl(modelCtrl);

                modelCtrl.$formatters.push(function(value) {

                    validateAddress(value);
                    return value;
                });

                var validateAddress = function(address) {

                    var lineOne = true, city = true, state = true, zip = true, zipValid = true;
                    if(address) {
                        //split address into multiple lines again
                        var tempArray = address.split(", ");

                        scope.address.addressOne = tempArray[0];
                        scope.address.addressTwo = tempArray[1];
                        scope.address.city = tempArray[2];
                        scope.address.state = tempArray[3];
                        scope.address.zip = tempArray[4];

                        //first line
                        if(tempArray[0].length === 0) {
                            lineOne = false;
                        }

                        //city line
                        if(tempArray[2].length === 0) {
                            city = false;
                        }

                        //state line
                        if(tempArray[3].length === 0) {
                            state = false;
                        }

                        //zip line
                        if(tempArray[4].length === 0) {
                            zip = false;
                        } else {
                            zipValid = validateZip(tempArray[4]);
                        }
                    }

                    modelCtrl.$setValidity("addressLineOne", lineOne);
                    modelCtrl.$setValidity("addressCity", city);
                    modelCtrl.$setValidity("addressState", state);
                    modelCtrl.$setValidity("addressZip", zip);
                    modelCtrl.$setValidity("addressValidZip", zipValid);
                };

                var validateZip = function(zip) {

                    var re =  /^\d{5}(-\d{4})?$/;
                    var valid = re.test(zip);
                    scope.validZip = valid;
                    return valid;
                };

                scope.$watch("address", function(newValue, oldValue) {
                    if(newValue === oldValue) {
                        return;
                    }

                    scope.counterpartyAddress = newValue.addressOne + ", " + newValue.addressTwo + ", " + newValue.city + ", " + newValue.state + ", " + newValue.zip;

                }, true);

                scope.$watch("transferType", function(newValue, oldValue) {

                    if(newValue === oldValue) {
                        return;
                    }

                    setDefaultValidation(newValue);
                });

                var setDefaultValidation = function(value) {
                    if(value === associatedTransferType) {
                        validateAddress(scope.counterpartyAddress || "");
                    } else {
                        modelCtrl.$setValidity("addressLineOne", true);
                        modelCtrl.$setValidity("addressCity", true);
                        modelCtrl.$setValidity("addressState", true);
                        modelCtrl.$setValidity("addressZip", true);
                        modelCtrl.$setValidity("addressValidZip", true);
                    }
                };



                initialize();

            }
        };
    };
});
