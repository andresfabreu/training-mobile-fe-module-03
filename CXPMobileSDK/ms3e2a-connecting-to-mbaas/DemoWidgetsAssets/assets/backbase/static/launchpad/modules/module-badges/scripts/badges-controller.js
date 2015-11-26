define(function(require, exports, module) {
    'use strict';

    var _ = require('base').utils;

    exports.lpBadgesController = function(lpCoreBus) {
        var bus = lpCoreBus;

        // Main collection. Records about unread items will be like:
        // [{type: "messages", unread:2}, {type: "priority", unread:1}, {type: "orders", unread:0}]
        // -- we will notify widgets depending on the above types ("messages", "orders", etc.)
        // -- we don't config item's types and rely on server here and listeners in widgets
        var MODEL = [];

        // TODO: should we backup the model to localStorage?

        /**
         * Basic server data validation
         *       ------
         *
         * @param data
         * @returns {boolean}
         * @private
         */
        var inputDataValid = function(data) {
            if (!data || !_.isArray(data)) {
                console.warn('Badges: input data is invalid!');
                return false;
            } else {
                return true;
            }
        };

        /**
         * Basic local data validation
         *       -----
         *
         * We expect the 'clientData' to be the following structure:
         * {type: "messages", delta: 1} // decrease "messages" unread count to 1
         * {type: "orders", delta: 0}   // mark ALL "orders" as 'read'
         *
         * @param clientData
         * @returns {boolean}
         * @private
         */
        var inputClientDataValid = function(clientData) {
            if (!clientData || !_.isObject(clientData) || !clientData.hasOwnProperty('type') || !clientData.hasOwnProperty('delta')) {
                console.warn('Badges: client data is invalid!');
                return false;
            } else {
                return true;
            }
        };

        /**
         * Update MODEL with arrived data
         *
         * @param data
         * @private
         */
        var updateEntireCollection = function(data) {
            var arrivedTypes, currentTypes, newlyArrivedTypes, orphanTypes, intersectTypes;

            arrivedTypes = _.pluck(data, 'type');
            currentTypes = _.pluck(MODEL, 'type');
            newlyArrivedTypes = _.difference(arrivedTypes, currentTypes);
            orphanTypes = _.difference(currentTypes, arrivedTypes);
            intersectTypes = _.intersection(arrivedTypes, currentTypes);

            // adding brand new items
            newlyArrivedTypes.forEach(function(newType) {
                var newEl = _.filter(data, function(el) { return el.type === newType; });
                if (newEl.length === 1) {
                    MODEL.push(newEl[0]);
                }
            });

            // zero those items, not mentioned in the arrived data
            // this required to hide 'read' badges
            MODEL.forEach(function(el) {
                if (_.indexOf(orphanTypes, el.type) !== -1) {
                    el.unread = 0;
                }
            });

            // update intersected items
            MODEL.forEach(function(el) {
                var arrivedEl;
                if (_.indexOf(intersectTypes, el.type) !== -1) {
                    arrivedEl = _.filter(data, function(item) { return item.type === el.type; });
                    if (arrivedEl.length === 1) {
                        el.unread = arrivedEl[0].unread;
                    }
                }
            });
        };

        /**
         * Emit 'refresh' events to outer widgets to:
         * (1) hide 'viewed' badges
         * (2) show newly arrived badges
         * (3) update badge's value
         *
         * @private
         */
        var emitUnreadEvents = function() {
            MODEL.forEach(function(item) {
                bus.publish('lpBadgesUnread.' + item.type, item.unread);
            });
        };

        /**
         * Emit event -- to update server with new read items
         *
         * @param clientData
         * @private
         */
        var emitReadNotificationEvent = function(clientData) {
            bus.publish('lpBadgesReadNotify', clientData);
        };

        /**
         * Handle arrived data (from server or after local updates):
         * ---------------------------------------------------------
         * (1) update MODEL
         * (2) emit 'refresh' events to widgets
         *
         * @param data
         */
        var handleData = function(data) {
            if (!inputDataValid(data)) {
                return false;
            }

            updateEntireCollection(data);
            emitUnreadEvents();
        };

        /**
         * Update MODEL with new value of respective badges type
         * and emit 'refresh' inner events
         *
         * @param clientData
         * @private
         */
        var handleUpdate = function(clientData) {
            MODEL.forEach(function(item) {
                if (item.type === clientData.type) {
                    item.unread = clientData.delta === 0 ? 0 : item.unread - clientData.delta;
                }
            });

            // let know widgets about changes to re-draw badges
            emitUnreadEvents();
        };

        /**
         * Handle arrived client-side data:
         * --------------------------------
         * (1) update respective MODEL's item
         * (2)
         *
         * @param clientData
         */
        var handleClientUpdate = function(clientData) {
            if (!inputClientDataValid(clientData)) {
                return false;
            }

            handleUpdate(clientData);
            emitReadNotificationEvent(clientData);
        };

        // LISTENING FOR OUTER EVENTS
        bus.subscribe('lpBadgesUnreadServer', handleData); // from server
        bus.subscribe('lpBadgesRead', handleClientUpdate); // from widgets

        return {
            getMainModel: function() { return MODEL; }
        };
    };
});
