define(function (require, exports, module) {

    'use strict';

    /*----------------------------------------------------------------*/
    /* Global Controller
     /*----------------------------------------------------------------*/

    // @ngInject
    exports.MainCtrl = function (lpEbilling, lpEbillingUtils) {

        var ctrl = this;

        var eBillOptions = lpEbilling.getConfig();

        ctrl.isTouch = lpEbillingUtils.isTouch;

        ctrl.baseUrl = eBillOptions.baseUrl;

        ctrl.getTemplate = function (tpl) {
            return lpEbilling.getTemplate(tpl);
        };

    };

    /*----------------------------------------------------------------*/
    /* Mandate Controller
     /*----------------------------------------------------------------*/
    exports.DetailsCtrl = function () {

        var ctrl = this;

        ctrl.init = function (bill) {
            ctrl.processing = true;
            bill.mandate.$get().then(function (mandate) {
                ctrl.mandate = mandate;
            }, function (errObj) {
                ctrl.response = 'Unable to fetch e-bill.';
            })['finally'](function () {
                ctrl.processing = false;
            });
        };
    };


    /*----------------------------------------------------------------*/
    /* List Controller
     /*----------------------------------------------------------------*/

    // @ngInject
    exports.BillsListCtrl = function (lpEbilling, lpEbillingDebitOrdersModel, lpEbillingUtils, lpEbillingBus, $scope, $filter, $timeout, $q) {

        /*----------------------------------------------------------------*/
        /* Private Vars & Methods
         /*----------------------------------------------------------------*/


        var ctrl = this;

        var fetchParams = {
            f: 0,
            l: 2,
            sort: '-modifiedDate'
        };

        ctrl.hasMore = false;

        // basic check if they are more bills to show
        // not so accurate since there is no total
        // response from the server
        var checkHasMore = function (responseLength) {
            if (typeof responseLength === 'number') {
                ctrl.hasMore = responseLength >= fetchParams.l;
            }
        };

        /*----------------------------------------------------------------*/
        /* Events
        /*----------------------------------------------------------------*/
        lpEbillingBus.subscribe('lp.widget.e-bill-inbox:sync', function (ev) {
            ctrl.fetch();
        }, true);

        /*----------------------------------------------------------------*/
        /* Public Vars & Methods
        /*----------------------------------------------------------------*/

        /**
         * [init description]
         * @return {[type]} [description]
         */
        ctrl.init = function () {
            ctrl.fetch();
        };

        /**
         * [loadMore description]
         * @return {[type]} [description]
         */
        ctrl.loadMore = function () {
            fetchParams.f = ctrl.bills.length;
            lpEbillingDebitOrdersModel.getHistory(fetchParams)
                .then(function (bills) {
                    checkHasMore(bills.length);
                    if (bills.length > 0) {
                        ctrl.bills = ctrl.bills.concat(bills);
                        ctrl.groups = lpEbillingUtils.groupBy(ctrl.bills, 'modifiedDate', '', '', true);
                    }
                });
        };

        /**
         * [fetch description]
         * @return {[type]} [description]
         */
        ctrl.fetch = function () {
            ctrl.loading = true;
            ctrl.bills = [];
            var history = lpEbillingDebitOrdersModel.getHistory(fetchParams);
            $q.all([history]).then(function (resultArr) {
                var bills = resultArr[0];
                checkHasMore(bills.length);
                if (!bills.length) {
                    ctrl.response = 'No results';
                } else {
                    ctrl.bills = ctrl.bills.concat(bills);
                    ctrl.groups = lpEbillingUtils.groupBy(ctrl.bills, 'modifiedDate', '', '', true);
                }

            }, function (errObj) {
                // Woops
                ctrl.response = 'Unable to fetch data';
            })['finally'](function () {
                // We done
                ctrl.loading = false;
            });

        };
    };
});
