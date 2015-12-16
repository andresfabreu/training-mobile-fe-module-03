/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : core.spec.js
 *  Description: Unit test for Scheduled Date Calculator factory
 *  ----------------------------------------------------------------
 */

'use strict';

var ScheduledDateCalculator = require('../../scheduled-date-calculator');

/*----------------------------------------------------------------*/
/* Scheduled Date Calculator tests
/*----------------------------------------------------------------*/
describe('Scheduled Date Calculator factory', function() {
    var dateCalculator,
        frequenciesEnum = {
            START_OF_THE_MONTH: 'START_OF_THE_MONTH',
            END_OF_THE_MONTH: 'END_OF_THE_MONTH',
            LAST_FRIDAY_OF_THE_MONTH: 'LAST_FRIDAY_OF_THE_MONTH',
            WEEKLY: 'WEEKLY',
            MONTHLY: 'MONTHLY',
            YEARLY: 'YEARLY'
        },
        functionsList = [
            'addWeeksToDate',
            'addMonthsToDate',
            'addYearsToDate',
            'getLastDayOfMonth',
            'getFirstDayOfMonth',
            'getLastFridayOfMonth',
            'getLastDayOfMonthPlusTime',
            'getLastFridayOfMonthPlusTime',
            'calculateMinimumEndDate'
        ],
        functionsListString = '\n\t - ' + functionsList.join(',\n\t - ');

    beforeEach(function() {
        // scope = element.children().isolateScope();
        dateCalculator = new ScheduledDateCalculator({frequencies: frequenciesEnum});
    });

    it('should have following functions defined:' + functionsListString, function() {
        for (var i = 0; i < functionsList.length; i++) {
            var functionName = functionsList[i];
            expect(dateCalculator[functionName]).toBeDefined();
            expect(typeof dateCalculator[functionName] === 'function').toBe(true);
        }
    });

    it('addWeeksToDate function should return correct date', function() {
        var date = new Date(1982, 4, 3).getTime();
        // add 2 weeks to the date
        expect(dateCalculator.addWeeksToDate(date, 2)).toEqual(new Date(1982, 4, 17));
        // add 5 weeks to the date
        expect(dateCalculator.addWeeksToDate(date, 5)).toEqual(new Date(1982, 5, 7));
    });

    it('addMonthsToDate function should return correct date', function() {
        var date = new Date(2015, 3, 1).getTime();
        // add 2 months to the date
        expect(dateCalculator.addMonthsToDate(date, 2)).toEqual(new Date(2015, 5, 1));
        // add 10 months to the date
        expect(dateCalculator.addMonthsToDate(date, 10)).toEqual(new Date(2016, 1, 1));
    });

    it('addYearsToDate function should return correct date', function() {
        var date = new Date(2015, 3, 1).getTime();
        // don't add anything
        expect(dateCalculator.addYearsToDate(date, 0)).toEqual(new Date(2015, 3, 1));
        // add 3 years to the date
        expect(dateCalculator.addYearsToDate(date, 3)).toEqual(new Date(2018, 3, 1));
    });

    it('getLastDayOfMonthPlusTime function should return correct date', function() {
        var date = new Date(2015, 3, 1).getTime();
        // add 3 months
        expect(dateCalculator.getLastDayOfMonthPlusTime(date, 3)).toEqual(new Date(2015, 5, 30, 23, 59, 59, 999));
        // add 11 months
        expect(dateCalculator.getLastDayOfMonthPlusTime(date, 11)).toEqual(new Date(2016, 1, 29, 23, 59, 59, 999));
    });

    it('getFirstDayOfMonthPlusTime function should return correct date', function() {
        var date = new Date(2015, 3, 1).getTime();
        // add 5 months
        expect(dateCalculator.getFirstDayOfMonthPlusTime(date, 5)).toEqual(new Date(2015, 8, 1));
        // add 11 months
        expect(dateCalculator.getFirstDayOfMonthPlusTime(date, 11)).toEqual(new Date(2016, 2, 1));
    });

    it('getLastFridayOfMonthPlusTime function should return correct date', function() {
        var date = new Date(2015, 3, 1).getTime();
        // return last friday for current month
        expect(dateCalculator.getLastFridayOfMonthPlusTime(date, 1)).toEqual(new Date(2015, 3, 24, 23, 59, 59, 999));
        // add 5 months
        expect(dateCalculator.getLastFridayOfMonthPlusTime(date, 5)).toEqual(new Date(2015, 7, 28, 23, 59, 59, 999));
    });

    it('calculateMinimumEndDate function should return correct date', function() {
        var date = new Date(2015, 4, 3).getTime();

        expect(dateCalculator.calculateMinimumEndDate(frequenciesEnum.WEEKLY, 5, date)).toEqual(new Date(2015, 5, 7));
        expect(dateCalculator.calculateMinimumEndDate(frequenciesEnum.MONTHLY, 12, date)).toEqual(new Date(2016, 4, 3));
        expect(dateCalculator.calculateMinimumEndDate(frequenciesEnum.YEARLY, 10, date)).toEqual(new Date(2025, 4, 3));
    });
});
