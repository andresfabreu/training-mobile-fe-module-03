define( function (require, exports, module) {
	'use strict';

	module.name = 'ui.input';

	var base = require('base');
	var core = require('core');

	var deps = [
		core.name
	];

	return base.createModule(module.name, deps)
		.directive(require('./directives'));
});
