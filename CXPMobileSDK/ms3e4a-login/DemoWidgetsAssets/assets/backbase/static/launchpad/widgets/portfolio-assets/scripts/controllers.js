define(function (require, exports, module) {
    'use strict';

    var ASSET_TYPES = [
        {key: 'equities', value: 'Equities'},
        {key: 'other', value: 'Other Investments'},
        {key: 'bonds', value: 'Bonds'},
        {key: 'cash', value: 'Cash'}
    ];

    // @ngInject
    exports.MainCtrl = function (assetModel, lpCoreBus) {
        var ctrl = this;

        ctrl.config = {
            types: ASSET_TYPES
        };

        function renderComponent(data) {
            ctrl.loading = false;
            ctrl.data = data;
        }

        lpCoreBus.subscribe('launchpad-retail.portfolioSelected', function (ptf) {
            ctrl.loading = true;
            assetModel.getData(ptf.id).then(renderComponent);
        });
    };
});
