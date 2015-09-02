/**
 * @deprecated will be removed in LP v0.13.x
 * Please use Scheduled Transfer component and
 * factories/scheduled-date-calculator instead
 */
define( function (require, exports, module) {
	'use strict';

	module.name = 'module-payments-deprecated';

	var base = require('base');

	var deps = [];

	module.exports = base.createModule(module.name, deps)
		.factory( require('./scheduled-date-calculator'))
		.directive( require('./scheduled-transfer'));
});
