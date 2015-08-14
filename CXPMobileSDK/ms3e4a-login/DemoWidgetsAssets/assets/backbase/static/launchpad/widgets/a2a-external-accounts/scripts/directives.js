/* globals define */

define( function (require, exports, module) {
    'use strict';

    //@ngInject
    exports.accountGroup = function ($modal, lpCoreUtils, lpWidget, ExternalAccountsModel, ExtAccountsSharedData) {
        var templatesDir = lpCoreUtils.getWidgetBaseUrl(lpWidget) + '/templates';

        var removeConfirmationTemplate =
            '<div class="modal-header">' +
            '    <h2><i class="lp-icon lp-icon-xxl lp-icon-info-sign"></i> <span lp-i18n="Please confirm"></span></h2>' +
            '</div>' +
            '<form role="form" ng-submit="remove()">' +
            '    <div class="modal-body">' +
            '        <div ng-show="review.modalError">' +
            '        <div alert="alert" type="danger">{{ review.modalError | translate }}</div>' +
            '        </div>' +
            '        <p>' +
            '            <b lp-i18n="Are you sure you want to remove this external account?"></b>' +
            '        </p>' +
            '        <div class="row">' +
            '            <div class="col-xs-8">' +
            '            <span class="h4" itemprop="nickName"> {{account.nickName}}</span>' +
            '        </div>' +
            '    </div>' +
            '    <div class="row">' +
            '        <div class="col-xs-12">' +
            '            <small class="text-muted">' +
            '                {{ account.bankName }}' +
            '            </small>' +
            '        </div>' +
            '    </div>' +
            '    <div class="modal-footer text-right" >' +
            '        <div ng-show="error.isError" class="bg-warning text-danger pull-left" lp-i18n="Server error!"></div>' +
            '        <button name="closeModal" class="btn btn-link" ng-click="cancel()" type="button" lp-i18n="Cancel"></button>' +
            '        <button type="submit" class="btn btn-danger" lp-i18n="Remove"></button>' +
            '    </div>' +
            '</form>';

        var linkFn = function (scope, $element, $attrs) {
            scope.statusEnum = ExternalAccountsModel.accountStatusEnum;

            scope.edit = function(account) {
                scope.$emit('a2aExternalTransfers.viewStateChange',
                            { view: 'view.edit', account: new ExternalAccountsModel(account) });
            };

            scope.remove = function(account) {
                var modalInstance = $modal.open({
                    template: removeConfirmationTemplate,
                    controller: 'RemoveConfirmationCtrl',
                    resolve: {
                        account: function() {
                            return account;
                        }
                    }
                });

                modalInstance.result.then(function (res) {
                    account.loading = true;
                    new ExternalAccountsModel(account).$remove().then(function(success) {
                        var group = ExtAccountsSharedData.accounts[account.group];
                        group.splice(group.indexOf(account), 1);
                    })['finally'](function() {
                        account.loading = false;
                    });
                }, function (err) {
                    console.log(err);
                });
            };

            scope.activate = function(account) {
                scope.$emit('a2aExternalTransfers.viewStateChange',
                            { view: 'view.activate', account: new ExternalAccountsModel(account) });
            };
        };
        return {
            restrict: 'EA',
            link: linkFn,
            templateUrl: templatesDir + '/group.ng.html',
            scope: {
                header: '@',
                listItems: '='
            }
        };
    };

});
