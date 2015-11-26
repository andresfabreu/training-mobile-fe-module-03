/*global define */
define(function(require, exports, module) {
    'use strict';

    var base = require('base');
    var core = require('core');
    var util = require('./partials/util');
    var builtIn = require('./suggesters/built-in');
    var config = require('./types/config');

    var regex = require('./partials/regex');

    module.name = 'ui.smartsuggest-engine'; // launchpad/lib/ui/smartsuggest-engine

    module.exports = base.createModule(module.name, [
        core.name,
        util.name,
        config.name,
        builtIn.name
    ]);

    var RANGE_REGEX = regex['RANGE_REGEX'];
    // var NUMBER_REGEX = regex['NUMBER_REGEX'];
    // var STRIP_ACC_FORMATTING_REGEX = regex['STRIP_ACC_FORMATTING_REGEX'];

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // The SmartSearch class
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // @ngInject
    var SmartSuggestFactory = function(lpCoreUtils, SmartSuggestConfig, SmartSuggestEngineUtil, SmartSuggestEngineBuiltInSuggesters) {

        var SmartSuggest = function(options) {
            this.options = options || {};
            this.suggesters = [];
        };

        ////////////////////////////////////////////////////////////////
        // Mixin additional Config functionality to Engine's prototype
        ////////////////////////////////////////////////////////////////
        lpCoreUtils.mixin(SmartSuggest, SmartSuggestConfig);

        //////////////////////////////////////////////
        // Built in suggestion pre-configured types
        //////////////////////////////////////////////
        SmartSuggest.types = SmartSuggestConfig.TYPES;

        ////////////////////////////////////////////////////
        // Built in suggestion pre-configured type labels
        ////////////////////////////////////////////////////
        SmartSuggest.labels = SmartSuggestConfig.LABELS;

        /////////////////////////////////////////////////////////
        // Built in suggestion pre-configured type icon classes
        /////////////////////////////////////////////////////////
        SmartSuggest.icons = SmartSuggestConfig.ICONS;

        ////////////////////////////////////////
        // Utilities
        ////////////////////////////////////////
        SmartSuggest.util = SmartSuggestEngineUtil;

        ////////////////////////////////////////
        // Built-In Suggesters
        ////////////////////////////////////////
        SmartSuggest.builtIn = SmartSuggestEngineBuiltInSuggesters;

        /**
         * Returns a list of suggestions for a search
         * @param term
         * @returns {Array}
         */
        SmartSuggest.prototype.getSuggestions = function(term) {

            var self = this;

            //escape html
            term = lpCoreUtils.stripHtml(term);

            //single value or 'value to value' range
            var terms = [];
            if(SmartSuggest.util.isRange(term)) {
                terms = term.match(RANGE_REGEX);
            } else {
                terms[1] = term;
            }

            //iterate through suggesters accumulating suggestion results
            var suggestions = [];
            this.suggesters.forEach(function(suggester) {
                var newSuggestions = suggester.suggest.call({
                    data: suggester.data || null,
                    type: suggester.type,
                    options: suggester.options || {}
                }, terms[1], terms[2]);
                if (self.options.showTitles && newSuggestions.length > 0) {
                    suggestions = suggestions.concat({
                        type: SmartSuggest.types.TITLE,
                        title: suggester.type
                    });
                }
                suggestions = suggestions.concat(newSuggestions);
            });

            return suggestions;
        };

        /**
         * Adds a suggester. Can be a built in or custom function
         * @param suggester
         */
        SmartSuggest.prototype.addSuggester = function(suggester) {

            // add suggest function from built-in list (if missing)
            suggester = SmartSuggest.builtIn.addSuggestFunction(suggester);

            //overwrite existing suggesters of the same type
            var replaced = false;
            for(var i = 0; i < this.suggesters.length && !replaced; i++) {
                if(this.suggesters[i].type === suggester.type) {
                    this.suggesters[i] = suggester;
                    replaced = true;
                }
            }
            if(!replaced) {
                this.suggesters.push(suggester);
            }

            return this;
        };

        /**
         * Remove all currently registered suggester functions
         */
        SmartSuggest.prototype.clearSuggesters = function() {
            this.suggesters = [];
        };

        return SmartSuggest;
    };

    module.exports.factory('SmartSuggestEngine', SmartSuggestFactory);

});
