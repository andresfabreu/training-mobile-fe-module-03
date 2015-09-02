define(function(require, exports, module) {
	'use strict';

	module.name = 'ui.field';

	var base = require('base');
	var core = require('core');
	var utils = base.utils;
	// var responsive = require('../../responsive/scripts/main');

	module.exports = base.createModule(module.name, [
		core.name
		// responsive.name
	])
	.directive(require('./directives'))
	.controller(require('./controllers'))
	.value('defaultErrorMessages', {
		'required': 'This field is required.'
	})
	.filter('newlines', function () {
		return function(text) {
			if (utils.isString(text)) {
				return text.replace(/\n/g, '<br/>');
			}
			return text;
		};
	});
});
