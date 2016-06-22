define(function(require, exports, module) {
    'use strict';

    var utils = require('base').utils;
    var api = {};
    // default configuration
    var defaults = {
        url: '/mock/v2/payment-orders'
    };

    /*----------------------------------------------------------------*/
    /* Public API
    /*----------------------------------------------------------------*/
    /**
     * @ngInject
     * @constructor
     */
    function PaymentOrders($http, lpCoreError) {
        this.xhr = $http;
        this.config = {};
    }

    api.createModel = function() {
        return {};
    };
    /**
     * Creates or updates payment order
     *
     * @param order
     * @returns {promise}
     */
    api.createOrder = function(order) {
        return this.xhr({
            method: 'POST',
            url: this.config.url,
            data: order
        });
    };

    /**
     * Send payment orders to execution
     *
     * @param param
     * @param authorization
     * @returns {promise}
     */
    api.send = function(param, authorization) {
        var url = this.config.url + '/' + param + '/submit';

        return this.xhr({
            method: 'POST',
            url: url,
            data: authorization || {}
        });
    };

    /**
     * Remove pending order.
     *
     * @param uuid
     * @returns {promise}
     */
    api.remove = function(orderId) {
        var url = this.config.url + '/' + orderId;

        return this.xhr({
            method: 'DELETE',
            url: url
        });
    };

    /**
     * Making form object to edit order in widget
     *
     * @param order
     */
    api.makeFormObject = function(order) {
        var form = {
            update: true, // here we notify it is UPDATE
            uuid: order.id,
            accountId: order.accountId,
            isScheduledTransfer: order.scheduledTransfer.every ? true : false,
            scheduleDate: order.onDate ? new Date(order.onDate) : new Date(),
            scheduledTransfer: {
                frequency: order.scheduledTransfer.frequency,
                every: order.scheduledTransfer.every,
                intervals: order.scheduledTransfer.intervals ? [order.schedule.intervals] : [],
                timesToRepeat: order.scheduledTransfer.timesToRepeat || 1, // not in API
                customOrder: order.scheduledTransfer.customOrder || true, // not in API
                startDate: order.scheduledTransfer.startDate ? new Date(order.scheduledTransfer.startDate) : new Date()
            },
            selectedCounter: {
                name: order.counterpartyName,
                account: order.counterpartyIban || order.counterpartyEmail
            },
            instructedCurrency: order.instructedCurrency,
            counterpartyName: order.counterpartyName,
            counterpartyAccount: order.counterpartyAccount,
            counterpartyIban: order.counterpartyIban || '',
            counterpartyEmail: order.counterpartyEmail,
            instructedAmount: order.instructedAmount.toFixed(2),
            paymentReference: order.paymentReference || '', // not in API
            paymentDescription: order.paymentDescription || '', // not in API
            counterpartyAddress: order.counterpartyAddress || '', // not in API
            isOpenDate: order.isOpenDate || false, // not in API
            urgentTransfer: order.urgentTransfer || false, // not in API
            type: order.type
        };

        return form;
    };

    // -----------------------
    // Add to lpCoreApiService
    api.setConfig = function(options) {
        this.config = utils.chain(options)
            .mapValues(utils.resolvePortalPlaceholders)
            .defaults(defaults)
            .value();
        return this;
    };
    api.getConfig = function(prop, defVal) {
        if (prop && utils.isString(prop)) {
            return this.config[prop] || defVal;
        } else {
            return this.config;
        }
    };
    // ----------------------

    /**
     * mixin public api methods
     */
    utils.assign(PaymentOrders.prototype, api);

    /**
     * Exports
     */
    exports.PaymentOrders = PaymentOrders;
});
