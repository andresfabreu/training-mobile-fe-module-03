/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.MainCtrl = function($scope, widget) {
        var ctrl = this,
            contactFeature = (widget && widget.features) ? widget.features.ContactFeature : null;

        ctrl.emailEnabled = false;

        if(contactFeature) {
            contactFeature
                .isEmailAvailable()
                .then(function(data) {
                    // console.log('CONTACT DATA', data);
                    if(data && data.result) {
                        ctrl.emailEnabled = true;

                        ctrl.openEmailClient = function() {
                            contactFeature.sendEmail('support@backbase.com', 'Support request from the CXP Mobile app', 'Dear Backbase,\n\n');
                        };

                        $scope.$apply();
                    }
                });
        }
    };
});
