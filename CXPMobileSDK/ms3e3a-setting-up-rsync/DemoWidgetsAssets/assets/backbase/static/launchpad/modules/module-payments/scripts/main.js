define( function (require, exports, module) {
	'use strict';

	module.name = 'module-payments';

	var base = require('base');
	var core = require('core');

	var deps = [
		core.name
	];

	module.exports = base.createModule(module.name, deps)
		.constant( require('./constants') )
		.provider( require('./payments') )
		.directive( require('./_migration/address-transfer'))
		.directive( require('./_migration/counter-party-filter'))
		.directive( require('./_migration/dynamic-aria-label'))
		.directive( require('./_migration/dynamic-focus'))
		.directive( require('./_migration/email-transfer'))
		.filter( require('./_migration/filters'))
		.factory( require('./_migration/iban-model'))
		.directive( require('./_migration/lp-currency-amount-input'))
		.directive( require('./_migration/lp-format-payment-reference'))
		.directive( require('./_migration/lp-format-us-account'))
		.directive( require('./_migration/lp-iban-input'))
		.directive( require('./_migration/lp-input-currency'))
		.directive( require('./_migration/lp-payment-ref-description'))
		.directive( require('./_migration/non-zero'))
		.directive( require('./_migration/p2p-enrollment'))
		.factory( require('./_migration/scheduled-date-calculator'))
		.directive( require('./_migration/scheduled-transfer'))
		.directive( require('./_migration/us-account-input'));
});
