define(function (require, exports, module) {
    'use strict';

    var YEAR = 365.2425 * 864e5; // average year in the Gregorian calendar
    var SPANS = [
        {name: '10 years', value: 10 * YEAR},
        {name: '5 years', value: 5 * YEAR},
        {name: '3 years', value: 3 * YEAR},
        {name: '1 year', value: YEAR},
        {name: '9 months', value: YEAR * .75},
        {name: '6 months', value: YEAR / 2},
        {name: '3 months', value: YEAR / 4},
        {name: '1 month', value: YEAR / 12}
    ];
    var FREQS = {
        'monthly': 'Monthly',
        'yearly': 'Yearly'
    };

    /*----------------------------------------------------------------*/
    /* Main Controller
    /*----------------------------------------------------------------*/

    // @ngInject
    exports.MainCtrl = function(ptfModel, lpCoreBus, lpWealth) {
        var ctrl = this;

        var config = ctrl.config = {
            timespan: lpWealth.getConfig('timespan'),
            frequency: lpWealth.getConfig('frequency')
        };

        function updateSpans(data) {
            var frame = data[config.frequency],
                dl = frame[frame.length - 1].date - frame[0].date;

            ctrl.spans = SPANS.filter(function (d) {
                return d.value < dl;
            });

            return data;
        }

        function renderComponent(data) {
            ctrl.loading = false;
            ctrl.data = data;
        }

        ctrl.freqs = FREQS;
        ctrl.spans = SPANS;

        ctrl.setFreq = function (id) {
            config.frequency = id;
            lpCoreBus.publish('portfolio-frequency', id);
        };

        ctrl.setSpan = function (id) {
            config.timespan = id;
        };

        lpCoreBus.subscribe('launchpad-retail.portfolioSelected', function (ptf) {
            ctrl.loading = true;
            ptfModel.getData(ptf.id)
                .then(updateSpans)
                .then(renderComponent);
        });
    };

});
