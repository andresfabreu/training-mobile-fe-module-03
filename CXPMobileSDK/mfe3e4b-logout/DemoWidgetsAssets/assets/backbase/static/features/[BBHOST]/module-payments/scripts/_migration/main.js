define( function (require, exports, module) {
	'use strict';

	module.name = 'module-payments-migration';

	var base = require('base');

	var deps = [];

	module.exports = base.createModule(module.name, deps)
		.directive( require('./address-transfer'))
		.directive( require('./counter-party-filter'))
		.directive( require('./dynamic-aria-label'))
		.directive( require('./dynamic-focus'))
		.directive( require('./email-transfer'))
		.filter( require('./filters'))
		.factory( require('./iban-model'))
		.directive( require('./lp-currency-amount-input'))
		.directive( require('./lp-format-payment-reference'))
		.directive( require('./lp-format-us-account'))
		.directive( require('./lp-iban-input'))
		.directive( require('./lp-input-currency'))
		.directive( require('./lp-payment-ref-description'))
		.directive( require('./non-zero'))
		.directive( require('./p2p-enrollment'))
		.directive( require('./us-account-input'));
});