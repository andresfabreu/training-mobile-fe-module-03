/**
 * Factories
 * @module factories
 */
define(function(require, exports) {

    'use strict';

    var generateUUID = window.lp && window.lp.util && window.lp.util.generateUUID; // to be refactored

    var getLoggedInUserId = function() {
        return window.b$ && window.b$.portal && window.b$.portal.loggedInUserId;
    };

    /* Data shared between controllers */

    // @ngInject
    exports.SharedData = function(lpCoreUtils) {
        var util = lpCoreUtils;
        // Parses DN (Distinguished Name) value and returns CN (Common Name) value
        var resolveDisplayName = function(x500value) {
            var regExp = /CN=([^,]+)/i;
            if (regExp.test(x500value)) {
                var match = regExp.exec(x500value);
                return match[1];
            } else {
                return x500value;
            }
        };

        var findIndexById = function(list, id) {
            var index = -1;
            util.forEach(list, function(item) {
                if (item.id === id) {
                    index = list.indexOf(item);
                    return index;
                }
            });
            return index;
        };

        var add = function(list, item) {
            var index = findIndexById(list, item.id); // since item can be updated, and changed
            if (index !== -1) {
                list[index] = item; // if found, update
            } else {
                list.unshift(item); // if not found, add
            }
        };

        var remove = function(list, item) {
            var index = findIndexById(list, item.id);
            if (index !== -1) { // letter found
                list.splice(index, 1);
            }
        };

        /* Indicator if inbox contains at least a single item */
        var isInboxEmpty = function() {
            return this.threads.unread.length === 0 &&
                this.threads.read.length === 0 &&
                this.draftLetters.length === 0 &&
                this.threads.archived.length === 0;
        };

        return {
            // Thread containers
            threads: {unread: [], read: [], archived: []},
            draftLetters: [],
            addToList: add,
            removeFromList: remove,
            // Read/Create message data
            selectedThread: null,
            editLetter: null,
            // Alerts
            alerts: [],
            // Flags
            loading: false,
            editLetterInd: false,
            // Helpers (might move to separate service?)
            resolveDisplayName: resolveDisplayName,
            isInboxEmpty: isInboxEmpty
        };
    };

    /* Thread - Message container of sent items */
    // @ngInject
    exports.Thread = function($resource, lpWidget, lpCoreUtils) {
        var util = lpCoreUtils;
        var endpoint = util.resolvePortalPlaceholders(lpWidget.getPreference('threadSrc'));
        return $resource(endpoint, {}, {
                    queryActive: {method: 'GET', params: {}, isArray: true},
                    queryArchived: {method: 'GET', params: {status: 'archived'}, isArray: true},
                    querySent: {method: 'GET', params: {status: 'sent'}, isArray: true},
                    messages: {method: 'GET', params: {threadId: '@id', itemType: 'messages'}, isArray: true},
                    letters: {method: 'GET', params: {threadId: '@id', itemType: 'letters'}, isArray: true},
                    remove: {method: 'DELETE', params: {threadId: '@id'}},
                    archive: {method: 'POST', params: {threadId: '@id', action: 'archive_thread_request'}}
        });
    };

    /* Message - a sent item in a thread */
    // @ngInject
    exports.Message = function($resource, lpWidget, lpCoreUtils) {
        var util = lpCoreUtils;
        var endpoint = util.resolvePortalPlaceholders(lpWidget.getPreference('threadSrc'));
        return $resource(endpoint, {}, {
            markAsRead: {method: 'POST', params: {threadId: '@threadId', itemType: 'messages', itemId: '@id', action: 'read_message_request'}}
        });
    };

    /* Letter - a newly created or unsent item */
    // @ngInject
    exports.Letter = function($resource, lpWidget, lpCoreUtils) {
        var util = lpCoreUtils;
        var endpoint = util.resolvePortalPlaceholders(lpWidget.getPreference('letterSrc'));
        var Letter = $resource(endpoint, {}, {
                query: {method: 'GET', params: {action: 'drafts'}, isArray: true},
                save: {method: 'PUT', params: {action: 'save', letterId: '@id'}},
                send: {method: 'POST', params: {action: 'send', letterId: '@id'}},
                remove: {method: 'DELETE', params: {action: 'delete', letterId: '@id'}},
                respond: {method: 'PUT', params: {action: 'response', threadId: '@threadId', letterId: '@id'}}
        });
        Letter.create = function() {
            return new Letter({
                id: generateUUID(),
                sender: getLoggedInUserId()
            });
        };
        return Letter;
    };
});
