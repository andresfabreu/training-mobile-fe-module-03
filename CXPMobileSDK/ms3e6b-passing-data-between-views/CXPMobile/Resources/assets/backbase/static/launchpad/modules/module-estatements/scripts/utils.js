define( function (require, exports, module) {
	'use strict';

	var _ = require('base').utils;

	var filters = {};
	var utils = {};

	utils.estatementLink = function(document, linkType) {
        var linkHref = null;
        _.forEach(document.links, function(link) {
            if (link.type === linkType) {
                linkHref = link.href;
            }
        });

        return linkHref;
	};

	// Create ng filter from this function.
	filters.lpEstatementLink = function(){
		return utils.estatementLink;
	};

	exports.utils = utils;
	exports.filters = filters;
});
