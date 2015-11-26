
'use strict';

require('angular-mocks');

var component = require('../scripts/main');

describe('ui.aria testing suite:', function() {

    var $rootScope, $injector, $compile, $element;

    beforeEach(window.module(component.name));

    beforeEach(window.inject(function(_$rootScope_, _$injector_) {
        $rootScope = _$rootScope_;
        $injector = _$injector_;
        $compile = $injector.get('$compile');

        $rootScope.paymentOrder = {accountDetails: 1234};
        $element = $compile('<small class="text-muted" lp-aria-number="paymentOrder.accountDetails"></small>')($rootScope);
        $rootScope.$digest();
    }));

    it('should export an object', function() {
        expect(component).toBeObject();
    });

    it('should add aria-hidden attribute to element', function() {
        expect($element.find('span').attr('aria-hidden')).toBe('true');
    });

    it('should insert new hidden span after element', function() {

        // Test class name
        expect($element.find('span').next().hasClass('sr-only')).toBe(true);

        // Test span value
        var $filter = $injector.get('$filter'),
            lpAriaNumber = $filter('lpAriaNumber'),
            expected = lpAriaNumber($rootScope.paymentOrder.accountDetails);

        expect($element.find('span').next().text().trim()).toBe(expected);
    });

});
