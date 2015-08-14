define(function(require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    /* Responsible for managing alert messages */
    // @ngInject
    exports.AlertsManager = function($timeout, $resource, lpWidget) {
        var ALERT_TIMEOUT = 3000; // Time in which message will auto-close if timeout = true
        var alerts = [];
        this.list = function() {
            return alerts;
        };
        this.push = function(type, message, timeout) {
            var self = this;
            self.close(); // support only 1 alert for now
            alerts.push({
                type: type || 'danger',
                msg: message
            });
            if (timeout !== false) {
                $timeout(function() { self.close(); }, ALERT_TIMEOUT);
            }
        };
        this.close = function() {
            alerts = [];
        };
    };

    // @ngInject
    exports.Gridly = function($timeout, lpWidget, lpCoreUtils) {
        // Called before the drag and drop starts with the elements in their starting position.
        var reordering = function(elements) {
        };

        var saveOrder = function(elements) {
            var items = [];
            lpCoreUtils.forEach(elements, function(value, index) {
                items.push(value.id);
            });
            lpWidget.setPreference('budgetOrder', items.toString());
            lpWidget.model.save();
            return items;
        };

        // Called after the drag and drop ends with the elements in their ending position.
        var reordered = function(elements) {
            saveOrder(elements);
        };

        var refresh = function() {
            $timeout(function() {
                // $('.gridly').resize();
                $('.gridly').gridly('layout'); //Change to this if/when springboard has lazy initialization
                refresh();
            }, 300);
        };

        this.init = function() {
            $('.gridly').gridly({
                base: 140, // px The number of pixels for a single column span.
                gutter: 20, // px The number of pixels between columns.
                responsive: true,
                callbacks: { reordering: reordering, reordered: reordered },
                draggable: { zIndex: 800, selector: '.closed' }
            });

            refresh();
        };

        // TODO: remove?
        // gadgets.pubsub.subscribe("launchpad-retail.budgets.reloadBudgets", function() {
        //  $timeout(function() {
        //      $('.gridly').gridly('layout');
        //  }, 0);
        // });
    };
});
