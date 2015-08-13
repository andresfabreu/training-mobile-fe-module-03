define( function (require, exports, module) {
	'use strict';

	module.name = 'ui.timer';

	var base = require('base');

	return base.createModule(module.name, [])
		.directive(require('./directives'));
});
