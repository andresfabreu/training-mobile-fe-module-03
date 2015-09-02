define( function( require, exports, module) {

    'use strict';

    var angular = require('base').ng;

    /*----------------------------------------------------------------*/
    /* Utilities
    /*----------------------------------------------------------------*/
    // @ngInject
    exports.lpEbillingUtils = function(lpCoreUtils, $filter, $log) {

        this.noop = angular.noop;
        this.extend = angular.extend;
        this.bind = angular.bind;
        this.copy = angular.copy;
        this.isObject = angular.isObject;
        this.isFunction = angular.isFunction;
        this.isUndefined = angular.isUndefined;
        this.isTouch = ('ontouchstart' in window);
        this.keys = Object.keys;

        /**
         * [resolvePreference description]
         * @param  {[type]} value  [description]
         * @param  {[type]} params [description]
         * @return {[type]}        [description]
         */
        this.resolvePreference = function(value, params) {
            return lpCoreUtils.resolvePortalPlaceholders(value);
        };

        /**
         * [widgetStaticPath description]
         * @param  {[type]} widgetSrc [description]
         * @return {[type]}           [description]
         */
        this.widgetStaticPath = function(widgetSrc) {
            var parts = widgetSrc.toString().split('/');
            parts.pop();
            var base = parts.join('/');
            base = this.resolvePreference(base);
            return base;
        };

        /**
         * [isBoolean description]
         * @param  {[type]}  obj [description]
         * @return {Boolean}     [description]
         */
        this.isBoolean = function ( obj ) {
            return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]';
        };

        /**
         * [filter description]
         * @param  {[type]} predicate [description]
         * @param  {[type]} whereObj  [description]
         * @return {[type]}           [description]
         */
        this.filter = function(predicate, whereObj) {
            if( lpCoreUtils.isEmpty(whereObj) ) {
                throw new Error('Specify an object criteria');
            }
            var k = this.keys(whereObj)[0];
            return predicate.filter(function(i){
                var cond = false;
                if(i.hasOwnProperty(k)) {
                    cond = i[k] === whereObj[k];
                }
                return cond;
            })[0];
        };

        /**
         * [findIndex description]
         * @param  {[type]} predicate [description]
         * @param  {[type]} whereObj  [description]
         * @return {[type]}           [description]
         */
        this.findIndex = function(predicate, whereObj ) {
            var item = this.filter(predicate, whereObj);
            return predicate.indexOf(item);
        };

        /**
         * [sortBy description]
         * @param  {[type]} data      [description]
         * @param  {[type]} attribute [description]
         * @return {[type]}           [description]
         */
        this.sortBy = function( data, attribute, desc ) {
            data.sort(
                function( a, b ) {
                    if ( a[ attribute ] <= b[ attribute ] ) {
                        return desc ? 1 : -1;
                    }
                    return 1;
                }
            );
        };
        /**
         * [checkDueDate description]
         * @param  {[type]} when [description]
         * @param  {[type]} d    [description]
         * @return {[type]}      [description]
         */
        this.checkDueDate = function(when, d) {
            var date = lpCoreUtils.date;

            if( typeof d !== 'undefined' ) {
                if (when === 'isToday') {
                    return date().isSame(date(d), 'day');
                    // return  today.equals(d);
                }
                else if (when === 'isTomorrow') {
                    return date().add(1, 'day').isSame(date(d), 'day');
                    // return d.equals(tomorrow);
                }
                else if (when === 'isYesterday') {
                    return date().subtract(1, 'day').isSame(date(d), 'day');
                    // return d.equals(yesterday);
                }
                else if (when === 'isPast') {
                    return date().isAfter(date(d), 'day');
                    // return today.isAfter(d);
                }

                return d;
            }

            return null;
        };
        /**
         * [dueDateIndicator description]
         * @param  {[type]} d [description]
         * @return {[type]}   [description]
         */
        this.dueDateIndicator = function(d) {
            if (this.checkDueDate( 'isToday', d )) { return '(today)'; }
            if (this.checkDueDate( 'isTomorrow', d )) { return '(tommorow)'; }
            if (this.checkDueDate( 'isYesterday', d )) { return '(yesterday)'; }
            return '';
        };

        /**
         * [groupBy description]
         * @param  {[type]} attribute [description]
         * @return {[type]}           [description]
         */
        // #TODO make it more customizable
        this.groupBy = function( data, groupBy, groupLabelPrefix, groupLabelSuffix, sortOrder) {

            var groupValue = '';
            var group;
            var groups = [];
            var groupLabel = '';
            groupLabelPrefix = groupLabelPrefix || '';
            groupLabelSuffix = groupLabelSuffix || '';
            var supportedGroups = ['dueDate', 'amount', 'modifiedDate'];

            if(!data instanceof Array || data.length <= 0) {
                // empty
                return groups;
            }
            if(supportedGroups.indexOf(groupBy) <= -1) {
                throw new Error('Unsupported groupby attribute');
            }

            this.sortBy(data, groupBy, sortOrder);

            data.forEach(function(item) {
                switch(groupBy) {
                    case 'amount':
                        groupLabel = $filter('eBillCurrency')(item[ groupBy ], item.currencySym );
                    break;
                    case 'dueDate':
                    case 'modifiedDate':
                        groupLabelPrefix = groupLabelPrefix;
                        var dueDate = item[groupBy];
                        groupLabel = dueDate && $filter('date')(dueDate, 'MMM dd').toString().toLowerCase();
                        var labelSuffix = (this.checkDueDate( 'isPast', dueDate )) ? groupLabelSuffix : this.dueDateIndicator(dueDate);
                }
                if ( groupLabel !== groupValue ) {
                    group = {
                        label: [ groupLabelPrefix, groupLabel, labelSuffix].join(' '),
                        bills: []
                    };
                    groupValue = groupLabel;
                    groups.push( group );
                }
                if(group && group.bills instanceof Array) { group.bills.push( item ); }
            }.bind(this));
            return groups;
        };


        /**
         * [error description]
         * @param  {[type]} err [description]
         * @return {[type]}     [description]
         */
        this.error = function(err) {
           // TODO Error management
           throw new Error(err);
        };

        /**
         * [log description]
         * @return {[type]} [description]
         */
        this.log = function() {
            if( location.hostname.toLowerCase() !== 'localhost' ) { return; }
            var arg = [].slice.call(arguments, 0);
            if( this.isFunction($log.log) ) {
                $log.log.apply($log.log, arg);
            }
        };

        /**
         * [info description]
         * @return {[type]} [description]
         */
        this.info = function() {
            if( location.hostname.toLowerCase() !== 'localhost' ) { return; }
            var arg = [].slice.call(arguments, 0);
            if( this.isFunction($log.info) ) {
                $log.info.apply($log.info, arg);
            }
        };
    };

});
