/**
 * Controllers
 * @module controllers
 */
define(function(require, exports) {

    'use strict';

    var fetchEstatements = function(scope, lpEstatements) {
        scope.estatementsLoading = true;
        // Fetch estatement list.
        var promise = lpEstatements.getAll();
        promise.then(function(estatements) {
            scope.estatementList = estatements;
            scope.estatementsLoading = false;
        });
        return promise;
    };

    var fetchEnrollment = function(scope, lpEstatements) {
        // Fetch enrollment status.
        var promise = lpEstatements.getEnrollmentStatus();
        promise.then(function(status) {
            scope.enrolled = status;
        });
        return promise;
    };

    var setEnrollment = function(scope, lpEstatements, status) {
        // Set enrollment status.
        scope.enrolled = status;
        var promise = lpEstatements.setEnrollmentStatus(status);
        // Response status in not the same as enrollment status, it is
        // true/false if the request succeeded/failed.
        promise.then(function(responseStatus) {
            // todo: handle error response (promise.then(...))
        });
        return promise;
    };

    /**
     * MainCtrl description.
     */
    // @ngInject
    exports.MainCtrl = function(lpEstatements, $q) {
        var ctrl = this;

        // Initialise.
        ctrl.enrolled = null;
        ctrl.estatementList = null;
        ctrl.estatementsLoading = true;

        // Fetch enrollment status, then estatements.
        fetchEnrollment(ctrl, lpEstatements).then(function(status) {
            // Fetch estatements after getting enrollment status.
            if (status) {
                fetchEstatements(ctrl, lpEstatements);
            }
        });

        // Expose get/set on enrollment status.
        ctrl.setEnrollment = function(status) {
            setEnrollment(ctrl, lpEstatements, status).then(function(responseStatus) {
                if (responseStatus) {
                    // Fetch estatements again after settings status.
                    fetchEstatements(ctrl, lpEstatements);
                }
            });
        };

        ctrl.isEnrolled = function() {
            return !!ctrl.enrolled;
        };

        ctrl.isNotEnrolled = function() {
            return ctrl.enrolled !== null && !ctrl.enrolled;
        };
    };
});
