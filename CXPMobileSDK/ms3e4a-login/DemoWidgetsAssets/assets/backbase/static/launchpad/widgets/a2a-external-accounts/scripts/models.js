define(function(require, exports, module){

    'use strict';

    // @ngInject
    exports.ExtAccountsSharedData = function(lpCoreUtils, ExternalAccountsModel) {
        this.accounts = {};

        this.accountsExists = function() {
            return this.accounts[ExternalAccountsModel.accountStatusEnum.PENDING].length > 0 ||
                this.accounts[ExternalAccountsModel.accountStatusEnum.ACTIVE].length > 0 ||
                this.accounts[ExternalAccountsModel.accountStatusEnum.PROCESSING].length > 0 ||
                this.accounts[ExternalAccountsModel.accountStatusEnum.OTHER].length > 0;
        };

        this.init = function() {
           this.accounts = {
               PendingActivation: [], Active: [], InProcess: [], Other: []
           };
        };
    };

    // @ngInject
    exports.ExternalAccountsModel = function($resource, lpWidget, lpCoreUtils) {
        var Model;
        var endPoint = lpCoreUtils.resolvePortalPlaceholders(lpWidget.getPreference('externalAccountsDataSrc'));

        /**
         * Enhance the response model and initialize other ngResources if needed
         * @param  {object} model object
         * @return {object}       object with extra data
         */
        function mapItem(model) {
            var newModel = {
                id: model.externalAccountId,
                bankName: model.bankName,
                nickName: model.nickName,
                externalAccountId: model.externalAccountId,
                routingNumber: model.routingNumber,
                accountNumber: '******** ' + model.accountMask,
                accountCategory: model.accountCategory,
                group: !lpCoreUtils.contains([Model.accountStatusEnum.ACTIVE, Model.accountStatusEnum.PROCESSING, Model.accountStatusEnum.PENDING], model.status) ? Model.accountStatusEnum.OTHER : model.status,
                status: model.status
            };
            return newModel;
        }

        Model = $resource(endPoint, {}, {
            query: {
                method: 'GET',
                interceptor: {
                    response: function (response) {
                        var data = response.data.externalAccounts;
                        if(data instanceof Array && data.length > 0) {
                            return data.map(mapItem);
                        }
                        return data;
                    }
                }
            },
            create: {
                method: 'POST'
            },
            update: {
                params: { id: '@id' },
                method: 'PUT'
            },
            remove: {
                params: { id: '@id' },
                method: 'DELETE'
            },
            activate: {
                params: { id: '@id', action: 'activation' },
                method: 'PUT'
            },
            categories: {
                params: { action: 'account-categories' },
                method: 'GET',
                cache: true,
                interceptor: {
                    response: function (response) {
                        return response.data['account-categories'];
                    }
                }
            }
        });

        Model.getAll = function() {
            return this.query().$promise;
        };

        Model.createOrUpdate = function(account) {
            if (account.id) {
                return account.$update();
            } else {
                return account.$create();
            }
        };

        /* A list of available external account states */
        Model.accountStatusEnum = {
            ACTIVE: 'Active',
            PROCESSING: 'InProcess',
            PENDING: 'PendingActivation',
            OTHER: 'Other' // Other includes statues: FailedVerification, RejectedByExternalBank, DisabledForExcessiveReturns, DisabledForFraud
        };

        return Model;
    };
});
