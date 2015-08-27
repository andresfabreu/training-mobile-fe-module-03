define( function (require, exports, module) {
	'use strict';

	module.name = 'module-estatements';

	var base = require('base');
	var core = require('core');

	var deps = [
		core.name
	];

    var estatementUtils = require('./utils');

	module.exports = base.createModule(module.name, deps)
		.filter( estatementUtils.filters )
		.constant( 'lpEstatementsUtils', estatementUtils.utils )
		.provider( require('./estatements') );
});
