define(function(require, exports, module) {
	'use strict';

	module.name = 'module-accounts';

	var base = require('base');
	var core = require('core');
	var ui = require('ui');

	var accountSelect = require('./components/accounts-select/scripts/main');
	var payeeAccountSelect = require('./components/payee-account-select/scripts/main');

	var deps = [
		core.name,
		ui.name,
		accountSelect.name,
		payeeAccountSelect.name
	];

	module.exports = base.createModule(module.name, deps)
		.value('groupsTimeout', 600 * 1000)
		.value('accountsTimeout', 10 * 1000)
		.provider( require('./accounts') )
		// TODO: move to server
		.value('customerId', '3')
		.factory( require('./_migration/accounts-chart-model') )
		.factory( require('./_migration/assets-model') )
		.factory( require('./_migration/cards-model') )
		.factory( require('./_migration/financial-institute-model') )
		.directive( require('./_migration/dynamic-credential-input') )
		.directive( require('./_migration/format-amount') );
});
