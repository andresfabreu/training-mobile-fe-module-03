define(function(require, exports, module) {
    'use strict';

    module.name = 'ui.smartsuggest';

    var base = require('base');
    var core = require('core');

    // Plugin needed for autosuggest
    require('./libs/jquery.autosuggest');

    var smartsuggestEngine = require('./smartsuggest-engine');
    var smartsuggestFormatter = require('./smartsuggest-formatter');

    module.exports = base
        .createModule(module.name, [
            core.name,
            smartsuggestEngine.name,
            smartsuggestFormatter.name
        ]);
});
