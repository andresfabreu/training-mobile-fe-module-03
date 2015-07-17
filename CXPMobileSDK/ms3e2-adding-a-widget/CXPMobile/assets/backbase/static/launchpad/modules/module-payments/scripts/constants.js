define( function (require, exports, module) {
	'use strict';

	exports.transferTypes = {
        bank: 'INTERNAL',
        p2pEmail: 'P2P_EMAIL',
        p2pAddress: 'P2P_ADDRESS',
        p2pMobile: 'P2P_MOBILE'
	};

	exports.pendingPaymentOrdersTimeout = 10 * 1000;
	exports.customerId = '3';
	exports.currencyMaxLength = 15;
});
