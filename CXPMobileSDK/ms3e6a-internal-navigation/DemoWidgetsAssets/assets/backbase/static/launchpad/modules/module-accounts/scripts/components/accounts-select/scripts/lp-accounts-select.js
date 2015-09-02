define(function(require, exports, module) {

    'use strict';

    var ng = require('base').ng;

    // #TODO remove widget deps and use directive configuration object
    // @ngInject
    exports.lpAccountsSelect = function($templateCache, $compile, widget) {
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
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="pull-right text-right">' +
                    '<div class="h4 lp-account-amount"><span class="sr-only" lp-i18n="Account balance"></span><span lp-format-amount="option" lp-balance-update="lp-balance-update" ng-model="option"></span></div>' +
                    '<div class="h6 lp-account-bal" ng-if="$parent.$parent.$parent.preferredBalance !== \'current\'"><small lp-i18n="Current:"></small> <span lp-amount="option.bookedBalance" lp-amount-currency="option.currency"/></div>' +
                    '<div class="h6 lp-account-bal" ng-if="$parent.$parent.$parent.preferredBalance === \'current\'"><small lp-i18n="Available:"></small> <span lp-amount="option.availableBalance" lp-amount-currency="option.currency"/>' +
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
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="card-balance-info text-right text-uppercase h6">' +
                        '<div>' +
                            '<small ng-if="$parent.$parent.$parent.preferredBalance === \'current\'" lp-i18n="Current balance"></small><br/>' +
                            '<small ng-if="$parent.$parent.$parent.preferredBalance !== \'current\'" lp-i18n="Available credit"></small><br/>' +
                            '<span class="h4" lp-format-amount="option" lp-balance-update="lp-balance-update" ng-model="option"></span>' +
                        '</div>' +
                        '<div ng-if="$parent.$parent.$parent.preferredBalance === \'current\'">' +
                            '<small lp-i18n="Available credit"></small> <span lp-amount="option.availableBalance" lp-amount-currency="option.currency"/>' +
                        '</div>' +
                        '<div ng-if="$parent.$parent.$parent.preferredBalance !== \'current\'">' +
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
                    '<div dropdown-select ng-model="model" ng-options="account as account for account in accounts"',
                        'option-template-url="' + dropDownTemplate + '" ng-change="changed()" lp-responsive="lp-responsive" ',
                        'size-rules="responsiveRules" empty-placeholder-text="Select an account...">',
                    '</div>',
                '</div>'
            ].join('');
        };

        var link = function(scope, element, attrs, ngModelCtrl){
            scope.preferredBalance = attrs.prefferedBalanceView || 'current';
            // widget.getPreferenceFromParents('preferredBalanceView') || 'current';

            element.html(getTemplate(attrs.type));
            // #TODO use configuration instead of passing widget object
            var customFields = widget.getPreference('accountSelectCustomFields');
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

                if (selected && accounts && accounts.length > 0) {
                    ng.forEach(accounts, function(account) {
                        if (customFields && !account.customFields) {
                            account.customFields = customFields;
                        }
                        if (selected.id === account.id) {
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

            scope.formatDefaultText = function(text) {
                return '<div class="something">' + text + '</div>';
            };

            scope.$watch('lpAccounts', function(accounts) {
                scope.accounts = accounts || [];
                ngModelCtrl.$render();
            });

            scope.responsiveRules = [
                { max: 300, size: 'small-account-select' },
                { min: 301, max: 400, size: 'normal-account-select' },
                { min: 401, size: 'large-account-select'}
            ];
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
