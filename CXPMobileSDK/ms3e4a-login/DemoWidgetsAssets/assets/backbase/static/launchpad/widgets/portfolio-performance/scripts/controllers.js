define(function (require, exports, module) {
    'use strict';

    /*----------------------------------------------------------------*/
    /* Main Controller
    /*----------------------------------------------------------------*/

    // @ngInject
    exports.MainCtrl = function (ptfModel, $timeout, lpCoreBus, lpWealth) {
        var ctrl = this;

        var config = ctrl.config = {
            frequency: lpWealth.getConfig('frequency'),
            mode: true
        };

        function renderComponent(data) {
            ctrl.loading = false;
            ctrl.data = data;
        }

        function updateTitle() {
            ctrl.title = ctrl.modeAvail && config.mode ? 'Performance' : 'Valuation';
        }

        ctrl.modeAvail = ctrl.modeAvail || false;

        ctrl.toggleMode = function () {
            config.mode = !config.mode;
            updateTitle();
        };

        ctrl.onSwitch = function (modeIsAvailable) {
            $timeout(function () {
                ctrl.modeAvail = modeIsAvailable;
                updateTitle();
            });
        };

        lpCoreBus.subscribe('launchpad-retail.portfolioSelected', function (ptf) {
            ctrl.loading = true;
            ptfModel.getData(ptf.id).then(renderComponent);
        });

        lpCoreBus.subscribe('portfolio-frequency', function (freq) {
            $timeout(function () {
                config.frequency = freq;
            });
        });
    };

});

