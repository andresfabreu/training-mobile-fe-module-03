define(function(require, exports, module){

    'use strict';

    var tempQueryParams = '';//'partyId=0000000222';
    var _ = require('base').utils;

    // @ngInject
    exports.PayeeModel = function($filter) {
        this.accounts = [];
        this.frequencies = [];
        this.paymentMethods = {
            CHECK: 'CHECK',
            ELECTRONIC: 'ELECTRONIC'
        };
        this.endOptionsEnum = {
            AFTER: 'after',
            CANCEL: 'onCancel'
        };
        this.endOptions = [
            {id: this.endOptionsEnum.AFTER, value: $filter('translate')('After')},
            {id: this.endOptionsEnum.CANCEL, value: $filter('translate')('On cancellation')}
        ];
    };

    // @ngInject
    exports.PayeeService = function($http, $filter, lpWidget, lpCoreUtils, CalendarService, PayeeModel){
        var billPaymentsEndpoint = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('billPaymentsDataSrc'));

        /* Fetch a list of added payees */
        this.fetchPayees = function() {
            return $http.get(billPaymentsEndpoint + '/payees?' + tempQueryParams);
        };

        /* Fetch a list of user accounts */
        this.fetchAccounts = function() {
            return $http.get(billPaymentsEndpoint + '/accounts?' + tempQueryParams)
                .then(function(response) {
                    var accounts = [];
                    _.forEach(response.data.accounts, function(value, key) {
                        var account = {
                            alias: value.nickName || value.description,
                            identifier: value.accountCode,
                            bookedBalance: value.totalAmountDue,
                            availableBalance: value.balance,
                            isPrimaryAccount: value.primaryBillPaymentAccount
                        };
                        if (account.isPrimaryAccount) {
                            PayeeModel.defaultAccount = account;
                        }
                        accounts.push(account);
                    });
                    return accounts;
                });
        };

        /* Fetch a list of supported frequencies */
        this.fetchFrequencies = function() {
            return $http.get(billPaymentsEndpoint + '/frequencies?' + tempQueryParams)
                .then(function(response) {
                    // if (response.data.errors.length > 0) {
                    //     //TODO Handle errors
                    // }
                    var frequencies = [];
                    _.forEach(response.data.frequencies, function(value, key) {
                        frequencies.push({
                            id: value,
                            value: $filter('translate')(value)
                        });
                    });
                    return frequencies;
                });
        };

        var transformPayment = function(payee, payment) {
            // Transform to
            var pay = {
                payeeId: payee.payeeId,
                accountCode: payment.account && payment.account.identifier,
                amount: payment.amount,
                memo: payment.memo
            };

            if (payment.isScheduledTransfer) {
                pay.frequency = payment.scheduledTransfer.frequency || 'OneTime';
                pay.processingDate = CalendarService.formatDate(payment.scheduledTransfer.startDate);

                if (payment.scheduledTransfer.endOn === 'onCancel') {
                    pay.repeatUntilCanceled = true;
                } else {
                    pay.numberOfPayments = payment.scheduledTransfer.timesToRepeat;
                }
            } else {
                pay.frequency = 'OneTime';
                pay.processingDate = CalendarService.formatDate(payment.scheduleDate);
                pay.repeatUntilCanceled = false;
                pay.numberOfPayments = 1;
            }
            return pay;
        };

        this.submitPayment = function(payee, payment) {
            var pay = transformPayment(payee, payment);
            var endPoint = '/payments?';
            if (payment.urgentTransfer) {
                endPoint = '/expedited-payments?';
            }
            return $http.post(billPaymentsEndpoint + endPoint + tempQueryParams, { payment: pay });
        };

    };

    //@ngInject
    exports.CalendarService = function($http, lpWidget, lpCoreUtils, $filter) {
        var calendarEndpoint = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('calendarDataSrc'));

        this.formatDate = function(date, format) {
            if (!format) {
                format = 'yyyy-MM-dd';
            }
            return $filter('date')(date, format);
        };
        /**
         * Get the business day after specified business days (offset).
         */
        this.getBusinessDay = function(startDate, offset) {
            var formattedStartDt = this.formatDate(startDate);

            return $http.get(calendarEndpoint + '/business-days-after' +
                tempQueryParams, { params: {date: formattedStartDt, offset: offset} })
                .then(function(response) {
                    return response.data.businessDay;
                }, function(response) {
                    return response.data && response.data.errors;
                });
        };

    };
});
