define( function (require, exports, module) {
	'use strict';

	module.name = 'module-payments';

	var base = require('base');

	var deps = [
		require('core').name,
		require('./components/scheduled-transfer/scripts/main').name,
		require('./_deprecated/scripts/main').name,
		require('./_migration/main').name
	];

	module.exports = base.createModule(module.name, deps)
		.constant( require('./constants') )
		.provider( require('./payments') )
		.provider( require('./providers') )
		.service( require('./services/payment-orders') );
});
