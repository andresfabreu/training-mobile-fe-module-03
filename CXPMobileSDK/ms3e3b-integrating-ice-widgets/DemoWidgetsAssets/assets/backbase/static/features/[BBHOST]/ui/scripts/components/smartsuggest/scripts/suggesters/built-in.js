/*global define */
define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var core = require('core');

    var config = require('../types/config');
    var util = require('../partials/util');
    var regex = require('../partials/regex');

    module.name = 'ui.smartsuggest-engine-built-in-suggesters';

    module.exports = base.createModule(module.name, [
        core.name,
        util.name,
        config.name
    ]);

    var STRIP_ACC_FORMATTING_REGEX = regex['STRIP_ACC_FORMATTING_REGEX'];

    // @ngInject
    var builtInFactory = function (lpCoreUtils, SmartSuggestConfig, SmartSuggestEngineUtil) {
        var builtIn = {};
        var types = SmartSuggestConfig.TYPES;
        var getSuggesterFnName = function (type) {
            return lpCoreUtils.camelCase('--get-' + (type || 'general') + '-suggestions');
        };

        /**
         * HELPER: Add a built-in suggest function to suggester
         *
         * @param suggester
         * @returns {*}
         */
        builtIn.addSuggestFunction = function(suggester) {

            // no suggest function provided -- adding here from built-in list
            if (typeof suggester.suggest !== 'function') {
                suggester.suggest = builtIn[getSuggesterFnName(suggester.type)];
            }

            // Comment: if the 'suggest' function is already in suggester, then we rely on it
            // and presume it is ok (no validation for now)

            return suggester;
        };

        // DATE
        builtIn.getDateSuggestions = function(term1, term2) {
            var self = this;
            var suggestions = [];

            var from = SmartSuggestEngineUtil.parseDate(term1);
            var to = SmartSuggestEngineUtil.parseDate(term2);

            //if user this is not a displayAsRange search, i.e. search on specific day or month, 'July'
            if(from && !to) {
                to = SmartSuggestEngineUtil.makeToDateInclusive(term1, from);
                suggestions.push({
                    terms: [term1, term2],
                    type: this.type || types.DATE,
                    displayAsRange: false,
                    search: {
                        from: from,
                        to: to
                    }
                });
            }

            var predicted = false;
            //always provide a range suggestion (predicted or user specified)
            if(from) {
                if(!term2 || (to && from.getTime() > to.getTime())) {
                    to = SmartSuggestEngineUtil.predictToDate(term1, from);
                    predicted = true;
                } else {
                    to = SmartSuggestEngineUtil.makeToDateInclusive(term2, to);
                }
                if(from.getTime() < to.getTime()) {
                    suggestions.push({
                        terms: [term1, term2],
                        type: this.type,
                        displayAsRange: true,
                        predicted: predicted,
                        search: {
                            from: from,
                            to: to
                        }
                    });
                }
            }

            // Advanced Date suggestions
            var dates = SmartSuggestEngineUtil.getAdvancedDatesArray(term1, term2) || [];
            dates.forEach(function (item) {
                if (lpCoreUtils.isDate(item.from)) {
                    suggestions.push({
                        terms: [term1, term2],
                        type: self.type,
                        displayAsRange: lpCoreUtils.isDate(item.to) ? true : false,
                        search: {
                            from: item.from,
                            to: item.to
                        }
                    });
                }
            });

            return suggestions;
        };

        // AMOUNT
        builtIn.getAmountSuggestions = function(term1, term2) {

            var suggestions = [];

            var from = SmartSuggestEngineUtil.parseAmount(term1);
            var to = SmartSuggestEngineUtil.parseAmount(term2);

            //if user this is not a range search, make it a fuzzy range
            if(from && !to) {
                var fuzzyRange = SmartSuggestEngineUtil.makeNumberFuzzy(from);
                suggestions.push({
                    terms: [term1, term2],
                    type: this.type || types.AMOUNT,
                    displayAsRange: false,
                    search: {
                        original: from,
                        from: fuzzyRange.from,
                        to: fuzzyRange.to
                    }
                });
            }

            var predicted = false;
            //always provide a range suggestion (predicted or user specified)
            if(from) {
                //if it is a range suggestion predict the to number
                if(!term2 || (to && from > to)) {
                    to = SmartSuggestEngineUtil.predictToAmount(from);
                    predicted = true;
                }
                if(from < to) {
                    suggestions.push({
                        terms: [term1, term2],
                        type: this.type,
                        displayAsRange: true,
                        predicted: predicted,
                        search: {
                            from: from,
                            to: to
                        }
                    });
                }
            }
            return suggestions;
        };

        // ACCOUNT
        builtIn.getAccountSuggestions = function(term){
            var self = this,
                suggestions = [],
                accounts = this.data || [];

            if(term.length < 2 && !this.options.showAll) {
                return suggestions;
            }

            accounts.forEach(function(account) {

                var nameRegex = new RegExp('(' + term + ')', 'ig');
                var nameMatch = account.name.match(nameRegex);
                var bbanMatch = false;

                if(!nameMatch) {
                    var unformattedTerm = term.replace(STRIP_ACC_FORMATTING_REGEX, '');
                    var accountRegex = new RegExp('^(' + unformattedTerm + ')', 'i');
                    bbanMatch = (account.bban + '').match(accountRegex);
                }
                if((term.length < 2 && self.options.showAll) || nameMatch || bbanMatch) {
                    suggestions.push({
                        terms: [ term ],
                        type: self.type || types.ACCOUNT,
                        matchType: bbanMatch ? 'number' : 'name',
                        account: account,
                        search: {
                            account: account.id
                        }
                    });
                }
            });

            return suggestions;
        };

        // CONTACT
        builtIn.getContactSuggestions = function(term) {

            var self = this;
            var suggestions = [];

            if(term.length < 2 && !this.options.showAll) {
                return suggestions;
            }

            var contacts = this.data || [];
            contacts.forEach(function(contact) {
                var nameRegex = new RegExp('(' + term + ')', 'ig');
                var nameMatch = lpCoreUtils.isString(contact.name) && contact.name.match(nameRegex);
                var accountMatch = false;
                if(!nameMatch) {
                    var unformattedTerm = term.replace(STRIP_ACC_FORMATTING_REGEX, '');
                    var accountRegex = new RegExp('^(' + unformattedTerm + ')', 'i');
                    accountMatch = contact.account && (contact.account + '').match(accountRegex);
                }
                if((term.length < 2 && self.options.showAll) || nameMatch || accountMatch) {
                    suggestions.push({
                        terms: [ term ],
                        type: self.type || types.CONTACT,
                        matchType: accountMatch ? 'account' : 'name',
                        contact: contact,
                        search: {
                            contact: contact.account
                        }
                    });
                }
            });

            return suggestions;
        };

        // CATEGORY
        builtIn.getCategorySuggestions = function(rawTerm) {
            var self = this;

            var suggestions = [];
            var categories = self.data || [];
            var terms = rawTerm.split(',');
            var minTermLength = 2;

            var matches = [];
            var ids = [];

            var matchCategory = function(aTerms, categoryName) {
                var matched = false;

                aTerms.forEach(function(term) {
                    if(term.length >= minTermLength && categoryName.toLowerCase().indexOf(term.toLowerCase()) === 0) {
                        matched = true;
                    }
                });

                return matched;
            };

            categories.forEach(function(category) {
                if(matchCategory(terms, category.name)) {
                    matches.push(category);
                    ids.push(category.id);
                }
            });

            if(ids.length >= 1) {
                suggestions.push({
                    terms: [terms],
                    type: self.type || types.CATEGORY,
                    category: matches, // matched categories
                    search: {
                        category: ids.join(',') // category ids
                    }
                });
            }


            return suggestions;
        };

        // GENERAL
        builtIn.getGeneralSuggestions = function(term1, term2) {

            var suggestions = [];

            var term = term2 ? term1 + ' to ' + term2 : term1;

            if(term.length >= 2) {
                if(!SmartSuggestEngineUtil.isRange(term)) {
                    suggestions.push({
                        terms: [ term ],
                        type: this.type || types.GENERAL,
                        search: {
                            query: term
                        }
                    });
                }
            }

            return suggestions;
        };

        return builtIn;
    };

    module.exports.factory('SmartSuggestEngineBuiltInSuggesters', builtInFactory);

});
