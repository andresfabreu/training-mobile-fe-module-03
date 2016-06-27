define(function(require, exports, module) {

    'use strict';

    var ng = require('base').ng;

    // @ngInject
    exports.lpPayeeAccountSelect = function($templateCache, $compile) {
        // Dependencies:
            // lp-aria-number
            //
        $templateCache.put('$payeeAccountSelect.html',
            '<div class="clearfix">' +
                '<div class="pull-left lp-acct-detail">' +
                    '<div class="clearfix">' +
                        '<div class="pull-left">' +
                            '<div class="lp-acct-name"><span>{{option.alias}}</span><span class="lp-acct-num">{{ option.shortIdentifier }}</span></div>' +
                            '<div class="lp-custom-fields">' +
                                '<div ng-repeat="f in option.customFields track by $index" ng-class="\'lp-cf-\' + f">{{option[f]}}</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div ng-hide="option.hideAmounts" class="pull-right text-right">' +
                    '<div class="lp-account-amount"><span class="sr-only" lp-i18n="Account balance"></span><span lp-format-amount="option" lp-balance-update="lp-balance-update" ng-model="option"></span></div>' +
                '</div>' +
            '</div>'
        );

        var getTemplate = function() {
            var dropDownTemplate = '$payeeAccountSelect.html';
            return [
                '<div class="lp-payee-account-select">',
                    '<div ng-class="{ \'input-group\': lpSelectLabel }">',
                    '<span class="input-group-addon" ng-if="lpSelectLabel">{{ lpSelectLabel }}</span>',
                    '<div class="clearfix" dropdown-select ng-model="model" ng-options="account as account for account in accounts"',
                        'option-template-url="' + dropDownTemplate + '" ng-change="changed()" lp-element-resize="resize(data)"',
                        'empty-placeholder-text="Select your destination account...">',
                    '</div>',
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

            element.html(getTemplate());
            var customFields = attrs.customFields;
            if (customFields) {
                customFields = customFields.split(',');
            }
            $compile(element.contents())(scope);

            if(attrs.designatedClass) {
                var child = ng.element(element.children()[0]);
                child.addClass(attrs.designatedClass);
            }

            ngModelCtrl.$render = function() {
                var selected = ngModelCtrl.$modelValue,
                    accounts = scope.accounts;

                if (accounts && accounts.length > 0) {
                    ng.forEach(accounts, function(account) {
                        // pass preferredBalance into option to be accessible in option template.
                        account.preferredBalance = scope.preferredBalance;
                        account.shortIdentifier = ' * ' + account.identifier.substr(-4);

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
            };

            scope.changed = function() {
                ngModelCtrl.$setViewValue(scope.model);
            };

            scope.$watch('lpAccounts', function(accounts) {
                scope.accounts = accounts || [];
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
                lpAccounts: '=',
                lpSelectLabel: '@'
            },
            link: link
        };
    };
});
