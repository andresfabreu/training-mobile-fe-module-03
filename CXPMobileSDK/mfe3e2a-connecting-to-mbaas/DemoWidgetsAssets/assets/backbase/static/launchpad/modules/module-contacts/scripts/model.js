define( function (require, exports, module) {
    'use strict';

    // @ngInject
    exports.ContactsModel = function($http, orderByFilter, lpCoreUtils, lpDefaultProfileImage) {
        /**
         * Contacts service constructor
         * @param config
         * @constructor
         */
        var ContactsModel = function(config) {
            config = config || {};
            this.defaults = {
                locale: config.locale,
                contactListEndpoint: config.contacts,
                contactDataServiceEndpoint: config.contactData,
                contactDetailsServiceEndpoint: config.contactDetails,
                metaDataEndpoint: config.metaData
            };

            this.locale = config.locale;
            if (config.contactDetails) {
                this.contactDetailsData = [];
            }
            this.contacts = [];

            if (!config.lazyload) {
                this.loadContacts();
            }
        };

        /**
         * Load contacts
         */
        ContactsModel.prototype.loadContacts = function() {
            var self = this;
            var request = $http.get(this.defaults.contactListEndpoint);

            this.loading = true;

            request.success(function(contacts) {
                if (contacts && contacts !== 'null') {
                    self.contacts = self.preprocessContacts(contacts);
                }
                else {
                    self.contacts = [];
                }
            });

            request.error(function(error) {
                self.error = {
                    message: error.statusText
                };

            });
            request['finally'](function() {
                self.loading = false;
            });

            return request;
        };

        /**
         * Load details
         * @returns {*}
         */
        ContactsModel.prototype.loadContactDetails = function(contactUUID) {
            var self = this;

            // check if contact details exist on clientside
            if (this.contactDetailsData.length > 0) {
                lpCoreUtils.forEach(this.contactDetailsData, function(contact) {
                    if (contact && contact.id === contactUUID) {
                        self.currentDetails = contact;

                        // set loaded from client side
                        self.detailsLoaded = true;
                        return;
                    }
                });
            }

            // Check if details are already loaded from clientside
            if (this.detailsLoaded) {
                this.detailsLoaded = false;
            // else get details from serverside
            }
            else {
                this.loading = true;

                var request = $http({
                    url: this.defaults.contactDetailsServiceEndpoint,
                    method: 'GET',
                    params: {
                        contactId: contactUUID
                    }
                });
                request.success(function(data) {
                    self.currentDetails = data;
                    self.contactDetailsData.push(self.currentDetails);
                });
                request.error(function(data) {
                    self.error = {
                        message: data.statusText
                    };
                });
                request['finally'](function() {
                    self.loading = false;
                });

                return request;
            }
        };

        /**
         * Modify contact data and sort
         * @param contacts
         * @returns {*}
         */
        ContactsModel.prototype.preprocessContacts = function(contacts) {
            // TODO: add ticket for serverside to return alphabetical contacts
            return orderByFilter(contacts, 'name');
        };

        /**
         * Create contact
         * @param valid
         * @returns {*}
         */
        ContactsModel.prototype.createContact = function(valid) {
            if (!valid) {
                return false;
            }

            var self = this;
            var contactId = this.currentContact.id;
            var params = {
                contactId: contactId
            };

            this.currentContact.photoUrl = lpDefaultProfileImage(this.currentContact.name, 77, 77);

            this.sendXhrRequest($http({
                method: 'POST',
                url: this.defaults.contactDataServiceEndpoint,
                params: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: lpCoreUtils.buildQueryString(this.currentContact)
            }));

            var detailsCallback = function() {
                self.contacts.push(self.currentContact);
                self.contactDetailsData.push(self.currentDetails);
                self.refreshModel();
            };

            return this.sendXhrRequest($http({
                method: 'POST',
                url: this.defaults.contactDetailsServiceEndpoint,
                params: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: lpCoreUtils.buildQueryString(this.currentDetails)
            }), detailsCallback);
        };

        /**
         * Creates a counter party via the newest version of the counter parties REST API
         * @param valid
         * @returns {*}
         */
        ContactsModel.prototype.createCounterParty = function(valid) {
            if(!valid) {
                return false;
            }

            var self = this;
            var detailsCallback = function() {
                self.contacts.push(self.currentContact);
            };

            return this.sendXhrRequest($http({
                method: 'POST',
                url: this.defaults.contactListEndpoint,
                data: lpCoreUtils.buildQueryString(this.currentContact)
            }), detailsCallback);
        };

        /**
         * Update contact
         * @param valid
         * @returns {*}
         */
        ContactsModel.prototype.updateContact = function(valid) {
            if (!valid) {
                return false;
            }

            var self = this;
            var currentId = self.currentContact.id;

            // remove extra contact fields before sending request
            var cleanData = function(allowedFields, obj) {
                var result = {};

                lpCoreUtils.forEach(obj, function(value, key){
                    lpCoreUtils.forEach(allowedFields, function(fieldName) {
                        if (fieldName === key) {
                            result[key] = value;
                        }
                    });
                });

                return result;
            };

            var addEmptyFields = function(allowedFields, obj) {
                lpCoreUtils.forEach(allowedFields, function(key) {
                    if(!obj[key]) {
                        obj[key] = null;
                    }
                });

                return obj;
            };

            // TODO: check if name || account is $dirty

            // update contact data
            if (self.currentContact.photoUrl === undefined ) {
                self.currentContact.photoUrl = lpDefaultProfileImage(self.currentContact.name, 77, 77);
            }

            var contactFields = [
                'name',
                'id',
                'photoUrl',
                'partyId',
                'account'
            ];
            var cleanContactData = cleanData(contactFields, self.currentContact);
            var contactCallback = function() {
                self.contacts[self.index] = self.currentContact;
                self.refreshModel();
            };

            this.sendXhrRequest($http({
                method: 'PUT',
                url: this.defaults.contactDataServiceEndpoint,
                params: {
                    contactId: currentId
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: lpCoreUtils.buildQueryString(cleanContactData)
            }), contactCallback);

            // TODO: check if detail fields are $dirty
            var detailFields = [
                'address',
                'city',
                'state',
                'dateOfBirth',
                'email',
                'phone',
                'id'
            ];
            var cleanDetailsData = cleanData(detailFields, self.currentDetails);
            var fullDetailsData = addEmptyFields(detailFields, cleanDetailsData);
            var detailsCallback = function() {
                // replace clientside contact data with new data
                if (self.contactDetailsData.length > 0) {
                    lpCoreUtils.forEach(self.contactDetailsData, function(contact) {
                        if (contact && contact.id === currentId) {
                            contact = cleanDetailsData;
                            self.currentDetails = contact;
                            return;
                        }
                    });
                }
            };

            return this.sendXhrRequest($http({
                method: 'PUT',
                url: this.defaults.contactDetailsServiceEndpoint,
                params: {
                    contactId: currentId
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: lpCoreUtils.buildQueryString(fullDetailsData)
            }), detailsCallback);
        };


        /**
         * Delete contact
         * @returns {*}
         */
        ContactsModel.prototype.deleteContact = function() {
            var self = this;
            var ccid = self.currentContact.id;
            var successCallback = function(cid) {
                // remove contact from client side data
                lpCoreUtils.forEach(self.contacts, function(contact) {
                    if(contact && contact.id === cid) {
                        var index = self.contacts.indexOf(contact);
                        self.contacts.splice(index, 1);
                    }
                });

                if (self.contacts.length > 0) {
                    self.currentContact = self.contacts[0];
                } else {
                    self.currentContact = null;
                    self.moduleState = 'contactsNone';
                }
                self.refreshModel();
            };

            this.sendXhrRequest($http({
                method: 'DELETE',
                url: this.defaults.contactDataServiceEndpoint,
                params: {
                    contactId: ccid
                }
            }), successCallback(ccid));
        };

        /**
         * Displays if no contacts found
         * @returns {*}
         */
        ContactsModel.prototype.noContactsFound = function() {
            var noContactsFound = !this.loading && this.contacts.length === 0;
            return noContactsFound;
        };

        /**
         * Send xhr request
         * @param xhr
         * @returns {*}
         */
        ContactsModel.prototype.sendXhrRequest = function(xhr, callback) {
            var self = this;

            xhr.loading = true;
            xhr.success(function(data) {
                if (lpCoreUtils.isFunction(callback)) {
                    callback();
                }
            });
            xhr.error(function(data) {
                self.error = {
                    message: data.statusText
                };
            });
            xhr['finally'](function() {
                xhr.loading = false;
            });

            return xhr;
        };


        // move to controller
        /**
         * Select Contact
         * @param contact
         */
        ContactsModel.prototype.selectContact = function(contact) {
            if (contact && !this.disableSelection) {
                if (this.contacts.length > 0) {
                    this.selected = contact.id;
                    this.currentContact = contact;
                    this.idx = this.contacts.indexOf(this.currentContact);
                    this.loadContactDetails(this.currentContact.id);
                } else {
                    this.currentContact = null;
                    this.moduleState = 'contactsNone';
                }
            }
        };

        /**
         * Refresh Model
         * @param method
         */
        ContactsModel.prototype.refreshModel = function(method) {
            this.disableSelection = false;

            if (this.currentContact) {
                this.selectContact(this.currentContact);
                this.moduleState = 'contactsView';
            }
        };

        /**
         * Find a contact by name.
         * @param method
         */
        ContactsModel.prototype.findByName = function(name) {
            return lpCoreUtils.find(this.contacts, { name: name });
        };

        return ContactsModel;
    };
});
