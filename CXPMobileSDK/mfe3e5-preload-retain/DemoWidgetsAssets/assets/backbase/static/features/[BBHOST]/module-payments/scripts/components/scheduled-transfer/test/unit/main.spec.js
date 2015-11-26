/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : core.spec.js
 *  Description: Scheduled Transfer component unit test
 *  ----------------------------------------------------------------
 */

'use strict';

var lpScheduledTransfer = require('../../scripts/main');
var ngModule = window.module;
var ngInject = window.inject;

var getDirective = function(modelParam, isScheduledTransferParam) {
    var model = modelParam || 'scheduledTransfer';
    var isScheduledTransfer = isScheduledTransferParam || false;
    return [
        '<form>" ',
            '<div lp-scheduled-transfer="lp-scheduled-transfer"',
                'ng-model="' + model + '" ',
                'lp-is-scheduled-transfer="' + isScheduledTransfer + '">',
            '</div>',
        '</form>'
    ].join('');
};
/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/
describe('Scheduled Transfer component', function() {

    var $compile, $rootScope, element, scope;

    beforeEach(ngModule(lpScheduledTransfer.name));

    beforeEach(ngInject(function(_$compile_, _$rootScope_, _$document_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        $rootScope.scheduledTransfer = {
            frequency: 'START_OF_THE_MONTH',
            every: 1,
            intervals: 'RECURRING',
            startDate: new Date(),
            endDate: new Date(),
            timesToRepeat: 1
        };

        scope = $rootScope.$new();
        element = $compile(getDirective())(scope);
        scope.$digest();
    }));

    it('should be an object', function() {
        expect(lpScheduledTransfer).toBeObject();
    });

    it('should create isolated scope', function() {
        scope = element.children().isolateScope();
        expect(scope).not.toBeUndefined();
        expect(scope).toBeObject();
    });

    it('should be able to configure isScheduledTransfer property', function() {
        element = $compile(getDirective(null, true))(scope);
        scope.$digest();
        scope = element.children().isolateScope();
        expect(scope.isScheduledTransfer).toBe(true);

        element = $compile(getDirective(null, false))(scope);
        scope.$digest();
        scope = element.children().isolateScope();
        expect(scope.isScheduledTransfer).toBe(false);
    });

    it('should have frequencies list defined', function() {
        scope = element.children().isolateScope();
        expect(scope.frequenciesEnum).not.toBeUndefined();
        expect(scope.frequenciesEnum).toBeObject();
    });

    it('should have dates array defined', function() {
        scope = element.children().isolateScope();
        expect(scope.dates).not.toBeUndefined();
        expect(Array.isArray(scope.dates)).toBe(true);
        expect(scope.dates.length).toBeGreaterThan(0);
    });

    it('start date input should be initialized with today\'s date', function() {
        var inputDate,
            today = new Date();

        element = $compile(getDirective(null, true))(scope);
        scope.$digest();

        inputDate = new Date(element[0].querySelector('.lp-st-start-date input').value);
        expect(inputDate.getFullYear()).toBe(today.getFullYear());
        expect(inputDate.getMonth()).toBe(today.getMonth());
        expect(inputDate.getDay()).toBe(today.getDay());
    });
});
