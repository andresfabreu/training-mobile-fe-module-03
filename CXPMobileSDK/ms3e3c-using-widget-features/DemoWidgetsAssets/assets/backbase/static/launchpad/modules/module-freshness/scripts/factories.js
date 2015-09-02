define(function(require, exports, module) {
    'use strict';

    /**
     *  This API will provide a 'data freshness' status for outside widgets and components.
     *
     *  Mediates between server API entry point (could be anywhere in a system - we just
     *  listen here for event 'signal') and directive(s) which handle UI.
     *
     *  Data freshness statuses:
     *  ------------------------
     *  'actual' (expecting the server API returns as '0'): most recently updated data,
     *  'updating' (expecting the server API returns as '1'): obsolete data (in progress of updating)
     *
     */
    // @ngInject
    exports.lpDataFreshness = function (lpCoreBus) {
        var currentStatus;
        var statuses = [
            'actual',
            'updating'
        ];
        var refreshStatus = 'refresh';
        var bus = lpCoreBus;

        // listening to status validating event (from entry point)
        // expecting 'status' to be '0', '1', etc.
        bus.subscribe('lpDataFreshnessValidate', function(status) {
            var oldStatus = currentStatus;
            if (statuses[status] && oldStatus !== statuses[status]) {
                currentStatus = statuses[status];

                // trigger event which indicates the status has changed -
                // mostly for messaging
                bus.publish('lpDataFreshnessChanged', currentStatus);

                // special check to trigger data refresh event
                // (widgets should grab most recent data from 'our'
                // server when the status changes from 'updating' to 'actual')
                if (oldStatus === statuses[1] && currentStatus === statuses[0]) {
                    bus.publish('lpDataFreshnessRefresh', refreshStatus);
                }
            }
        });

        /**
         * Returns most recently updated data freshness status
         *
         * @returns {String} Current status name
         */
        var getStatus = function() {
            return currentStatus;
        };

        return {
            getStatus: getStatus
        };
    };
});

