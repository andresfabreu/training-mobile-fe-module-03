define(function(require, exports, module){
    'use strict';

    var _ = require('base').utils;

    // Uncomment this when using widget standalone
    // var tempQueryParams = '?partyId=0000000222';
    var tempQueryParams = '';

    // @ngInject
    exports.bpModel = function() {

        this.paymentMethods = {
            CHECK: 'CHECK',
            ELECTRONIC: 'ELECTRONIC'
        };

        this.eBillSetupSteps = {
            SELECT_SITE: 0,
            PROVIDE_LOGIN: 1,
            SELECT_ACCOUNT: 2,
            COMPLETE: 3,
            CHECK_STATUS: 4
        };

        this.currentBiller = {
            payeeId: null,
            ebillEligible: null,
            paymentMethod: null,
            ebills: null
        };

        this.payment = null;

        this.isCurrentBillerCheck = function() {
            return this.currentBiller.paymentMethod === this.paymentMethods.CHECK;
        };
    };

    // Bill Payments Service

    // @ngInject
    exports.bpService = function($http, $filter, lpWidget, lpCoreUtils) {
        var model = this;
        var billPaymentsEndpoint = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('billPaymentsDataSrc'));

        model.getTopVendors = function() {
            model.isConnecting = true;

            return $http.get(billPaymentsEndpoint + '/top-billers' + tempQueryParams)
                .then(function(res) {
                    if (model.isConnecting) {
                        model.isConnecting = false;
                        model.billers = res && res.data && res.data.billerGroups || [];
                        return model.billers;
                    } else {
                        return null;
                    }
                });
        };

        model.searchVendors = function(params) {
            model.isConnecting = true;
            return $http.get(billPaymentsEndpoint + '/billers' + tempQueryParams, { params: params })
                .then(function(res) {
                    if (model.isConnecting) {
                        model.isConnecting = false;
                        model.billers = res && res.data && res.data.billers || [];
                        return model.billers;
                    } else {
                        return null;
                    }
                });
        };

        model.cancelSearch = function() {
            model.isConnecting = false;
        };

        /**
         * Adds biller to users biller list
         */
        model.addPayee = function(payee) {
            model.isConnecting = true;
            model.errors = null;
            var createPayee = {
                id: payee.id,
                name: payee.name,
                account: payee.account,
                address: payee.address,
                paymentMethod: payee.paymentMethod
            };
            // TODO: update url
            return $http.post(billPaymentsEndpoint + '/payees' + tempQueryParams, createPayee)
                .then(function(response) {
                    model.isConnecting = false;
                    if (response.data.errors.length > 0) {
                        model.errors = response.data.errors;
                        return payee;
                    }
                    payee = response.data;
                    payee.ebillEligible = response.data.eBillsStatus === 'ELIGIBLE';
                    return payee;
                }, function(response) {
                    model.isConnecting = false;
                    model.errors = response.data && response.data.errors;
                    if (response.data.addresses) {
                        payee.addresses = response.data.addresses;
                        return payee;
                    }
                });
        };

        model.getAccounts = function() {
            model.isConnecting = true;
            model.errors = null;
            return $http.get(billPaymentsEndpoint + '/accounts' + tempQueryParams)
                .then(function(response) {
                    model.isConnecting = false;
                    var accounts = [];
                    _.forEach(response.data.accounts, function(value, key) {
                        var account = {
                            alias: value.nickName,
                            identifier: value.accountCode,
                            bookedBalance: value.totalAmountDue,
                            availableBalance: value.balance,
                            isPrimaryAccount: value.primaryBillPaymentAccount
                        };
                        accounts.push(account);
                    });

                    return accounts;
                }, function(response) {
                    model.isConnecting = false;
                    model.errors = response.data && response.data.errors;
                });
        };

        /* Returns a list of supported frequencies */
        model.getFrequencies = function() {
            model.isConnecting = true;
            model.errors = null;
            return $http.get(billPaymentsEndpoint + '/frequencies' + tempQueryParams)
                .then(function(response) {
                    model.isConnecting = false;
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

        /**
         * Schedule a payment.
         * If payment.urgentTransfer === true creates an expedited payment
         * (marked to be processed as soon as it is created).
         */
        model.makeAPayment = function(payment) {
            model.isConnecting = true;
            model.errors = null;
            var endPoint = '/payments';
            if (payment.urgentTransfer) {
                endPoint = '/expedited-payments';
            }
            return $http.post(billPaymentsEndpoint + endPoint + tempQueryParams, payment)
                .then(function(response) {
                    model.isConnecting = false;
                    if (response.data.errors.length > 0) {
                        model.errors = response.data.errors;
                    }
                    return payment;
                }, function(response) {
                    model.isConnecting = false;
                    model.errors = response.data && response.data.errors;
                });
        };

        model.fetchPayee = function(payee) {
            return $http.get(billPaymentsEndpoint + '/payees/' + payee.payeeId +
                tempQueryParams).then(function(response) {
                    return response.data;
                });
        };
    };

    // @ngInject
    exports.eBillsService = function($http, lpWidget, bpModel, lpCoreUtils){
        var model = this;
        var billPaymentsEndpoint = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('billPaymentsDataSrc'));

        model.hasNoErrors = function() {
            return model.errors === null || model.errors === undefined || model.errors.length === 0;
        };

        /**
         * Credential mapping function.
         * Should contain any transformations need for widget use
         */
        function handleEBillsResponse(data) {
            var credentials = {};
            credentials.sessionId = data.sessionId;
            credentials.furtherActionNeeded = data.furtherActionNeeded;

            if (data.furtherActionNeeded === 'false') {
                credentials.step = bpModel.eBillSetupSteps.COMPLETE;
                return credentials;
            }

            if (data.nextAction) {

                credentials.url = data.nextAction.url;

                if (data.nextAction.credentialsParams) {
                    credentials.step = bpModel.eBillSetupSteps.PROVIDE_LOGIN;
                    credentials.credentialsParams = data.nextAction.credentialsParams;
                    credentials.credentialsParams.forEach(function(entry) {
                        entry.inputFieldType = entry.masked ? 'PASSWORD' : 'TEXT';
                    });
                }
                if (data.nextAction.billerSite) {
                    credentials.step = bpModel.eBillSetupSteps.SELECT_SITE;
                    credentials.url = data.nextAction.url;
                    credentials.sessionId = data.sessionId;
                    credentials.sites = data.nextAction.billerSite;
                }
                if (data.nextAction.accounts) {
                    credentials.step = bpModel.eBillSetupSteps.SELECT_ACCOUNT;
                    credentials.accounts = data.nextAction.accounts;
                }
            } else {
                credentials.checkStatus = true;
            }
            return credentials;
        }

        /**
         * Fetches credentials needed to authenticate user in a billers site
         */
        model.fetchInfo = function(payee) {
            model.isConnecting = true;
            model.errors = null;
            return $http.post(billPaymentsEndpoint + '/e-bills' + tempQueryParams, payee)
                .then(function(response) {
                    model.isConnecting = false;
                    return handleEBillsResponse(response.data);
                }, function(response) {
                    model.isConnecting = false;
                    model.errors = response.data.errors;
                });
        };

        model.checkStatus = function(credentials) {
            model.isConnecting = true;
            model.errors = null;
            return $http.get(billPaymentsEndpoint + '/e-bills/status' +
                tempQueryParams, { params: {sessionId: credentials.sessionId} })
                .then(function(response) {
                    model.isConnecting = false;
                    return handleEBillsResponse(response.data);
                }, function(response) {
                    model.isConnecting = false;
                    model.errors = response.data.errors;
                });
        };

        model.nextAction = function(ebillInfo) {
            model.isConnecting = true;
            model.errors = null;
            return $http.post(billPaymentsEndpoint + ebillInfo.url + tempQueryParams,
                              ebillInfo)
                .then(function(response) {
                    model.isConnecting = false;
                    return handleEBillsResponse(response.data);
                }, function(response) {
                    model.isConnecting = false;
                    model.errors = response.data.errors;
                });
        };

    };

    // @ngInject
    exports.calendarService = function($http, lpWidget, lpCoreUtils) {
        var model = this;
        var calendarEndpoint = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('calendarDataSrc'));

        /**
         * Get the business day after specified business days (offset).
         */
        model.getBusinessDay = function(startDate, offset) {
            model.isConnecting = true;
            model.errors = null;
            return $http.get(calendarEndpoint + '/business-days-after' +
                tempQueryParams, { params: {date: startDate, offset: offset} })
                .then(function(response) {
                    model.isConnecting = false;
                    if (response.data.errors.length > 0) {
                        model.errors = response.data.errors;
                    }
                    return response.data.businessDay;
                }, function(response) {
                    model.isConnecting = false;
                    model.errors = response.data && response.data.errors;
                });
        };

    };
});
