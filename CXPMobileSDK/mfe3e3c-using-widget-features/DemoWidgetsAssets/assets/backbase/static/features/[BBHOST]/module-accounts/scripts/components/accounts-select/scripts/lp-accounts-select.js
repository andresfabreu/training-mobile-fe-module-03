define(function(require, exports, module) {

    'use strict';

    var ng = require('base').ng;

    // @ngInject
    exports.lpAccountsSelect = function($templateCache, $timeout, $compile, lpCoreBus) {
        // Dependencies:
            // lp-aria-number
            //
        $templateCache.put('$accountSelectTemplate.html',
            '<div class="clearfix">' +
                '<div class="pull-left lp-acct-detail">' +
                    '<div class="clearfix">' +
                        '<div class="pull-left">' +
                            '<div class="lp-acct-name"><span>{{option.alias}}</span></div>' +
                            '<div class="lp-acct-num"><span lp-aria-number="option.identifier"></span></div>' +
                            '<div class="lp-custom-fields">' +
                                '<div ng-repeat="f in option.customFields track by $index" ng-class="\'lp-cf-\' + f">{{option[f]}}</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div ng-hide="option.hideAmounts" class="pull-right text-right">' +
                    '<div class="h4 lp-account-amount"><span class="sr-only" lp-i18n="Account balance"></span><span lp-format-amount="option" lp-balance-update="lp-balance-update" ng-model="option"></span></div>' +
                    '<div class="h6 lp-account-bal" ng-if="option.preferredBalance !== \'current\'"><small lp-i18n="Current:"></small> <span lp-amount="option.bookedBalance" lp-amount-currency="option.currency"/></div>' +
                    '<div class="h6 lp-account-bal" ng-if="option.preferredBalance === \'current\'"><small lp-i18n="Available:"></small> <span lp-amount="option.availableBalance" lp-amount-currency="option.currency"/>' +
                '</div>' +
            '</div>'
        );

        $templateCache.put('$cardsSelectTemplate.html',
                '<div class="clearfix">' +
                    '<div class="card-name-info hidden-sm">' +
                        '<div class="clearfix">' +
                            '<div class="pull-left">' +
                                '<div class="lp-acct-name"><span>{{option.alias}}</span></div>' +
                                '<div class="lp-acct-num"><small lp-i18n="card ending"></small> <span lp-aria-number="option.cardNumber"></span></div>' +
                                '<div class="lp-custom-fields">' +
                                    '<div ng-repeat="f in option.customFields track by $index" ng-class="\'lp-cf-\' + f">{{option[f]}}</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="card-balance-info text-right text-uppercase h6">' +
                        '<div>' +
                            '<small ng-if="option.preferredBalance === \'current\'" lp-i18n="Current balance"></small><br/>' +
                            '<small ng-if="option.preferredBalance !== \'current\'" lp-i18n="Available credit"></small><br/>' +
                            '<span class="h4" lp-format-amount="option" lp-balance-update="lp-balance-update" ng-model="option"></span>' +
                        '</div>' +
                        '<div ng-if="option.preferredBalance === \'current\'">' +
                            '<small lp-i18n="Available credit"></small> <span lp-amount="option.availableBalance" lp-amount-currency="option.currency"/>' +
                        '</div>' +
                        '<div ng-if="option.preferredBalance !== \'current\'">' +
                            '<small lp-i18n="Current balance"></small><br/>' +
                            '<span lp-amount="option.bookedBalance" lp-amount-currency="option.currency"/>' +
                        '</div>' +
                    '</div>' +
                '</div>'
        );

        var getTemplate = function(type) {
            var dropDownTemplate = type === 'cards' ? '$cardsSelectTemplate.html' : '$accountSelectTemplate.html';
            return [
                '<div class="lp-account-select">',
                    '<div class="clearfix" dropdown-select ng-model="model" ng-options="account as account for account in accounts"',
                        'option-template-url="' + dropDownTemplate + '" ng-change="changed()" lp-element-resize="resize(data)"',
                        'empty-placeholder-text="Select an account...">',
                    '</div>',
                '</div>'
            ].join('');
        };

        var getResponsiveClass = function (width) {
            if (width > 400) {
                return 'lp-large-account-select-size';
            }
            if (width > 300) {
                return 'lp-normal-account-select-size';
            }
            return 'lp-small-account-select-size';
        };

        var link = function(scope, element, attrs, ngModelCtrl){
            if (attrs.prefferedBalanceView && !attrs.preferredBalanceView) {
                attrs.preferredBalanceView = attrs.prefferedBalanceView; // backward compatible with mis-spelling
            }
            scope.preferredBalance = attrs.preferredBalanceView || 'current';

            element.html(getTemplate(attrs.type));
            var customFields = attrs.customFields;
            if (customFields) {
                customFields = customFields.split(',');
            }
            $compile(element.contents())(scope);

            if(attrs.designatedClass) {
                var child = ng.element(element.children()[0]);
                child.addClass(attrs.designatedClass);
            }

            function applyScope () {
                $timeout(function() {
                    scope.$apply();
                });
            }

            ngModelCtrl.$render = function() {
                var selected = ngModelCtrl.$modelValue,
                    accounts = scope.accounts;

                if (accounts && accounts.length > 0) {
                    ng.forEach(accounts, function(account) {
                        // pass preferredBalance into option to be accessible in option template.
                        account.preferredBalance = scope.preferredBalance;

                        if (customFields && !account.customFields) {
                            account.customFields = customFields;
                        }
                        if (selected && selected.id === account.id) {
                            scope.model = account;
                        }
                    });
                } else {
                    scope.model = null;
                }

                applyScope();
            };

            scope.changed = function() {
                ngModelCtrl.$setViewValue(scope.model);
            };

            scope.$watch('lpAccounts', function(accounts) {
                scope.accounts = accounts || [];
                ngModelCtrl.$render();
            });

            lpCoreBus.subscribe('accounts-dropdown.select-account', function (account) {
                ngModelCtrl.$modelValue = account;
                ngModelCtrl.$render();
            });

            scope.resize = function(data) {
                data.element.removeClass('lp-large-account-select-size');
                data.element.removeClass('lp-normal-account-select-size');
                data.element.removeClass('lp-small-account-select-size');

                data.element.addClass(getResponsiveClass(data.width));
            };
        };

        return {
            restrict: 'EA',
            replace: true,
            require: 'ngModel',
            scope: {
                lpAccounts: '='
            },
            link: link
        };
    };
});
