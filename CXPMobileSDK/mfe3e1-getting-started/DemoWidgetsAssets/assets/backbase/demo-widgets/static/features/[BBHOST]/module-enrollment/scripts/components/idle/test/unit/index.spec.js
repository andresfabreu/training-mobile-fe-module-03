/*eslint-disable no-undef, new-cap, no-unused-vars */
'use strict';

var main = require('../../scripts/main');

require('angular-mocks');

var ngInject = window.inject;

/*----------------------------------------------------------------*/
/* Module testing
 /*----------------------------------------------------------------*/
describe('Idle Provider', function() {
    var idle;

    beforeEach(window.module(main.name));

    beforeEach(ngInject(function(_lpIdleTracker_) {
        idle = _lpIdleTracker_({
            events: ['someSpecialEvent']
        });
    }));

    it('Idle should be an object', function() {
        expect(idle).toBeObject();
    });

    it('Idle should have init function', function() {
        expect(idle.init).toBeFunction();
    });

    it('Idle should have reset function', function() {
        expect(idle.reset).toBeFunction();
    });

    it('Idle element should be document by default', function() {
        expect(idle.element === document).toBe(true);
    });

    it('Idle delay should be 60000 ms by default', function() {
        expect(idle.interval === 60000).toBe(true);
    });

    it('Idle events list should extend events list', function() {
        expect(idle.events.indexOf('someSpecialEvent') !== -1).toBe(true);
    });
});
