define(function(require, exports, module) {
    'use strict';

    var util = window.lp && window.lp.util; // to be refactored
    var $ = window.jQuery;

    // Get relative path to the UI templates (TODO: clean this up when moving to new widget structure).
    var calendar = {
        month: {
            long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

};

    // @ngInject
    exports.ExpensePlanningController = function($scope, $rootElement, $timeout, lpWidget, $log, i18nUtils, ExpensesModel, lpUIResponsive) {
        var responsive = lpUIResponsive;
        var widget = lpWidget;
        //var self = this;
        var initialize = function() {
            var partialsDir = util.widgetBaseUrl(widget) + '/partials/';

            // create new model with these variables
            $scope.locale = widget.getPreference('locale');
            $scope.title = widget.getPreference('title');
            i18nUtils.loadMessages(widget, $scope.locale).success(function(bundle) {
                $scope.messages = bundle.messages;
            });
            $scope.templates = {
                list: partialsDir + 'list.html'
            };

            /*Calendar cases */
            $scope.expensesModel = ExpensesModel.getInstance({
                expensesEndpoint: widget.getPreference('expensesDataSrc'),
                expensesDetailsEndpoint: widget.getPreference('expensesDetailsDataSrc')
            });
            $scope.today = new Date();
            $scope.lastDay = new Date($scope.today.getFullYear(), 12, 0, 23, 59, 59);
            var promise = $scope.expensesModel.loadExpenses($scope.today, $scope.lastDay);
            promise.then(function() {
                $scope.calendarPayments = $scope.filterPayments($scope.expensesModel.expenses);
                $scope.paymentListOnDates = $scope.filterPayments($scope.expensesModel.findByDate($scope.today));
            });
        };
        $scope.filterPayments = function(dateObj) {
            var activePayments = {};
            var paymentFilter = function (payment) {
                return payment.status === 'RECEIVED' ? false : true;
            };

            for (var i in dateObj) {
                if (dateObj.hasOwnProperty(i)) {
                    var payments = dateObj[i].payments.filter(paymentFilter);
                    if (payments.length > 0) {
                        dateObj[i].payments = payments;
                        activePayments[i] = dateObj[i];
                    }
                }
            }
            return util.isEmptyObject(activePayments) ? null : activePayments;
        };
        $scope.showList = function(obj) {
            $scope.paymentListOnDates = $scope.filterPayments($scope.expensesModel.findByDate(obj));
        };

        $scope.showDetail = function(payment) {
            $scope.expensesModel.loadExpensesDetails(payment);
        };

        $scope.refreshContent = function(date) {
            if($scope.lastDay < date) {
                var newLastDay = new Date($scope.lastDay.getFullYear() + 1, 12, 0, 23, 59, 59);
                $scope.expensesModel.loadExpenses($scope.lastDay, newLastDay);
                $scope.lastDay = newLastDay;
            }
        };

        widget.addEventListener('preferencesSaved', function() {
            widget.refreshHTML();
            $scope.$apply(function() {
                initialize();
            });
        });


        // Responsive
        responsive.enable($rootElement)
            .rule({
                'max-width': 200,
                then: function() {
                    $scope.responsiveClass = 'lp-tile-size';
                    $scope.handleLargeScreen = false;
                    util.applyScope($scope);
                }
            })
            .rule({
                'min-width': 201,
                'max-width': 400,
                then: function() {
                    $scope.responsiveClass = 'lp-small-size';
                    $scope.handleLargeScreen = false;
                    util.applyScope($scope);
                }
            })
            .rule({
                'min-width': 401,
                'max-width': 624,
                then: function() {
                    $scope.responsiveClass = 'lp-medium-size';
                    $scope.handleLargeScreen = false;
                    util.applyScope($scope);
                }
            })
            .rule({
                'min-width': 625,
                'max-width': 915,
                then: function() {
                    $scope.responsiveClass = 'lp-large-size';
                    $scope.handleLargeScreen = false;
                    util.applyScope($scope);
                }
            })
            .rule({
                'min-width': 915,
                then: function() {
                    $scope.responsiveClass = 'lp-large-size';
                    $scope.handleLargeScreen = true;
                    util.applyScope($scope);
                }
            });

        initialize();
    };

    // @ngInject
    exports.calendarCtrl = function($scope, $element) {

        var self = this;
        var atWeekInMonth = -1;
        var weekIndex = -1;
        $scope.navigate = {};

        var isInMonth = function() {
            return ($scope.currentDate.getMonth() === $scope.today.getMonth() &&
                $scope.currentDate.getFullYear() === $scope.today.getFullYear());
        };

        /*
         * Animation for calander
         */
        var animateCalendar = function(animCalElem, animCalDone) {
            var animateYear = function (elem, animYearDone) {
                var $newElem = $(elem).clone();
                $newElem.css({
                    'position': 'absolute',
                    'background': '#FFFFFF',
                    'zIndex': '99999',
                    'left': $(elem).position().left
                });
                $(elem).parent().append($newElem);
                // var $container = $(elem).closest('.cal-body');
                // elemTop = ($newElem.offset().top - $container.offset().top)+'px';
                $newElem.css({
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%'
                });
                animYearDone();

                //disabling animation code
                /*var boxTransition = new Transitn({
                 element: $newElem[0],
                 duration: '.5s',
                 //isCleaning: true,
                 from: {
                 left: $newElem.position().left+'px',
                 top: elemTop,
                 width: $newElem.width(),
                 height: $newElem.height()
                 },
                 to: {
                 left: 0,
                 top: 0,
                 width: '100%',
                 height: '100%'
                 },
                 timingFunction: 'ease-in-out'
                 }).on('transitionend', function(trans, prop) {
                 if(prop === 'height'){
                 animYearDone();
                 }
                 });
                 boxTransition.start();
                 */
            };
            if($scope.view === 'year') {
                animateYear(animCalElem, animCalDone);
            }
        };

        /*
         * Caculate the week index of the date is passed.
         */
        var getWeekOfMonth = function(date) {
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
            return Math.ceil((date.getDate() + firstDay) / 7);
        };

        var isPast = function(year, month, date) {
            if (!date) {
                date = 0;
            }
            var nDate = new Date(year, month - 1, date, 23, 59, 59);
            return nDate < $scope.today;
        };

        /*
         * Populating payment content to the day view.
         */
        var getDateContent = function(year, month, date) {
            var contentObj = $scope.content;
            var key = '' + year + '-' + ('0' + month).slice(-2) + '-' + ('0' + date).slice(-2);
            var content = null;
            if (contentObj && contentObj[key]) {
                if (contentObj[key].payments) {
                    content = {};
                    content.paymentCount = contentObj[key].payments.length;
                    content.paymentTotal = contentObj[key].total;
                    content.currency = contentObj[key].currency;
                }
            }
            return content;
        };

        /*
         * Genegrate week data.
         */
        var weekGenegrator = function(year, month, startDate, daysOfMonth, prevDaysOfMonth) {
            var week = [];
            for (var i = 0; i < 7; i++) {
                var cMonth = month,
                    cYear = year,
                    realDate,
                    outmonth = false,
                    content = '';

                if (startDate + i < 0) {
                    realDate = prevDaysOfMonth + startDate + i + 1;
                    outmonth = true;
                    if (month === 1) {
                        cMonth = 12;
                        cYear -= 1;
                    } else {
                        cMonth -= 1;
                    }
                } else if (startDate + i + 1 > daysOfMonth) {
                    realDate = startDate + i - daysOfMonth + 1;
                    outmonth = true;
                    if (month === 12) {
                        cMonth = 1;
                        cYear += 1;
                    } else {
                        cMonth += 1;
                    }
                } else {
                    realDate = startDate + i + 1;
                }
                content = getDateContent(cYear, cMonth, realDate);

                week.push({
                    'outmonth': outmonth,
                    'day': i,
                    'month': cMonth,
                    'year': cYear,
                    'content': content,
                    'date': realDate,
                    'isPast': isPast(cYear, cMonth, realDate),
                    'dateObj': new Date(cYear, cMonth - 1, realDate, 0, 0, 0)
                });
            }
            return week;
        };

        var daysInMonth = function(month, year) {
            return new Date(year, month, 0).getDate();
        };

        /*
         * Genegrate month data. Two dimensional array is returned.
         */
        var monthGenegrator = function(month, year) {
            var monthArray = [];
            var firstDay = new Date(year, month - 1, 1, 0, 0, 0, 0);
            //  weekDay between 1 ~ 7 , 1 is Monday, 7 is Sunday
            var firstDayInFirstweek = firstDay.getDay();
            var daysOfMonth = daysInMonth(month, year);
            var prevDaysOfMonth = daysInMonth(month - 1, year);

            var recordDate = 0; //record which day obj already genegrate

            //first week row
            monthArray.push(weekGenegrator(year, month, recordDate - firstDayInFirstweek, daysOfMonth, prevDaysOfMonth));

            recordDate = 7 - firstDayInFirstweek;
            //loop for following week row
            while (recordDate < daysOfMonth) {
                var week = weekGenegrator(year, month, recordDate, daysOfMonth);
                monthArray.push(week);
                for (var day in week) {
                    if (week[day].month === month) {
                        recordDate += 1;
                    }
                }
            }

            //set isToday
            if (isInMonth()) {
                atWeekInMonth = getWeekOfMonth($scope.today) - 1;
                var atDay = $scope.today.getDay();
                monthArray[atWeekInMonth][atDay].isToday = true;
                if ($scope.selectedDay === -1) {
                    $scope.selectedDay = monthArray[atWeekInMonth][atDay];
                }
            } else {
                atWeekInMonth = -1;
                if ($scope.selectedDay === -1) {
                    $scope.selectedDay = monthArray[0][firstDayInFirstweek];
                }
            }
            return monthArray;
        };

        /*
         * Generate previous week data.
         */
        var prevWeek = function() {
            var isCurrentWeek = function() {
                if (isInMonth() && weekIndex === atWeekInMonth) {
                    return true;
                } else {
                    for (var i = $scope.week.length - 1; i >= 0; i--) {
                        if ($scope.week[i].isPast) {
                            return true;
                        }
                    }
                }
                return false;
            };

            if (isCurrentWeek()) {
                return;
            }
            weekIndex = weekIndex - 1;
            if (weekIndex < 0) {
                $scope.currentDate.setMonth($scope.currentDate.getMonth() - 1);
                $scope.month = monthGenegrator($scope.currentDate.getMonth() + 1, $scope.currentDate.getFullYear());
                weekIndex = $scope.month.length - 1;
                if ($scope.month[weekIndex][6].outmonth) {
                    weekIndex = weekIndex - 1;
                }
            }
            $scope.week = $scope.month[weekIndex];
        };

        /*
         * Generate next week data.
         */
        var nextWeek = function() {
            weekIndex = weekIndex + 1;
            if (!$scope.month[weekIndex]) {
                $scope.currentDate.setMonth($scope.currentDate.getMonth() + 1);
                $scope.month = monthGenegrator($scope.currentDate.getMonth() + 1, $scope.currentDate.getFullYear());
                weekIndex = 0;
                if ($scope.month[weekIndex][0].outmonth) {
                    weekIndex = weekIndex + 1;
                }
            }
            $scope.week = $scope.month[weekIndex];
        };

        /*
         * Populating payment content to the year view.
         */
        var getYearContent = function() {
            var contentObj = $scope.content;
            var content = {};
            for (var key in contentObj) {
                if (contentObj.hasOwnProperty(key)) {
                    var monthNumb = key.slice(0, 7);
                    if (!content[monthNumb]) {
                        content[monthNumb] = {
                            'paymentCount': 0,
                            'paymentTotal': 0,
                            'currency': ''
                        };
                    }
                    content[monthNumb].paymentCount += contentObj[key].payments.length;
                    content[monthNumb].paymentTotal += contentObj[key].total;
                }
            }
            return content;
        };

        /*
         * Change month view data.
         */
        var monthView = function() {
            $scope.month = monthGenegrator($scope.currentDate.getMonth() + 1, $scope.currentDate.getFullYear());
        };

        /*
         * Change week view data.
         */
        var weekView = function() {
            if (!$scope.month) { //current week
                $scope.month = monthGenegrator($scope.currentDate.getMonth() + 1, $scope.currentDate.getFullYear());
                weekIndex = atWeekInMonth;
            } else {
                if ($scope.selectedDay && $scope.selectedDay.month === $scope.currentDate.getMonth() + 1) {
                    var selectedDay = new Date($scope.selectedDay.year, $scope.selectedDay.month - 1, $scope.selectedDay.date);
                    weekIndex = getWeekOfMonth(selectedDay) - 1;
                    if ($scope.selectedDay.outmonth) {
                        $scope.month = monthGenegrator($scope.currentDate.getMonth() + 1, $scope.currentDate.getFullYear());
                    }
                } else {
                    weekIndex = 0;
                    if ($scope.month[0][6].month === $scope.today.getMonth() + 1) {
                        weekIndex = atWeekInMonth;
                    }
                }
            }
            $scope.week = $scope.month[weekIndex];
        };

        /*
         * Change year view data.
         */
        var yearView = function() {
            var monthList = [], monthObj;
            $scope.monthList = [];
            var yearContent = getYearContent();
            for (var i = 0; i <= 12; i++) {
                monthObj = {
                    'numb': i,
                    'year': $scope.currentDate.getFullYear(),
                    'longName': calendar.month.long[i],
                    'shortName': calendar.month.short[i],
                    'content': yearContent[$scope.currentDate.getFullYear() + '-' + ('0' + (i + 1)).slice(-2)],
                    'isPast': isPast($scope.currentDate.getFullYear(), i + 2)
                };
                monthList.push(monthObj);
                if (i > 0 && ((i + 1) % 3 === 0)) {
                    $scope.monthList.push(monthList);
                    monthList = [];
                }
            }
        };

        this.init = function() {
            if (!$scope.$parent.calendarView) {
                $scope.view = 'agenda';
            }
            $scope.templates = $scope.$parent.templates;
            $scope.today = new Date();
            $scope.calendar = calendar;
            $scope.agendaView = false;
            $scope.handleLargeScreen = false;
            $scope.widgetSize = $scope.$parent.responsiveClass;
            $scope.selectedDay = -1;

            if ($scope.widgetSize === 'lp-small-size') {
                $scope.view = 'year';
            }

            var targetMonth = parseInt($scope.assignedMonth, 10),
                targetYear = parseInt($scope.assignedyear, 10);

            if (!isNaN(targetMonth) && !isNaN(targetYear) &&
                targetMonth > 0 &&
                targetMonth < 12
                ) {
                $scope.currentDate = new Date(targetYear, targetMonth, 0);
            } else {
                $scope.currentDate = new Date();
            }
            if ($scope.view === 'agenda') {
                $scope.view = 'month';
                $scope.agendaView = true;
            }
        };

        this.refreshCalendar = function() {
            $scope.dateHeader = ($scope.view !== 'year' && $scope.view !== 'agenda');
            switch ($scope.view) {
                case 'month':
                    monthView();
                    break;
                case 'week':
                    weekView();
                    break;
                case 'year':
                    yearView();
                    break;
            }
        };


        $scope.$watch('view', function() {
            self.refreshCalendar();
        });

        $scope.$watch('$parent.handleLargeScreen', function(newValue) {
            $scope.handleLargeScreen = newValue;
        });

        $scope.$watch('content', function() {
            self.refreshCalendar();
        }, true);

        $scope.$watch('week', function() {
            if ($scope.week) {
                $scope.$parent.showList($scope.week);
            }
        });
        $scope.$watch('currentDate', function() {
            $scope.$parent.showList($scope.currentDate);
        }, true);

        /*
         * Handle events from the template.
         *
         */
        $scope.changeView = function(view) {
            $scope.agendaView = false;
            if (view === 'agenda') {
                view = 'month';
                $scope.agendaView = true;
                $scope.$parent.showList($scope.currentDate);
            }
            $scope.$parent.calendarView = view;
        };

        $scope.navigate.prev = function() {
            if ($scope.view === 'month') {
                if (isInMonth()) {
                    return;
                }
                $scope.currentDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() - 1, 1);
                $scope.selectedDay = -1;
                weekIndex = -1;
                self.refreshCalendar();
            } else if($scope.view === 'week') {
                prevWeek();
            } else if($scope.view === 'year') {
                if ($scope.currentDate.getFullYear() === $scope.today.getFullYear()) {
                    return;
                }
                var year = $scope.currentDate.getFullYear() - 1;
                if(year === $scope.today.getFullYear()) {
                    $scope.currentDate = $scope.today;
                } else {
                    $scope.currentDate = new Date(year, 0, 1);
                }
                $scope.selectedDay = -1;
                weekIndex = -1;
                self.refreshCalendar();
            }
        };

        $scope.navigate.next = function() {
            switch ($scope.view) {
                case 'month':
                    $scope.currentDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth() + 1, 1);
                    weekIndex = -1;
                    $scope.selectedDay = -1;
                    self.refreshCalendar();
                    break;
                case 'week':
                    nextWeek();
                    break;
                case 'year':
                    $scope.currentDate = new Date($scope.currentDate.getFullYear() + 1, 0, 1);
                    weekIndex = -1;
                    $scope.selectedDay = -1;
                    self.refreshCalendar();
                    break;
            }
            $scope.$parent.refreshContent($scope.currentDate);
        };

        $scope.navigate.today = function() {
            $scope.currentDate = new Date();
            $scope.month = null;
            self.refreshCalendar();
        };

        $scope.clickOnDate = function(day) {
            if (day.isPast) {
                return;
            }
            $scope.currentDate = new Date(day.year, day.month - 1, day.date);
            $scope.selectedDay = day;
            self.refreshCalendar();
            if (!$scope.agendaView) {
                $scope.changeView('agenda');
            }
        };

        $scope.clickOnMonth = function(month, e) {
            if (month.isPast) {
                return;
            }
            animateCalendar(e.currentTarget.parentNode, function(){
                $scope.currentDate.setMonth(month.numb);
                $scope.currentDate.setYear(month.year);
                $scope.changeView('month');
                $scope.$parent.refreshContent($scope.currentDate);
                //$scope.$apply();
            });
        };

        $scope.isSelected = function(day) {
            //REVIEW: Just return the result of the boolean expression (or assign to a var first for readability)
            return ($scope.selectedDay &&
                day.date === $scope.selectedDay.date &&
                day.month === $scope.selectedDay.month &&
                day.year === $scope.selectedDay.year);
        };

        $scope.loadDetails = function(payment) {
            $scope.$parent.showDetail(payment);
        };
    };
});
