define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.ContactsController = function($scope, $timeout, lpWidget, ContactsModel, AccountsModel, lpTransactions, $filter, i18nUtils, customerId, lpCoreBus, lpCoreUtils) {
        var ALERT_TIMEOUT = 3000;

        var bus = lpCoreBus;
        var widget = lpWidget;

        var loadContacts = function() {
            $scope.contactsModel.loadContacts().error(function() {
                $scope.addAlert('SERVICE_UNAVAILABLE', 'error', false);
            });
        };

        // Initialize
        var initialize = function() {
            var pref = {
                contacts: lpCoreUtils.resolvePortalPlaceholders(widget.getPreference('contactListDataSrc')),
                contactData: lpCoreUtils.resolvePortalPlaceholders(widget.getPreference('contactDataSrc')),
                contactDetails: lpCoreUtils.resolvePortalPlaceholders(widget.getPreference('contactDetailsDataSrc')),
                locale: widget.getPreference('locale'),
                lazyload: true // Load manually later, so we can observe for failures
            };
            $scope.contactsModel = new ContactsModel(pref);

            i18nUtils.loadMessages(widget, $scope.locale).success(function(bundle) {
                $scope.messages = bundle.messages;
            });

            $scope.contactsModel.disableSelection = false;
            $scope.title = widget.getPreference('title');

            loadContacts();

            bus.subscribe('launchpad.contacts.load', function(){
                $timeout(function() {
                    loadContacts();
                });
            });
        };

        //this is only called lazily when required
        var initializeTransactions = function() {

            if(!$scope.accountsModel) {
                $scope.accountsModel = AccountsModel;
                $scope.accountsModel.setConfig({
                    accountsEndpoint: '$(contextPath)/services/rest/v1/debit-accounts',
                    filter: 'cards'
                });
            }

            if(!$scope.lpTransactions) {
                $scope.lpTransactions = lpTransactions.api();
            }

        };

        // View helpers
        var resetAvailableFormFields = function() {
            $scope.contactFields = [];
            var model = $scope.contactsModel.currentDetails;

            lpCoreUtils.forEach($scope.allContactFields, function(field) {
                var key = field.key;
                if ( !model.hasOwnProperty(key) || model[key] === null ) {
                    $scope.contactFields.push(field);
                }
            });
        };

        // Switch to contactsView, contactsEdit, contactsAdd
        $scope.contactChangeView = function(view) {
            if($scope.contactsModel.moduleState !== view) {
                $scope.contactsModel.moduleState = view;

                if ( view === 'contactsEdit' || view === 'contactsAdd' ) {
                    resetAvailableFormFields();
                }
            }
            // disable the ability to switch contacts while editing or adding
            $scope.contactsModel.disableSelection = view !== 'contactsView' ? true : false;
        };

        // Add Contact Button
        $scope.addContact = function() {

            if (!$scope.contactsModel.disableSelection) {

                var uuid = lpCoreUtils.generateUUID();
                var self = $scope.contactsModel;

                self.selected = null;

                $scope.copyCurrentContact();

                initializeTransactions();

                // create empty contact
                self.currentContact = { 'photoUrl': null, 'partyId': customerId, 'id': uuid, 'name': '', 'account': '', isNew: true };
                self.currentDetails = { 'id': uuid };

                $scope.contactChangeView('contactsAdd');
            }
        };

        var contactSelected = function(contact) {
            var accountsModel = $scope.accountsModel;
            var accountsModelCollection = accountsModel.accounts;
            var defaultAccount = accountsModel.findByAccountNumber(widget.getPreferenceFromParents('defaultAccount'));

            //if default account hasn't already been set, set them now
            if($scope.defaultAccount === undefined) {
                $scope.defaultAccount = defaultAccount ? defaultAccount : accountsModelCollection[0];
                accountsModel.selected = defaultAccount ? defaultAccount : accountsModelCollection[0];
            }

            //Filter out transactions for this particular contact
            if(accountsModelCollection && accountsModelCollection.length > 0) {
                $scope.lpTransactions.setFilters({
                    contact: contact.account
                });
                $scope.lpTransactions.loadTransactions($scope.defaultAccount);
            }
            $scope.$broadcast('contactSelected', contact);
        };

        var showTransactionsForContact = function(contact) {

            //show trannsaction details
            initializeTransactions();
            if (!$scope.accountsModel.accounts.length) {
                var accountsPromise = $scope.accountsModel.load();
                accountsPromise.then(function() {
                    contactSelected(contact);
                });
            } else {
                contactSelected(contact);
            }
        };

        $scope.selectContact = function(contact) {
            $scope.contactsModel.selectContact(contact);
            // new contacts without an account are possible here
            // initializeTransactions(); //fix one error for LPES-3489
            if(contact.account || contact.email) {
                showTransactionsForContact(contact);
            } else {
                $scope.lpTransactions.clearTransactionsList();
            }
            $scope.$broadcast('contactSelected', contact);
        };

        $scope.launchTransactionsForContact = function(contact) {

            bus.publish('launchpad-retail.transactions.applyFilter', {
                contactName: contact.name,
                filters: {
                    contact: contact.account
                }
            });
        };

        var validateDetails = function(model) {
            var valid = true;
            $scope.errors = {};

            lpCoreUtils.forEach($scope.allContactFields, function(field) {
                var key = field.key,
                    value = model[key];

                if (field.validate && value) {
                    var error = field.validate(value);
                    if ( error ) {
                        $scope.errors[key] = error;
                        valid = false;
                    }
                }
            });

            return valid;
        };

        $scope.alert = {
            messages: {
                SAVED_SUCCESSFULLY: 'Contact was saved successfully.',
                SAVED_ERROR: 'There was an error while saving contact.',
                SERVICE_UNAVAILABLE: 'Unfortunately, this service is unavailable.'
            }
        };

        /**
         * Alerts
         */
        $scope.alerts = [];

        $scope.addAlert = function(code, type, timeout) {
            var alert = {
                type: type || 'error',
                msg: $scope.alert.messages[code]
            };

            $scope.alerts.push(alert);

            if (timeout !== false) {
                $timeout(function() {
                    $scope.closeAlert($scope.alerts.indexOf(alert));
                }, ALERT_TIMEOUT);
            }
        };

        // Remove specific alert
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        // Clear arr alert messages
        $scope.clearAlerts = function() {
            $scope.alerts = [];
        };

        $scope.submitContact = function(isFormValid) {
            if (!validateDetails($scope.contactsModel.currentDetails) || !isFormValid) {
                return false;
            }

            var xhr;
            if ($scope.contactsModel.currentContact.isNew) {
                xhr = $scope.contactsModel.createContact(isFormValid);
            } else {
                xhr = $scope.contactsModel.updateContact(isFormValid);
            }

            xhr.success(function(response) {
                $scope.contactsModel.currentContact.isNew = false;
                showTransactionsForContact($scope.contactsModel.currentContact);
                $scope.addAlert('SAVED_SUCCESSFULLY', 'success');
            }).error(function(data) {
                $scope.addAlert('SAVED_ERROR', 'error');
            });

        };

        var resetDetailsData = function(data) {
            var index = -1;

            for (var i = 0, n = $scope.contactsModel.contactDetailsData.length; i < n; i++) {
                var details = $scope.contactsModel.contactDetailsData[i];
                if (details.id === data.id) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                $scope.contactsModel.contactDetailsData[i] = lpCoreUtils.clone(data);
            }
        };

        $scope.cancelForm = function() {

            if ($scope.contactsModel.moduleState === 'contactsAdd') {
                if($scope.contactsModel.originalContact) {
                    $scope.contactsModel.currentContact = $scope.contactsModel.originalContact;
                } else {
                    $scope.contactsModel.currentContact = null;
                }
                $scope.contactChangeView('contactsView');
            } else if ($scope.contactsModel.moduleState === 'contactsEdit') {
                $scope.contactsModel.currentContact = $scope.contactsModel.originalContact;
                resetDetailsData($scope.contactsModel.originalDetails);

                $scope.contactsModel.contacts[$scope.contactsModel.idx] = $scope.contactsModel.originalContact;
                $scope.contactChangeView('contactsView');
            } else {
                $scope.contactChangeView('contactsNone');
            }
            $scope.contactsModel.refreshModel();
        };

        // Edit Contact Button
        $scope.editContact = function() {
            $scope.copyCurrentContact();
            $scope.contactChangeView('contactsEdit');
        };

        // Add form field
        $scope.addFormField = function(key) {
            if (!$scope.contactsModel.currentDetails) {
                $scope.contactsModel.currentDetails = { 'id': $scope.contactsModel.currentContact.id };
            }
            if (!$scope.contactsModel.currentDetails[key]) {
                $scope.contactsModel.currentDetails[key] = '';
           }
           resetAvailableFormFields();
        };

        // remove a form field
        $scope.deleteFormField = function(field) {
            delete $scope.contactsModel.currentDetails[field];
            resetAvailableFormFields();
        };

        $scope.canAddFields = function() {
            return $scope.contactFields.length > 0;
        };

        // move to controller
        $scope.copyCurrentContact = function() {
            $scope.contactsModel.originalContact = lpCoreUtils.clone($scope.contactsModel.currentContact);
            $scope.contactsModel.originalDetails = lpCoreUtils.clone($scope.contactsModel.currentDetails);
        };

        $scope.filterContactData = function(obj) {
            var result = {};
            var detailFields = [
                'address',
                'city',
                'state',
                'dateOfBirth',
                'email',
                'phone'
            ];

            lpCoreUtils.forEach(obj, function(value, key){
                if (value !== null) {
                    detailFields.forEach( function(fieldName) {
                        if (fieldName === key) {
                            result[key] = value;
                        }
                    });
                }
            });
            return result;
        };

        // list of fields to appear in dropdown
        // TODO: populate list from metadata API
        $scope.allContactFields = [
            { 'text': 'Phone', 'key': 'phone', validate: function(value) {
                // Allow phone numbers in these formats: +XX-XXXX-XXXX, +XX.XXXX.XXXX, +XX XXXX XXXX
                var phoneno = /^\+?([0-9]{2})\)?[\-. ]?([0-9]{4})[\-. ]?([0-9]{4})$/;
                return value.match(phoneno) ? false : 'Phone number must have 10 digits.';
            }},
            { 'text': 'E-mail', 'key': 'email' },
            { 'text': 'Birthday', 'key': 'dateOfBirth' },
            { 'text': 'Address', 'key': 'address' },
            { 'text': 'City', 'key': 'city' },
            { 'text': 'State', 'key': 'state' }
        ];
        $scope.contactFields = [];

        $scope.$watch('contactsModel.moduleState', function(value) {
            if(value) {
                $scope.contactsModel.template = 'templates/' + value + '.html';
            }
        });

        $scope.$watch('contactsModel.contacts', function(value) {
            if (value.length > 0) {
                $scope.contactsModel.moduleState = 'contactsView';

                if($scope.waitToLoadContactPromise) {
                    $timeout.cancel($scope.waitToLoadContactPromise);
                }

                if ($scope.widgetSize === 'large') {
                    $scope.waitToLoadContactPromise = $timeout(function() {
                        if ($scope.contactsModel.currentContact) {
                            $scope.selectContact($scope.contactsModel.currentContact);
                        } else {
                            $scope.selectContact($scope.contactsModel.contacts[0]);
                        }
                    }, 300);
                }
            } else {
                $scope.contactsModel.moduleState = 'contactsNone';
            }
        });

        /*$scope.$watch('contactsModel.currentContact', function(value) {
            if(value) {
                if($scope.waitToLoadContactPromise) {
                    $timeout.cancel($scope.waitToLoadContactPromise);
                }
                $scope.waitToLoadContactPromise = $timeout(function() {
                    console.log("in this strange watcher");
                    $scope.selectContact($scope.contactsModel.currentContact);
                }, 300);
            }
        });*/

        $scope.decodePhotoUrl = function(photoUrl) {
            return photoUrl ? decodeURIComponent(photoUrl) : lpCoreUtils.defaultProfileImage;
        };

        // Search by name and account number
        $scope.$watch('search', function(value){

            $scope.filteredContacts = [];

            if (value) {

                $scope.filter = true;
                var searchString = value.toLowerCase();

                lpCoreUtils.forEach($scope.contactsModel.contacts, function(contact) {
                    if (lpCoreUtils.isString(contact.name)) {
                        var contactName = contact.name.toLowerCase();
                        var accountNumber = lpCoreUtils.isString(contact.account) ? contact.account.toLowerCase() : '';

                        if(contactName.indexOf(searchString) !== -1 || accountNumber.indexOf(searchString) !== -1) {
                            $scope.filteredContacts.push(contact);
                        }
                    }
                });

                // select top contact when filtering
                if ($scope.widgetSize === 'large') {
                    if($scope.waitToLoadContactPromise) {
                        $timeout.cancel($scope.waitToLoadContactPromise);
                    }
                    $scope.waitToLoadContactPromise = $timeout(function() {
                        if ($scope.filteredContacts.length){
                            $scope.selectContact($scope.filteredContacts[0]);
                        }
                    }, 300);
                }
            } else {
                $scope.filter = false;
                if ($scope.contactsModel.contacts.length && $scope.widgetSize === 'large') {
                    $scope.selectContact($scope.contactsModel.contacts[0]);
                }
            }
        }, true);

        // Responsive
        $scope.responsiveRules = [
            { max: 200, size: 'tile' },
            { min: 201, max: 400, size: 'small' },
            { min: 401, size: 'large' }
        ];

        widget.addEventListener('preferencesSaved', function () {
            widget.refreshHTML();
            initialize();
        });

        $scope.widgetReset = function(widgetName) {
            if($scope.search) {
                $scope.search = '';
            }
            if ($scope.contactsModel.moduleState === 'contactsEdit' || $scope.contactsModel.moduleState === 'contactsAdd') {
                $scope.cancelForm();
            }
        };

        $scope.disableEnterSubmit = function($event) {
            if($event && $event.which === 13) {
                $event.preventDefault();
                return;
            }
        };

        initialize();
    };


    // @ngInject
    exports.ContactsPaymentController = function($scope, lpPayments, lpCoreBus, lpCoreUtils) {
        var bus = lpCoreBus;
        var PaymentOrderModel = lpPayments.api();
        $scope.paymentOrder = PaymentOrderModel.createModel();

        $scope.resetPaymentOrder = function(contact) {
            //This function is called when a new contact is added, when a new contact is selected, and when a transfer is complete
            var name, account;
            if(contact !== undefined) {
                name = contact.name;
                account = contact.account;
            } else {
                //if no contact has been passed, use original values for name and account.
                //they will either stay the same or they will change when another contact is selected
                name = $scope.paymentOrder.counterpartyName;
                account = $scope.paymentOrder.counterpartyIban;
            }
            $scope.paymentOrderForm.submitted = false;

            $scope.paymentOrder.uuid = lpCoreUtils.generateUUID();
            $scope.paymentOrder.dateOptions = 'today';
            $scope.paymentOrder.paymentMode = 'NON_RECURRING';
            $scope.paymentOrder.onDate = +(new Date());
            $scope.paymentOrder.counterpartyIban = account;
            $scope.paymentOrder.counterpartyAccount = name;
            $scope.paymentOrder.counterpartyName = name;
            $scope.paymentOrder.accountName = name;
            $scope.paymentOrder.type = 'INTERNAL';
        };

        $scope.$on('contactSelected', function(event, contact) {
            $scope.resetPaymentOrder(contact);
        });

        $scope.submitPayment = function() {
            var xhr, paymentOrder, selectedAccount;

            $scope.paymentOrderForm.submitted = true;
            if($scope.paymentOrderForm.$invalid) {
                return false;
            }

            paymentOrder = $scope.paymentOrder;
            selectedAccount = $scope.accountsModel.selected;

            $scope.resetPaymentOrder();

            $scope.paymentOrder.accountId = selectedAccount.id;
            $scope.paymentOrder.instructedCurrency = selectedAccount.currency;

            xhr = paymentOrder.createOrder(paymentOrder);

            xhr.then(function(res) {
                bus.publish('launchpad-retail.paymentOrderInitiated', {paymentId: paymentOrder.id});
            }, function(err) {
                console.log('Server error: ' + err.statusText);
            });
        };
    };
});
