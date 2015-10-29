/**
 * ------------------------------------------------------------------------
 * Widget Accounts entry file
 * ------------------------------------------------------------------------
 */

'use strict';

// if the module has no dependencies, the above pattern can be simplified to
(function(root, factory) {
    var moduleName = 'widgetAccounts';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // only CommonJS-like environments that support module.exports,
        module.exports = factory(moduleName, root.angular);
    } else {
        // Browser globals (root is window)
        root[moduleName] = factory(moduleName, root.angular);
    }
}(this, function(name, angular) {

    // dependencies
    var $injector = angular.injector(['ng']);
    var $log = $injector.get('$log');
    var $filter = $injector.get('$filter');
    var bus = window.gadgets.pubsub;
    /**
     * Normalize response from the server
     * @param  {Object} response $http response
     * @return {Object}          data
     * @private
     */
    function normalizeResponse(response) {
        $log.debug('Normalize response:', response);
        var data = response.data;
        var status = response.status;
        if (status >= 200 && status < 300) {
            return data;
        }
    }
    /**
     * Parsing and enhancing the data
     * @param  {Object} data Normalized data
     * @return {Object}      Enhanced data
     * @private
     */
    function parseData(data) {
        if (!data || !Object.keys(data).length) {
            throw new Error('Empty data object. Unable to parse');
        }
        $log.debug('Data before parse: ', data);
        var parsedData = {};
        parsedData.currentAccount = data['current-account'].map(function(item) {
            item.availableBalance = $filter('currency')(item.availableBalance, '€', 0);
            return item;
        });


        parsedData.card = data['card'].map(function(item) {
            item.availableBalance = $filter('currency')(item.availableBalance, '€', 0);
            return item;
        });

        parsedData.card = data['card'];
        $log.debug('Data after parse: ', parsedData);
        return parsedData;
    }

    /**
     * Attach to View Controller
     * @param  {Object} data Data
     * @return {Object}      Data
     * @private
     */
    function bindToView(data) {
        $log.debug('Bind Data To View: ', data);
        this.data = data;
        return data;
    }

    /**
     * Handle Errors
     * @param  {Object} err Error Object
     * @return {Object}     Error object
     * @private
     */
    function handleError(err) {
        this.alert = {
            type: 'error',
            message: 'Woops something went wrong...'
        };
        $log.error(err.data);
        return err;
    }

    /**
     * Done state of the widget
     * After all the requests are done and the data is parsed
     * @param  {Object} widget instance
     * @return {undefined}
     * @private
     */

    function done(widget) {
        this.state = 'done';
        $log.info('Done');
        $log.info('Publishing cxp.item.loaded %c%s', 'color: #999', widget.id);
        console.timeEnd(widget.id);
        bus.publish('cxp.item.loaded', {
            id: widget.id
        });
    }

    // Create Angular app
    function createApp(widget, deps) {
        return angular.module(name, deps || [])
            .controller('MainCtrl', function($http) {
                this.state = 'loading';

                $http.get(widget.getPreference('accountsEndPoint'))
                    .then(normalizeResponse)
                    .then(parseData)
                    .then(bindToView.bind(this))
                    .catch(handleError.bind(this))
                    .finally(done.bind(this, widget));
            });
    }

    /**
     * Main Widget function
     * @param  {Object} widget instance
     * @return {Object}        Application object
     * @public
     */
    function widgetAccounts(widget) {
        var obj = Object.create(widgetAccounts.prototype);
        var deps = [
            'bbCard',
            'bbAccountListItem'
        ];
        obj.widget = widget;
        obj.app = createApp(widget, deps);
        return obj;
    }

    /**
     * Widget proto
     * @type {Object}
     */
    widgetAccounts.prototype = {
        bootstrap: function() {
            console.time(this.widget.id);
            angular.bootstrap(this.widget.body, [name]);
            return this;
        },
        destroy: function() {
            this.app = null;
        }
    };

    return widgetAccounts;
}));
