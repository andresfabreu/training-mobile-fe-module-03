define(function(require, exports, module) {
    'use strict';

    /**
     * Services
     * @param  {DI services}
     * @return {object}
     * @ngInject
     */
    function Services(PaymentOrders) {

        // registered services
        var services = {
            'payment-orders': PaymentOrders
        };

        return {
            api: function(name) {
                if (typeof services[name] === 'undefined') {
                    throw new Error('Unknown service ' + name + ' !!!');
                }
                return services[name];
            }
        };
    }

    /**
     * lpAccountTransfers provider
     * @return {object} angular provider
     * @ngInject
     */
    exports.lpAccountTransfers = function() {
        this.$get = Services;
    };
});
