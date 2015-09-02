define( function( require, exports, module) {

    'use strict';

    // Export vars
    var providers = {}, factories = {}, services = {};

    /*----------------------------------------------------------------*/
    /* Debit Orders Model
    /*----------------------------------------------------------------*/
    // @ngInject
    factories.lpEbillingDebitOrdersModel = function(lpEbilling, lpEbillingMandateModel, lpEbillingUtils, lpCoreI18nUtils, $resource, $q, $filter ) {

        var utils = lpEbillingUtils;
        // Provider config
        var options = lpEbilling.getConfig();
        var endPoint = utils.resolvePreference(options.debitOrdersSrc);
        // filter helpers
        var dateFilter = $filter('date');
        var eBillCurrency = $filter('eBillCurrency');
        var MandateModel = lpEbillingMandateModel;
        var Model;

        /**
         * Enhance the response model and initialize other ngResources if needed
         * @param  {object} model object
         * @return {object}       object with extra data
         */
        function mapItem(model) {

            var currencySym = lpCoreI18nUtils.CURRENCY_MAP[model.currency] || '';

            var newModel = {
                id: model.id,
                status: model.status,
                currencySym: currencySym,
                dueDate: model.paymentDueDate,
                dueDateFiltered: dateFilter( model.paymentDueDate, 'MMM dd y'),
                scheduledDate: model.paymentScheduledDate,
                scheduledDateFiltered: dateFilter( model.paymentScheduledDate, 'MMM dd'),
                statusReasonInformation: model.statusReasonInformation,
                isOverdue: utils.checkDueDate( 'isPast', model.paymentDueDate )
            };

            // Amount filtering
            if(model.amount) {
               newModel.amount = parseFloat(model.amount, 10);
               newModel.amountFiltered = eBillCurrency(model.amount, currencySym);
            }
            // MinAmount filtering
            if(model.minimalAmount) {
                newModel.minAmount = parseFloat(model.minimalAmount, 10);
                newModel.minAmountFiltered = eBillCurrency(model.minimalAmount, currencySym);
            }
            // Mandate
            if(model.mandate) {
                newModel.autoPay = model.mandate.directDebit;
                newModel.mandate = new MandateModel(model.mandate);
            }
            // History
            if(model.amountPaid) {
                newModel.amountPaid = model.amountPaid;
                newModel.amountPaidFiltered = $filter('eBillCurrency')(newModel.amountPaid, currencySym);
            }

            if(model.modifiedDate) {
                newModel.modifiedDate = model.modifiedDate;
                newModel.modifiedDateFiltered = dateFilter( model.modifiedDate, 'MMM dd');
            }
            // Debtor
            if(model.debtor) {
                newModel.debtor = model.debtor;
            }
            // Actions
            if(model.actions && model.actions instanceof Array) {
                newModel.actions = {};
                model.actions.map(function(action){
                    newModel.actions[action] = Model[action];
               });
            }
            return newModel;
        }

        // ng Resource
        Model = $resource(endPoint + '/:id/:action', {
        }, {
            query: {
                method: 'GET',
                isArray: true,
                cache: options.cache.enable,
                interceptor: {
                    response: function (response) {
                        // var status = response.config.params.status || [];
                        var data = response.data;
                        if(data instanceof Array && data.length > 0) {
                            return data.map(mapItem);
                        }
                        return data;
                    }
                }
            },
            // custom actions
            accept: {
                params: { action: 'accept' },
                method: 'POST'
            },
            decline: {
                params: { action: 'decline' },
                method: 'POST'
            },
            pay: {
                params: { action: 'pay' },
                method: 'POST'
            },
            reject: {
                params: { action: 'reject' },
                method: 'POST'
            }
        });

        /*----------------------------------------------------------------*/
        /* Object methods
        /*----------------------------------------------------------------*/

        /**
         * Get the default debit-orders list in this case 'SCHEDULED/RECEIVED/HANDLING' ones.
         *
         * @param  {object} params supported query string
         * @return {object}        ngResource object
         */
        Model.getAll = function (params) {
            params = utils.extend(params || {}, {
                status: ['SCHEDULED', 'RECEIVED', 'HANDLING'].join(',')
            });
            return this.query(params).$promise;
        };

        /**
         * Get the new debit-orders list in this case 'IN_PROGRESS' ones.
         *
         * @param  {object} params supported query string
         * @return {object}        ngResource object
         */
        Model.getAllNew = function (params) {

            params = utils.extend(params || {}, {
                status: ['IN_PROGRESS'].join(',')
            });
            return this.query(params).$promise;
        };

        /**
         * Get the history list.
         *
         * @param  {object} params supported query string
         * @return {object}        ngResource object
         */
        Model.getHistory = function (params) {

            params = utils.extend(params || {}, {
                status: ['PAID', 'REJECTED', 'REFUSED'].join(',')
            });
            return this.query(params).$promise;
        };

        return Model;
    };

    /*----------------------------------------------------------------*/
    /* Mandate Model
    /*----------------------------------------------------------------*/

    // @ngInject
    factories.lpEbillingMandateModel = function(lpEbilling, lpEbillingUtils, $resource) {

        var utils = lpEbillingUtils;
        // Provider Config
        var options = lpEbilling.getConfig();
        var endPoint = utils.resolvePreference(options.mandatesSrc);
        var Model;

        // Mapping function
       function mapItem(model) {
            var newModel = {
                id: model.id,
                creditorName: model.creditor.name,
                creditorReference: model.creditor.reference,
                creditorAddress: model.creditor.postalAddress,
                debitorName: model.debtor.name,
                debitorAccount: model.debtor.account,
                notifyOnNewOrders: model.notifyOnNewOrders
            };
             // Actions
            if(model.actions && model.actions instanceof Array) {
                newModel.actions = {};
                model.actions.map(function(action){
                    newModel.actions[action] = Model[action];
               });
            }
            return newModel;
        }

        // ngResource Function
        Model = $resource(endPoint + '/:id/:action', {
            id: '@id'
        }, {
            get: {
                method: 'GET', isArray: false, cache: options.cache.enable,
                interceptor: {
                    response: function (response) {
                        return mapItem(response.data);
                    }
                }
            },
            // Custom action
            enableDirectDebit: {
                method: 'POST'
            },
            disableDirectDebit: {
                method: 'POST'
            },
            enableNotifyOnNewOrders: {
                method: 'POST'
            },
            disableNotifyOnNewOrders: {
                method: 'POST'
            }
        });

        return Model;
    };

    /*----------------------------------------------------------------*/
    /* Cache Service
    /*----------------------------------------------------------------*/

    // @ngInject
    factories.lpEbillingCache = function($cacheFactory) {
        var cache, options;
        return {
            init: function(opts){
                options = opts;
                cache = $cacheFactory('EBill.Cache', options);
            },
            put: function(k, v) {
                return !!options.enable && cache.put(k, v);
            },
            remove: function(k) {
                return cache.remove(k);
            },
            removeAll: function() {
                return cache.removeAll();
            },
            get: function(k) {
                return cache.get(k);
            },
            info: function() {
                return cache.info();
            },
            // #TODO $templateCache
            template: function() {
            }
        };
    };

    /*----------------------------------------------------------------*/
    /* Bus Service
    /*----------------------------------------------------------------*/
    // @ngInject
    services.lpEbillingBus = function($rootScope, $window, lpEbillingUtils) {

        var utils = lpEbillingUtils;

        var canBubble = utils.isObject($window.gadgets.pubsub) && utils.isFunction($window.gadgets.pubsub.publish);
        this.channels = {};

        this.publish = function(event, data, bubble) {
            utils.info('%c' + event, 'color: blue');
            $rootScope.$emit(event, data);
            if(typeof bubble === 'boolean' && bubble && canBubble) {
                $window.gadgets.pubsub.publish(event, data);
            }
        };

        this.subscribe = function(event, handler, bubble) {
            this.channels[event] = $rootScope.$on(event, handler);
            if(typeof bubble === 'boolean' && bubble && canBubble) {
                $window.gadgets.pubsub.subscribe(event, handler);
            }
        };
        this.unsubscribe = function(event, handler, bubble) {
            if (this.channels[event]) {
                this.channels[event]();
            }
            if(typeof bubble === 'boolean' && bubble && canBubble) {
                $window.gadgets.pubsub.unsubscribe(event, handler);
            }
            return this;
        };
    };

    /*----------------------------------------------------------------*/
    /* Export
    /*----------------------------------------------------------------*/
    exports.providers = providers;
    exports.factories = factories;
    exports.services = services;
});
