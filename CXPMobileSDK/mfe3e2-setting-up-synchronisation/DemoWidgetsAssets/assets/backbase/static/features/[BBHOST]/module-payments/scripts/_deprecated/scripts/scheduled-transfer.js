/* eslint-disable */

/**
 * @deprecated will be removed in LP v0.13.x
 * Please use Scheduled Transfer component instead.
 */
define(function(require, exports, module) {
    'use strict';

    /**
     * TODO: Refactor this directive to not require a widget instance.
     */

    // @ngInject
    exports.scheduledTransfer = function(ScheduledDateCalculator) {
        var template='';
        template += '<div class="lp-scheduled-transfer">';
        template += '    <div class="lp-st-frequency lp-st-section clearfix">';
        template += '        <div class="pull-left lp-st-caption">Frequency</div>';
        template += '        <div class="pull-left lp-st-control">';
        template += '            <div class="lp-st-frequency-dropdown" aria-label="frequency" dropdown-select="dropdown-select" ng-change="frequencyChanged()" ng-model="paymentOrder.scheduledTransfer.frequency" ng-options="val.id as val.value group by val.group for val in frequencies"></div>';
        template += '        </div>';
        template += '    </div>';
        template += '    <div class="lp-st-every lp-st-section clearfix">';
        template += '        <div class="pull-left lp-st-caption" ng-if="customOrder">Every</div>';
        template += '        <div class="pull-left lp-st-control clearfix" ng-if="paymentOrder.scheduledTransfer.frequency === frequenciesEnum.WEEKLY">';
        template += '            <input type="number" lp-number-input="lp-number-input" lp-max-length="1" min="1" step="0" non-zero="non-zero" class="lp-st-every-input pull-left" name="repeatEvery" required="required" tabindex="0" aria-required="true" aria-label="Repeat weekly transfer every" maxlength="2" ng-model="paymentOrder.scheduledTransfer.every" ng-change="setEndDate()" \/><span>week(s) on:</span>';
        template += '        </div>';
        template += '        <div class="pull-left lp-st-control clearfix" ng-if="paymentOrder.scheduledTransfer.frequency === frequenciesEnum.MONTHLY">';
        template += '            <input type="number" lp-number-input="lp-number-input" lp-max-length="1" min="1" step="0" non-zero="non-zero" class="lp-st-every-input pull-left" name="repeatEvery" required="required" tabindex="0" aria-required="true" aria-label="Repeat monthly transfer every" maxlength="2" ng-model="paymentOrder.scheduledTransfer.every" ng-change="setEndDate()" \/><span>month(s) on:</span>';
        template += '        </div>';
        template += '        <div class="pull-left lp-st-control clearfix" ng-if="paymentOrder.scheduledTransfer.frequency === frequenciesEnum.YEARLY">';
        template += '            <input type="number" lp-number-input="lp-number-input" lp-max-length="1" min="1" step="0" non-zero="non-zero" class="lp-st-every-input pull-left" name="repeatEvery" required="required" tabindex="0" aria-required="true"  aria-label="Repeat yearly transfer every" maxlength="2" ng-model="paymentOrder.scheduledTransfer.every" ng-change="setEndDate()" \/><span>year(s):</span>';
        template += '        </div>';
        template += '    </div>';
        template += '    <div class="lp-st-interval lp-st-section clearfix" ng-if="customOrder">';
        template += '        <div class="lp-st-interval-menu weekly btn-group" ng-if="paymentOrder.scheduledTransfer.frequency === frequenciesEnum.WEEKLY">';
        template += '            <button type="button" interval-button="interval-button" aria-label="{{day.label}}" ng-class="{\'active\': day.active}" class="btn btn-default" tabindex="0"  ng-click="toggleInterval($index)" ng-repeat="day in days" ng-model="day">{{day.value}}</button>';
        template += '        </div>';
        template += '        <div class="lp-st-interval-menu monthly btn-group" ng-if="paymentOrder.scheduledTransfer.frequency === frequenciesEnum.MONTHLY">';
        template += '            <button type="button" interval-button="interval-button" aria-label="{{date.label}}" ng-class="{\'active\': date.active}" class="btn btn-default" tabindex="0"  ng-click="toggleInterval($index)" ng-repeat="date in dates" ng-model="date">{{date.value}}</button>';
        template += '        </div>';
        template += '        <div class="lp-st-interval-menu yearly btn-group" ng-if="paymentOrder.scheduledTransfer.frequency === frequenciesEnum.YEARLY">';
        template += '            <button type="button" interval-button="interval-button" aria-label="{{month.label}}" ng-class="{\'active\': month.active}" class="btn btn-default" tabindex="0" ng-click="toggleInterval($index)" ng-repeat="month in months" ng-model="month">{{month.value}}</button>';
        template += '        </div>';
        template += '    </div>';
        template += '    <div class="lp-st-start-date lp-st-section clearfix">';
        template += '        <div class="pull-left lp-st-caption">Start</div>';
        template += '        <div class="pull-left lp-st-control calendar">';
        template += '            <input ng-click="openStartCalendar($event)" aria-label="start date" type="text" ng-required="paymentOrder.isScheduledTransfer === true" name="startDate" ng-model="paymentOrder.scheduledTransfer.startDate" datepicker-popup="d-MMM-yyyy" readonly="readonly" is-open="calendar.startCalendarOpen" datepicker-options="startDateOptions" min-date="todaysDate" class="form-control" lp-future-time="" show-button-bar="false" tabindex="0" ng-change="setEndDate()" ng-keypress="openStartCalendar($event)" \/>';
        template += '            <span ng-click="openStartCalendar($event)" class="lp-icon lp-icon-calendar calendar-icon"></span>';
        template += '        </div>';
        template += '    </div>';
        template += '    <div class="lp-st-end-on lp-st-section clearfix">';
        template += '        <div class="pull-left lp-st-caption">End</div>';
        template += '        <div class="pull-left lp-st-control">';
        template += '            <div class="lp-st-end-on-dropdown" aria-label="end on" dropdown-select="dropdown-select" ng-change="endOnChanged()" ng-model="paymentOrder.scheduledTransfer.endOn" ng-options="val.id as val.value for val in endOptions"></div>';
        template += '        </div>';
        template += '    </div>';
        template += '    <div class="lp-st-end-after lp-st-section clearfix" ng-if="paymentOrder.scheduledTransfer.endOn === \'after\'">';
        template += '        <div class="pull-left lp-st-caption">Repeat</div>';
        template += '        <div class="pull-left lp-st-control">';
        template += '            <input type="number" lp-number-input="lp-number-input" lp-max-length="2" min="1" step="0" non-zero="non-zero" class="form-control" aria-label="times to repeat" name="timesToRepeat" aria-required="true" required="required" tabindex="0" ng-model="paymentOrder.scheduledTransfer.timesToRepeat" ng-change="setEndDate()"  \/>';
        template += '        </div>';
        template += '';
        template += '    </div>';
        template += '    <p class="text-muted" ng-if="paymentOrder.scheduledTransfer.endOn === \'after\' && timesEndDate.length > 0" style="margin-left: 5px;">Completion date: {{timesEndDate}}</p>';
        template += '    <div class="lp-st-end-date lp-st-section clearfix" ng-if="paymentOrder.scheduledTransfer.endOn === \'onDate\'">';
        template += '        <div class="pull-left lp-st-caption">End date</div>';
        template += '        <div class="pull-left lp-st-control calendar">';
        template += '            <input ng-click="openEndCalendar($event)" aria-label="end date" type="text" ng-required="paymentOrder.isScheduledTransfer === true" name="endDate" ng-model="paymentOrder.scheduledTransfer.endDate" readonly="readonly" datepicker-popup="d-MMM-yyyy" is-open="calendar.endCalendarOpen" datepicker-options="endDateOptions" min-date="minEndDate" class="form-control" lp-future-time="" show-button-bar="false" tabindex="0" ng-keypress="openEndCalendar($event)" \/>';
        template += '            <span ng-click="openEndCalendar($event)" class="lp-icon lp-icon-calendar calendar-icon"></span>';
        template += '        </div>';
        template += '    </div>';
        template += '    <p ng-if="dateWarning">Transfer will be put through on the last day of the month if the month is not long enough</p>';
        template += '</div>';
        template += '';

        return {
            restrict : "AE",
            replace: true,
            require: ["ngModel", "^form"],
            template: template,
            link: function (scope, element, attrs, ctrls) {

                var dateCalculator;

                var initialize = function() {

                    scope.todaysDate = new Date();
                    scope.minEndDate = new Date();

                    scope.frequenciesEnum = {
                        START_OF_THE_MONTH: "START_OF_THE_MONTH",
                        END_OF_THE_MONTH: "END_OF_THE_MONTH",
                        LAST_FRIDAY_OF_THE_MONTH: "LAST_FRIDAY_OF_THE_MONTH",
                        WEEKLY: "WEEKLY",
                        MONTHLY: "MONTHLY",
                        YEARLY: "YEARLY"
                    };

                    dateCalculator = ScheduledDateCalculator.getInstance({
                        frequencies: scope.frequenciesEnum
                    });

                    //MENU OPTIONS
                    //groups prepended with letter to order list
                    if (!scope.frequencies) {
                        // if endOptions where not passed these are defaults
                        scope.frequencies = [{
                                id: scope.frequenciesEnum.START_OF_THE_MONTH,
                                value: "First of the month",
                                group: "apreset"
                            },{
                                id: scope.frequenciesEnum.END_OF_THE_MONTH,
                                value: "End of the month",
                                group: "apreset"
                            },{
                                id: scope.frequenciesEnum.LAST_FRIDAY_OF_THE_MONTH,
                                value: "Last Friday of the month",
                                group: "apreset"
                            },{
                                id: scope.frequenciesEnum.WEEKLY,
                                value: "Weekly",
                                group: "bcustom"
                            },{
                                id: scope.frequenciesEnum.MONTHLY,
                                value: "Monthly",
                                group: "bcustom"
                            },{
                                id: scope.frequenciesEnum.YEARLY,
                                value: "Yearly",
                                group: "bcustom"
                            }];
                    }
                    //interval days
                    scope.days = [
                        {
                            id: 1,
                            value: "M",
                            label: "Monday",
                            active: false
                        },{
                            id: 2,
                            value: "T",
                            label: "Tuesday",
                            active: false
                        },{
                            id: 3,
                            value: "W",
                            label: "Wednesday",
                            active: false
                        },{
                            id: 4,
                            value: "T",
                            label: "Thursday",
                            active: false
                        },{
                            id: 5,
                            value: "F",
                            label: "Friday",
                            active: false
                        },{
                            id: 6,
                            value: "S",
                            label: "Saturday",
                            active: false
                        },{
                            id: 7,
                            value: "S",
                            label: "Sunday",
                            active: false
                        }];

                    //interval months
                    scope.months = [{
                            id: 1,
                            value: "Jan",
                            label: "January",
                            active: false
                        },{
                            id: 2,
                            value: "Feb",
                            label: "February",
                            active: false
                        },{
                            id: 3,
                            value: "Mar",
                            label: "March",
                            active: false
                        },{
                            id: 4,
                            value: "Apr",
                            label: "April",
                            active: false
                        },{
                            id: 5,
                            value: "May",
                            label: "May",
                            active: false
                        },{
                            id: 6,
                            value: "Jun",
                            label: "June",
                            active: false
                        },{
                            id: 7,
                            value: "Jul",
                            label: "July",
                            active: false
                        },{
                            id: 8,
                            value: "Aug",
                            label: "August",
                            active: false
                        },{
                            id: 9,
                            value: "Sep",
                            label: "September",
                            active: false
                        },{
                            id: 10,
                            value: "Oct",
                            label: "October",
                            active: false
                        },{
                            id: 11,
                            value: "Nov",
                            label: "November",
                            active: false
                        },{
                            id: 12,
                            value: "Dec",
                            label: "December",
                            active: false
                        }];

                    //interval dates
                    scope.dates = [];

                    for(var i = 1; i < 32; i++) {
                        scope.dates.push({
                            id: i,
                            value: i,
                            label: i,
                            active: false
                        });
                    }

                    if (!scope.endOptions) {
                        // if endOptions where not passed these are defaults
                        scope.endOptions = [{
                                id: "after",
                                value: "After"
                            },{
                                id: "onDate",
                                value: "On date"
                            }];
                    }
                    scope.paymentOrder.scheduledTransfer.endOn = scope.endOptions[0].id;

                    scope.customOrder = false;
                    scope.dateWarning = false;

                    //calendar flags
                    scope.calendar = {
                        startCalendarOpen: false,
                        endCalendarOpen: false
                    };

                    scope.endDateOptions = {
                        datepickerMode: 'year',
                        'show-weeks': false
                    };

                    scope.startDateOptions = {
                        'show-weeks': false
                    };

                    scope.timesEndDate = scope.paymentOrder.scheduledTransfer.endDate;

                    scope.setEndDate();
                };



                var modelCtrl = ctrls[0];
                var formCtrl = ctrls[1];

                //add intervals control to form to cater for validation
                modelCtrl.$name = 'scheduledTransfer';
                formCtrl.$addControl(modelCtrl);

                modelCtrl.$formatters.push(function(value) {
                    //remap intervals
                    if(value.intervals.length > 0) {
                        var i, j;

                        //check the frequency
                        if(value.frequency === scope.frequenciesEnum.WEEKLY) {
                            //if correct frequency
                            for(i = 0; i < value.intervals.length; i++) {
                                //remap active intervals
                                for(j = 0; j < scope.days.length; j++) {
                                    if(value.intervals[i] === scope.days[j].id) {
                                        scope.days[j].active = true;
                                        break;
                                    }
                                }
                            }
                        } else if(value.frequency === scope.frequenciesEnum.MONTHLY) {
                            for(i = 0; i < value.intervals.length; i++) {
                                for(j = 0; j < scope.dates.length; j++) {
                                    if(value.intervals[i] === scope.dates[j].id) {
                                        scope.dates[j].active = true;
                                        break;
                                    }
                                }
                            }
                        } else if(value.frequency === scope.frequenciesEnum.YEARLY) {
                            for(i = 0; i < value.intervals.length; i++) {
                                for(j = 0; j < scope.months.length; j++) {
                                    if(value.intervals[i] === scope.months[j].id) {
                                        scope.months[j].active = true;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    //set frequency
                    scope.paymentOrder.scheduledTransfer.frequency = value.frequency === "" ? scope.frequencies[0].id : value.frequency;

                    //set custom order
                    if(isCustomOrder()) {
                        scope.customOrder = true;
                    } else {
                        scope.customOrder = false;
                    }

                    handleWarningDate();
                    scope.setTransferPeriodDates();
                });


                /**
                 * FREQUENCY FUNCTIONS
                 */
                //reset the interval list and set whether the standing order is custom or not
                scope.frequencyChanged = function() {

                    clearActiveIntervals();

                    scope.setTransferPeriodDates();

                    if(isCustomOrder()) {
                        scope.customOrder = true;
                        handleIntervalValidation();
                        scope.paymentOrder.scheduledTransfer.customOrder = true;
                    } else {
                        scope.customOrder = false;
                        modelCtrl.$setValidity("intervalsRequired", true);
                        scope.paymentOrder.scheduledTransfer.customOrder = false;
                    }

                    handleWarningDate();
                };

                /**
                 * INTERVAL FUNCTIONS
                 */
                //add a selected interval to the interval list
                scope.toggleInterval = function($index) {

                    var list, search;

                    //set list to whichever frequency is currenctly selected
                    if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.WEEKLY) {
                        list = scope.days;
                    } else if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.MONTHLY) {
                        list = scope.dates;
                    } else if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.YEARLY) {
                        list = scope.months;
                    }

                    search = list[$index];

                    if(search.active) {
                        //remove from list
                        var index = scope.paymentOrder.scheduledTransfer.intervals.indexOf(search.id);
                        scope.paymentOrder.scheduledTransfer.intervals.splice(index, 1);
                    } else {
                        //add to list
                        scope.paymentOrder.scheduledTransfer.intervals.push(search.id);
                    }

                    search.active = !search.active;

                    //set interval control validity
                    handleIntervalValidation();
                    handleWarningDate();

                    scope.setEndDate();
                };

                var handleIntervalValidation = function() {

                    var validIntervals = true;

                    validIntervals = scope.paymentOrder.scheduledTransfer.intervals.length > 0 ? true : false;

                    //validate requirement from frequency
                    validIntervals = scope.customOrder ? validIntervals : true;

                    //validate whether the order is scheduled or not
                    validIntervals = scope.paymentOrder.isScheduledTransfer ? validIntervals : true;

                    modelCtrl.$setValidity("intervalsRequired", validIntervals);
                };

                var clearActiveIntervals = function() {

                    scope.paymentOrder.scheduledTransfer.intervals = [];

                    var i;

                    for(i = 0; i < scope.days.length; i++) {
                        scope.days[i].active = false;
                    }

                    for(i = 0; i < scope.dates.length; i++) {
                        scope.dates[i].active = false;
                    }

                    for(i = 0; i < scope.months.length; i++) {
                        scope.months[i].active = false;
                    }
                };


                /**
                 * CALENDAR FUNCTIONS
                 */
                scope.openStartCalendar = function($event) {
                    //open calendar on click event or "enter" and "space" key press events
                    if ($event.type === 'click' || $event.which === 32 || $event.which === 13) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        scope.calendar.endCalendarOpen = false;
                        //open start date calendar
                        scope.calendar.startCalendarOpen = !scope.calendar.startCalendarOpen;
                    }
                };

                scope.openEndCalendar = function($event) {
                    if ($event.type === 'click' || $event.which === 32 || $event.which === 13) {
                        $event.preventDefault();
                        $event.stopPropagation();

                        scope.calendar.startCalendarOpen = false;
                        //open end date calendar
                        scope.calendar.endCalendarOpen = !scope.calendar.endCalendarOpen;
                    }
                };

                scope.setTransferPeriodDates = function() {

                    if (typeof scope.paymentOrder.scheduledTransfer.startDate !== 'object') {
                        if(isCustomOrder()) {
                            //start date todays date
                            scope.paymentOrder.scheduledTransfer.startDate = new Date(scope.todaysDate.getTime());
                        } else {
                            //calculate start date
                            if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.END_OF_THE_MONTH) {
                                scope.paymentOrder.scheduledTransfer.startDate = dateCalculator.getLastDayOfMonth();
                            } else if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.START_OF_THE_MONTH) {
                                scope.paymentOrder.scheduledTransfer.startDate = dateCalculator.getFirstDayOfMonth();
                            } else if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.LAST_FRIDAY_OF_THE_MONTH) {
                                scope.paymentOrder.scheduledTransfer.startDate = dateCalculator.getLastFridayOfMonth();
                            }
                        }
                    }

                    scope.setEndDate();
                };

                scope.setEndDate = function() {

                    var timeToAdd;

                    if(scope.paymentOrder.scheduledTransfer.startDate) {
                        var date = new Date(scope.paymentOrder.scheduledTransfer.startDate.getTime());

                        if(isCustomOrder()) {
                            timeToAdd = (scope.paymentOrder.scheduledTransfer.timesToRepeat * scope.paymentOrder.scheduledTransfer.every);

                            //add specified number of weeks/months/years to date
                            if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.WEEKLY) {
                                date = dateCalculator.addWeeksToDate(date, timeToAdd);

                            } else if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.MONTHLY) {
                                date = dateCalculator.addMonthsToDate(date, timeToAdd);

                            } else if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.YEARLY) {
                                date = dateCalculator.addYearsToDate(date, timeToAdd);

                            }
                        } else {
                            timeToAdd = scope.paymentOrder.scheduledTransfer.timesToRepeat;
                            timeToAdd = scope.paymentOrder.scheduledTransfer.timesToRepeat;

                            //calculate end date based on frequency
                            if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.END_OF_THE_MONTH) {
                                date = dateCalculator.getLastDayOfMonthPlusTime(date, timeToAdd);

                            } else if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.START_OF_THE_MONTH) {
                                date = dateCalculator.getFirstDayOfMonthPlusTime(date, timeToAdd);

                            } else if(scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.LAST_FRIDAY_OF_THE_MONTH) {
                                date = dateCalculator.getLastFridayOfMonthPlusTime(date, timeToAdd);

                            }

                        }

                        scope.paymentOrder.scheduledTransfer.endDate = date;
                        scope.minEndDate = dateCalculator.calculateMinimumEndDate(scope.paymentOrder.scheduledTransfer.frequency, scope.paymentOrder.scheduledTransfer.every, new Date(scope.paymentOrder.scheduledTransfer.startDate.getTime()));

                        scope.timesEndDate = new Date(scope.paymentOrder.scheduledTransfer.endDate.getTime()).toString("d-MMM-yyyy");
                    }
                };

                var handleWarningDate = function() {

                    var found = false;

                    if(scope.paymentOrder.scheduledTransfer.intervals.length > 0 && scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.MONTHLY) {
                        for (var i = 28; i < 31; i++) {
                            if (scope.dates[i].active) {
                                found = true;
                            }
                        }
                    }

                    scope.dateWarning = found;
                };


                /**
                 * WATCHES
                 */
                scope.$watch("paymentOrder.isScheduledTransfer", function(newValue) {
                    handleIntervalValidation();
                });

                //reset scope on succesful form submission
                scope.$on("reset", function() {
                    scope.paymentOrder.scheduledTransfer.frequency = scope.frequencies[0].id;
                    scope.customOrder = false;
                    scope.paymentOrder.scheduledTransfer.customOrder = false;
                });

                /**
                 * GENERAL
                 */
                var isCustomOrder = function() {
                    return scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.WEEKLY || scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.MONTHLY || scope.paymentOrder.scheduledTransfer.frequency === scope.frequenciesEnum.YEARLY;
                };

                initialize();
            }
        };
    };
});
