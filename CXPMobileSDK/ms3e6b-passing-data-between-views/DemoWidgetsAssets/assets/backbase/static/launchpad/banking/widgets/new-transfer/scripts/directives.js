define(function(require, exports, module) {
    'use strict';

    var $ = window.jQuery;

    /**
     * UPDATE: special ugly directive which should modify widget's layout
     *         in order to provide update functionality (and remove those
     *         changes on the widget's exit.
     */
    // @ngInject
    exports.lpTransactionUpdateLayout = function(lpCoreBus, $timeout) {
        return {
            restrict: 'A',
            scope: {
                paymentOrder: '=lpTransactionUpdateLayout'
            },
            link: function(scope, el, attrs, ngModel) {
                // sorry for this jQuery ugliness :(
                var $launcher = $(el[0]).closest('.lp-launcher-area');
                var $close = $launcher.find('.close');
                var $title = $launcher.find('.widget-title span');
                var defaultTitle = $title.text();

                scope.$watch('paymentOrder.update', function(update) {
                    if (update) {
                        $timeout(function() { $title.text('Update Transfer'); });
                    } else {
                        $timeout(function() { $title.text(defaultTitle); });
                    }
                });

                $close.click(function() {
                    // on exit we should remove 'signs' of updating process
                    scope.paymentOrder.update = false;
                });

                lpCoreBus.subscribe('launchpad-retail.closeActivePanel', function() {
                    // on exit we should remove 'signs' of updating process
                    scope.paymentOrder.update = false;
                });
            }
        };
    };

    // @ngInject
    exports.lpFutureTime = function() {
        return {

            require: '?ngModel',

            link: function(scope, elm, attrs, ngModel) {

                var now = new Date();
                now.setDate(now.getDate() - 1);
                now = now.getTime();

                ngModel.$parsers.unshift(function(value) {
                    var date;

                    // Empty field
                    if (!value) {
                        ngModel.$setValidity('lpFutureTime', true);
                        return null;
                    }

                    date = Date.parse(value);

                    // Unparsable date
                    if (isNaN(date) || date < 0) {
                        ngModel.$setValidity('lpFutureTime', false);
                        return value;
                    }

                    // Valid date, but in the past or present
                    if (date <= now) {
                        ngModel.$setValidity('lpFutureTime', false);
                        return value;
                    }

                    // Future Date
                    ngModel.$setValidity('lpFutureTime', true);
                    return value;
                });
            }
        };
    };

    // @ngInject
    exports.lpSmartsuggest = function(lpCoreUtils, ContactsModel, SmartSuggestEngine, SmartSuggestFormatter) {

        return {
            restrict: 'A',
            scope: {
                'lpSmartsuggestSelect': '&',
                'lpSmartsuggestClear': '&',
                'contacts': '=lpContacts',
                'accounts': '=lpAccounts',
                'model': '=ngModel'
            },
            link: function(scope, element, attrs){

                //setup the smart suggest engine
                var smartSuggest = new SmartSuggestEngine({
                    showTitles: true
                });
                smartSuggest.addSuggester({
                    data: [],
                    suggest: SmartSuggestEngine.builtIn.getContactSuggestions
                });

                scope.$watch('accounts', function(accounts) {
                    smartSuggest.addSuggester({
                        data: accounts,
                        suggest: SmartSuggestEngine.builtIn.getAccountSuggestions,
                        type: SmartSuggestEngine.types.ACCOUNT,
                        options: {
                            showAll: true
                        }
                    });
                });

                scope.$watch('contacts', function(contacts) {
                    //TODO: why is this not an empty array when empty?
                    if(lpCoreUtils.isArray(contacts)) {
                        smartSuggest.addSuggester({
                            data: contacts,
                            suggest: SmartSuggestEngine.builtIn.getContactSuggestions,
                            type: SmartSuggestEngine.types.CONTACT,
                            options: {
                                showAll: true
                            }
                        });
                    }
                });


                var formatter = new SmartSuggestFormatter({
                    locale: 'en-US'
                });

                // https://github.com/angular/angular.js/issues/1924
                scope.$watch('model', function() {
                    scope.$eval(attrs.ngModel + ' = model');
                });

                scope.$watch(attrs.ngModel, function(val) {
                    scope.model = val;
                });

                $(element).autosuggest({
                    lookup: function(q) {
                        var suggs = smartSuggest.getSuggestions(q);
                        suggs = suggs.map(function(suggestion) {
                            var values = formatter.format(suggestion);

                            var displayValue;
                            if(suggestion.contact) {
                                displayValue = suggestion.contact.name;
                            } else if(values.length === 2) {
                                displayValue = values[0] + ' to ' + values[1];
                            } else {
                                displayValue = values[0];
                            }

                            return {
                                data: suggestion,
                                value: displayValue
                            };
                        });
                        return suggs;
                    },
                    onSelect: function (suggestion) {
                        var account,
                            name;

                        if (suggestion.data.type === SmartSuggestEngine.types.TITLE) {
                            return false;
                        }

                        switch (suggestion.data.type) {
                            case SmartSuggestEngine.types.CONTACT:
                                name = suggestion.data.contact.name;
                                account = suggestion.data.contact.account;
                                break;
                            case SmartSuggestEngine.types.ACCOUNT:
                                name = suggestion.data.account.name;
                                account = suggestion.data.account.iban;
                                break;
                        }
                        scope.model = name;
                        scope.lpSmartsuggestSelect({account: account});
                        return false;
                    },
                    onClear: function() {
                        scope.lpSmartsuggestClear();
                    },
                    formatResult: function(suggestion) {
                        return formatter.getSuggestionHtml(suggestion.data);
                    },
                    autoSelectFirst: false,
                    minChars: 0
                });
            }
        };
    };
});
