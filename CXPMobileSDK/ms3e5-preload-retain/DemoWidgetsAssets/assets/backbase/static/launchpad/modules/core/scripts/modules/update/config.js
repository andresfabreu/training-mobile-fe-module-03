define(function (require, exports, module) {
    'use strict';

    module.exports = {
        'actions': {
            'newPaymentOrderInitiated': ['reviewTransfer']
        },

        'deps': {
            'transactions': ['accounts']
        }
    };

});
