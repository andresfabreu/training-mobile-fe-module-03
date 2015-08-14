define(function(require, exports, module) {
    'use strict';

    function applyScope($scope) {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    }

    var $ = window.jQuery;

    // @ngInject
    exports.NewTransferController = function($scope, $rootScope, $rootElement, $timeout, lpCoreUtils, lpCoreBus, AccountsModel, ContactsModel, CurrencyModel, IbanModel, lpWidget, i18nUtils, customerId, formDataPersistence, P2PService, transferTypes, lpPayments, lpUIResponsive, lpCoreUpdate) {
        $scope.errors = {};

        var widget = lpWidget;
        var PaymentOrderModel = lpPayments.api();
        // Wheter to auto save new contacts
        var autoSave = widget.getPreference('autosaveContactsPreference');

        var formName = 'new-transfer-form';

        var paymentIntervals = {
            RECURRING: 'RECURRING',
            NON_RECURRING: 'NON_RECURRING'
        };

        /**
         * Regular function
         */

        //is the recipient a new contact?
        var isNewContact = function() {
            if ($scope.contactsModel.findByName($scope.paymentOrder.counterpartyName)) {
                return false;
            }
            return (!$scope.paymentOrder.selectedCounter ||
                $scope.paymentOrder.selectedCounter.name !== $scope.paymentOrder.counterpartyName ||
                $scope.paymentOrder.selectedCounter.account !== $scope.paymentOrder.counterpartyIban);
        };

        // Create a contact if this user's preference
        var createContact = function() {

            var contact = {
                name: $scope.paymentOrder.counterpartyName
            };

            if($scope.paymentOrder.type === $scope.poTypeEnum.bank) {
                contact.account = $scope.usTransfer ? $scope.paymentOrder.counterpartyAccount : $scope.paymentOrder.counterpartyIban;
            } else if($scope.paymentOrder.type === $scope.poTypeEnum.p2pEmail) {
                contact.email = $scope.paymentOrder.counterpartyEmail;
            }

            $scope.contactsModel.currentContact = contact;

            $scope.contactsModel.createCounterParty(true);
            lpCoreBus.publish('launchpad.contacts.load');
        };

        //reset the payment order model
        var resetModel = function() {

            //fix to reset isScheduledTransfer to correct value
            var scheduledTransfer = $scope.paymentOrder ? $scope.paymentOrder.isScheduledTransfer : false;

            $scope.paymentOrder = {
                update: false,
                uuid: generateUUID(),
                dateAllOptions: [
                    { id: 'today', label: 'Transfer today' },
                    { id: 'date', label: 'Scheduled transfer' }
                ],
                dateOptions: 'today',
                isScheduledTransfer: scheduledTransfer,
                scheduledTransfer: {
                    frequency: '',
                    every: 1,
                    intervals: [],
                    startDate: new Date(),
                    endDate: new Date(),
                    timesToRepeat: 1
                },
                urgentTransfer: false,
                scheduleDate: new Date(),
                isOpenDate: false,
                instructedCurrency: '',
                counterpartyIban: '',
                counterpartyAccount: '',
                counterpartyEmail: '',
                counterpartyAddress: '',
                instructedAmount: '',
                paymentReference: '',
                paymentDescription: '',
                counterpartyName: '',
                date: '',
                saveContact: autoSave === '' ? false : lpCoreUtils.parseBoolean(autoSave),
                type: $scope.poTypeEnum.bank,
                dirty: false
            };
        };

        //set which transfer tab is currently active
        var setActiveTransferTabs = function() {

            //set all tabs active to false
            for(var tab in $scope.activeTransferTab) {
                if($scope.activeTransferTab.hasOwnProperty(tab)) {
                    $scope.activeTransferTab[tab] = false;
                }
            }

            var found = false;

            for(var item in $scope.poTypeEnum) {
                if($scope.poTypeEnum.hasOwnProperty(item)) {
                    if($scope.poTypeEnum[item] === $scope.paymentOrder.type) {
                        $scope.activeTransferTab[item] = true;
                        found = true;
                    }
                }
            }

            if(!found) {
                $scope.activeTransferTab.bank = true;
            }
        };

        //broadcaste a message for child scopes to reset their properties
        var resetChildScopes = function() {
            $scope.$broadcast('reset', {});
        };

        var checkValidAccounts = function() {

            if($scope.paymentOrderForm.counterpartyIban && $scope.paymentOrder.type === $scope.poTypeEnum.bank) {
                $scope.paymentOrderForm.counterpartyIban.$setValidity('notEqual', $scope.notEqualAccounts());
            }
        };


        //build the payment order with details needed for a bank transaction
        var buildBankPaymentOrder = function(paymentOrder) {
            paymentOrder.type = $scope.poTypeEnum.bank;

            if($scope.usTransfer) {

                paymentOrder.counterpartyAccount = $scope.paymentOrder.counterpartyAccount;

                if ($scope.paymentOrder.paymentDescription !== '') {
                    paymentOrder.paymentDescription = $scope.paymentOrder.paymentDescription;
                }
            } else {
                paymentOrder.counterpartyIban = $scope.paymentOrder.counterpartyIban;

                //set payment reference OR payment description
                if ($scope.paymentOrder.paymentReference === '' && $scope.paymentOrder.paymentDescription !== '') {
                    paymentOrder.paymentDescription = $scope.paymentOrder.paymentDescription;
                } else if ($scope.paymentOrder.paymentDescription === '' && $scope.paymentOrder.paymentReference !== '') {
                    paymentOrder.paymentReference = $scope.paymentOrder.paymentReference;
                }
            }

            //handle scheduled transfer
            if($scope.paymentOrder.isScheduledTransfer) {
                paymentOrder.scheduledTransfer = {};

                //add relevent scheduledTransfer fields
                paymentOrder.scheduledTransfer.frequency = $scope.paymentOrder.scheduledTransfer.frequency;
                paymentOrder.scheduledTransfer.every = $scope.paymentOrder.scheduledTransfer.every;

                //send array as comma-delimited string to the backend service (due to issue with camel mashup)
                paymentOrder.scheduledTransfer.intervals = $scope.paymentOrder.scheduledTransfer.intervals.join(',');
                paymentOrder.scheduledTransfer.startDate = +(new Date($scope.paymentOrder.scheduledTransfer.startDate));
                paymentOrder.scheduledTransfer.endDate = +(new Date($scope.paymentOrder.scheduledTransfer.endDate));
                paymentOrder.paymentMode = paymentIntervals.RECURRING;
            } else {
                paymentOrder.onDate = +(new Date($scope.paymentOrder.scheduleDate));
                paymentOrder.paymentMode = paymentIntervals.NON_RECURRING;
                paymentOrder.urgentTransfer = $scope.paymentOrder.urgentTransfer;
            }

            return paymentOrder;
        };

        //build the payment order with details needed for a P2P transfer
        var buildP2PEmailPaymentOrder = function(paymentOrder) {
            paymentOrder.type = $scope.poTypeEnum.p2pEmail;
            paymentOrder.onDate = +(new Date($scope.paymentOrder.scheduleDate));
            paymentOrder.paymentMode = paymentIntervals.NON_RECURRING;
            paymentOrder.counterpartyEmail = $scope.paymentOrder.counterpartyEmail;

            return paymentOrder;
        };

        //build the payment order with details needed for a P2P address transfer
        var buildP2PAddressPaymentOrder = function(paymentOrder) {
            paymentOrder.type = $scope.poTypeEnum.p2pAddress;
            paymentOrder.onDate = +(new Date($scope.paymentOrder.scheduleDate));
            paymentOrder.paymentMode = paymentIntervals.NON_RECURRING;
            paymentOrder.counterpartyAddress = $scope.paymentOrder.counterpartyAddress;

            return paymentOrder;
        };

        var initialize = function() {

            var partialsDir = lpCoreUtils.getWidgetBaseUrl(widget) + '/partials';
            $scope.mediaDir = lpCoreUtils.getWidgetBaseUrl(widget) + '/media';

            $scope.todaysDate = new Date();

            /**
             * Manage transfer type to hide/show certain parts of the form
             */
            $scope.poTypeEnum = transferTypes;

            $scope.p2pService = P2PService;

            $scope.p2pService.getUserEnrollmentDetails().then(function(response) {
                $scope.userEnrolledForP2P = true;
            }, function(response) {

                lpCoreBus.subscribe('launchpad-retail.userP2PEnrolled', function(data) {
                    $scope.userEnrolledForP2P = data.enrolled;
                });

                if(response.status === 404) {
                    //user not enrolled
                    $scope.userEnrolledForP2P = false;
                    $scope.p2pUserEnrollment = {
                        email: '',
                        mobile: '',
                        receivingAccountNumber: '',
                        customerId: ''
                    };
                }
            });


            $scope.urgentTranfer = false;

            $scope.locale = widget.getPreference('locale');

            //flag for which kind of transfer this is
            $scope.usTransfer = $scope.locale === 'en-US';

            $scope.title = widget.getPreference('title');

            $scope.accountsTopBalance = widget.getPreferenceFromParents('defaultBalanceView') || 'current';
            $scope.disableCurrencySelection = widget.getPreference('disableCurrencySelection');

            $scope.modalShown = false;
            $scope.exchangeRateModalShown = false;
            $scope.ibanModalShown = false;
            $scope.routingModalShown = false;

            $scope.templates = {
                saveContacts: partialsDir + '/saveContacts.html',
                urgentTransfer: partialsDir + '/urgentTransfer.html',
                exchangeRate: partialsDir + '/exchangeRate.html',
                iban: partialsDir + '/iban.html',
                routingAndAccount: partialsDir + '/routingAndAccountNumber.html'
            };

            i18nUtils.loadMessages(widget, $scope.locale).success(function(bundle) {
                $scope.messages = bundle.messages;
            });

            $scope.accountsModel = AccountsModel;
            $scope.accountsModel.setConfig({
                accountsEndpoint: widget.getPreference('accountsDataSrc')
            });

            $scope.paymentOrderModel = PaymentOrderModel.createModel();

            $scope.dateOptions = {
                'show-button-bar': false,
                'show-weeks': false
            };

            $scope.selectAccount = function(params) {
                if (!$scope.accountsModel.accounts) {
                    return;
                }

                $.each($scope.accountsModel.accounts, function(index, account){
                    if(params.accountId === account.id){
                        $scope.accountsModel.selected = account;
                    }
                });
                applyScope($scope);
            };

            var promise = $scope.accountsModel.load();

            promise.then(function() {

                if (lpCoreUtils.parseBoolean(widget.getPreference('forceAccountSelection'))) {
                    return;
                }

                if(!$scope.accountsModel.selected && $scope.accountsModel.accounts && $scope.accountsModel.accounts.length > 0) {
                    $scope.accountsModel.selected = $scope.accountsModel.findByAccountNumber(widget.getPreferenceFromParents('defaultAccount')) || $scope.accountsModel.accounts[0];
                }

                //now safe to listen for account Select message
                lpCoreBus.subscribe('launchpad-retail.accountSelected', $scope.selectAccount);

            })['catch'](function() {
                $scope.accountsModel.error = 'accountsLoadFailed';
            });

            $scope.currencyModel = CurrencyModel.getInstance({
                defaultCurrencyEndpoint: widget.getPreference('defaultCurrencyEndpoint'),
                currencyListEndpoint: widget.getPreference('currencyListEndpoint')
            });

            $scope.currencyModel.loadDefaultCurrency().success(function(data) {
                $scope.currencyModel.configureDefaultCurrency(data);

                $scope.paymentOrder.instructedCurrency = $scope.paymentOrder.instructedCurrency === '' ? $scope.currencyModel.defaultCurrency.currency_code : $scope.paymentOrder.instructedCurrency;
                $scope.currencyModel.loadOtherCurrencies().success(function() {

                    //if there is payment order data saved, select the appropriate currency
                    var currency = $scope.paymentOrder.instructedCurrency === '' ? $scope.currencyModel.defaultCurrency.currency_code : $scope.paymentOrder.instructedCurrency;
                    $scope.currencyModel.selectCurrency(currency);
                });
            });

            $scope.contactsModel = new ContactsModel({
                contacts: lpCoreUtils.resolvePortalPlaceholders(widget.getPreference('contactListDataSrc')),
                contactData: lpCoreUtils.resolvePortalPlaceholders(widget.getPreference('contactDataSrc')),
                contactDetails: lpCoreUtils.resolvePortalPlaceholders(widget.getPreference('contactDetailsDataSrc'))

            });
            $scope.contactsModel.loadContacts();

            $scope.ibanModel = IbanModel.getInstance({
                countryListEndpoint: widget.getPreference('ibanDataSrc'),
                enableCountrySearch: lpCoreUtils.parseBoolean(widget.getPreference('enableIbanCountrySearch'))
            });
            $scope.ibanModel.loadCountryList().then(function(response) {
                $scope.ibanModel.validate();
            });

            resetModel();

            $scope.toggleTabs = {
                oneTime: $scope.paymentOrder.isScheduledTransfer ? false : true,
                scheduled: $scope.paymentOrder.isScheduledTransfer ? true : false
            };

            $scope.activeTransferTab = {
                bank: true,
                p2pEmail: false,
                p2pAddress: false
            };

            //persisting form data that has been filled in but not processed
            $scope.persistenceManager = formDataPersistence.getInstance();

            //reload previously saved form data
            if($scope.persistenceManager.isFormSaved(formName)) {

                var newPaymentOrder = $scope.persistenceManager.getFormData(formName);

                var excludedProperties = [
                    'uuid',
                    'scheduleDate',
                    'update'
                ];

                //extend the properties of the new payment order to the one on the scope
                for(var key in newPaymentOrder) {
                    if(newPaymentOrder.hasOwnProperty(key) && excludedProperties.indexOf(key) === -1) {
                        $scope.paymentOrder[key] = newPaymentOrder[key];
                    }
                }

                //reset active transfer tabs
                setActiveTransferTabs();
            }

            // close all modal popups when the widget is closed (perspective minimized on launcher container and widget on springboard)
            widget.addEventListener('PerspectiveModified', function(event) {
                if (event.newValue === 'Minimized' || event.newValue === 'Widget') {
                    $scope.hideAllModals();
                }
            });

            //deep watch the payment order object, save form data when object changes
            $scope.$watch('paymentOrder', function(newValue, oldValue) {

                if(newValue !== oldValue) {
                    $scope.persistenceManager.saveFormData(formName, $scope.paymentOrder);

                    if(newValue && newValue.type !== $scope.poTypeEnum.bank) {
                        $scope.setScheduledTransfer('one-time');
                    }
                }
            }, true);

            lpCoreBus.subscribe('launchpad-retail.requestMoneyTransfer.setTab', function(data) {
                if(data.tab) {
                    $scope.paymentOrder.type = data.tab;
                    setActiveTransferTabs();
                }
            });

            // UPDATE: if we want to update a transfer order
            lpCoreBus.subscribe('lpMoneyTransfer.update', function(form) {
                $scope.paymentOrder = form;
                $scope.currencyModel.selectCurrency($scope.paymentOrder.instructedCurrency);
                $timeout(function() { $scope.selectAccount(form); });
            });

            applyScope($scope);
        };

        /**
         * Scope functions
         */

        $scope.openCalendar = function($event) {
            //open calendar on click event or "enter" and "space" key press events
            if ($event.type === 'click' || $event.which === 32 || $event.which === 13) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.paymentOrder.isOpenDate = true;
            }
        };

        //sets the payment orders transfer type
        $scope.setPaymentOrderType = function(paymentOrderType) {
            $scope.paymentOrder.type = paymentOrderType;
        };


        $scope.submitForm = function(event) {
            var xhr;

            event.preventDefault();

            $scope.persistenceManager.removeFormData(formName);

            checkValidAccounts();

            var processPaymentOrder = true;

            $scope.paymentOrderForm.submitted = true;
            if($scope.paymentOrderForm.$invalid) {
                $scope.$broadcast('lp.retail.new-transfer.errors');
                return false;
            }

            var paymentOrder = PaymentOrderModel.createModel();
            var selectedAccount = $scope.accountsModel.selected;

            //add relevent fields to payment order object
            paymentOrder.uuid = $scope.paymentOrder.uuid;
            paymentOrder.counterpartyName = $scope.paymentOrder.counterpartyName;
            paymentOrder.instructedAmount = $scope.paymentOrder.instructedAmount;
            paymentOrder.instructedCurrency = $scope.paymentOrder.instructedCurrency;
            //if for some reason the instructed currency has been set blank it defaults to account default
            if(paymentOrder.instructedCurrency === '') {
                paymentOrder.instructedCurrency = selectedAccount.currency;
            }
            paymentOrder.accountId = selectedAccount.id;
            paymentOrder.accountName = selectedAccount.alias;

            switch($scope.paymentOrder.type) {
                //BANK TRANSFER
                case $scope.poTypeEnum.bank:
                    paymentOrder = buildBankPaymentOrder(paymentOrder);
                    break;
                //P2P Email Transfer
                case $scope.poTypeEnum.p2pEmail:
                    //enroll user if not already enrolled
                    if(!$scope.userEnrolledForP2P) {
                        $scope.p2pService.enrollUserForP2P({
                            email: $scope.p2pUserEnrollment.email,
                            accountNumber: $scope.p2pUserEnrollment.receivingAccountNumber
                        }).then(function(response) {

                            lpCoreBus.publish('launchpad-retail.userP2PEnrolled', {
                                enrolled: true
                            });

                            lpCoreBus.publish('launchpad-retail.p2pEnrollmentComplete', {
                                verified: true
                            });

                        }, function(response) {
                            $scope.p2pService.error = 'An error occurred while connecting to the P2P Service';
                            processPaymentOrder = false;
                        });
                    }

                    paymentOrder = buildP2PEmailPaymentOrder(paymentOrder);
                    break;
                case $scope.poTypeEnum.p2pAddress:
                    if(!$scope.userEnrolledForP2P) {
                        $scope.p2pService.enrollUserForP2P({
                            email: $scope.p2pUserEnrollment.email,
                            accountNumber: $scope.p2pUserEnrollment.receivingAccountNumber
                        }).then(function(response) {

                        }, function(response) {
                            $scope.p2pService.error = 'An error occurred while connecting to the P2P Service';
                            processPaymentOrder = false;
                        });
                    }

                    paymentOrder = buildP2PAddressPaymentOrder(paymentOrder);
                    break;
                default:
                    paymentOrder = buildBankPaymentOrder(paymentOrder);
                    break;
            }

            // Autosave contact if not an existing one
            if ($scope.paymentOrder.saveContact && isNewContact()) {
                createContact();
            }

            if(processPaymentOrder) {
                xhr = paymentOrder.createOrder(paymentOrder); // Creates or updates payemnt model

                //on success
                xhr.then(function(res) {
                    lpCoreUpdate.trigger('newPaymentOrderInitiated'); // update models on demand
                    lpCoreBus.publish('Launcher:openWidget', { widgetName: 'review-transfers-v1' });
                    lpCoreBus.publish('launchpad-retail.paymentOrderInitiated', {paymentId: paymentOrder.id});
                    $scope.resetForm();
                }, function(err) {
                    $scope.errors.updateServerError = true;
                    $timeout(function () { $scope.errors.updateServerError = false; }, 5000);
                    console.log('Server error: ' + err.statusText);
                });
            }

        };

        $scope.onSaveContactsChange = function() {
            if (autoSave === '' && $scope.paymentOrder.saveContact) {
                $scope.toggleModal(); // Show
            }
        };

        $scope.setContactPreference = function(response) {
            // Call backend service to store this preference
            autoSave = !!response;
            widget.model.setPreference('autosaveContactsPreference', '' + autoSave);
            widget.model.save();

            $scope.toggleModal(); // Hide
        };

        $scope.showContactsInfo = function() {
            $scope.showContactsOptions = false;
            $scope.toggleModal(); // Hide
        };

        $scope.toggleSaveToContactsModal = function() {
            $scope.showContactsOptions = !$scope.showContactsOptions;
        };

        $scope.toggleAutosuggest = function() {
            $(widget.body).find('[name=counterpartyName]').trigger('toggle.autosuggest');
        };

        $scope.cancelForm = function() {
            lpCoreBus.publish('launchpad-retail.closeActivePanel');
        };

        $scope.resetForm = function() {

            resetModel();
            resetChildScopes();
            setActiveTransferTabs();

            $scope.currencyModel.selectCurrency($scope.currencyModel.defaultCurrency.currency_code);

            $scope.paymentOrderForm.submitted = false;
            $scope.paymentOrderForm.$setPristine();

            $scope.persistenceManager.removeFormData(formName);
        };

        $scope.resetCounterparty = function() {
            $scope.$apply(function(){
                $scope.paymentOrder.counterpartyIban = '';
            });
        };

        $scope.updateCounterparty = function(accountDetails) {
            // Store the selection as reference, to compare
            // later if the contact is a new one or not.
            if (accountDetails === null || accountDetails === undefined) {
                $scope.paymentOrder.counterpartyIban = '';

                if($scope.paymentOrder.type === $scope.poTypeEnum.bank) {
                    if($scope.usTransfer) {
                        $scope.paymentOrder.counterpartyAccount = '';
                    } else {
                        $scope.paymentOrder.counterpartyIban = '';
                    }
                } else if($scope.paymentOrder.type === $scope.poTypeEnum.p2pEmail) {
                    $scope.paymentOrder.counterpartyEmail = '';
                }

                $scope.paymentOrderForm.$setDirty();

                return;
            }

            $scope.paymentOrder.selectedCounter = {
                name: $scope.paymentOrder.counterpartyName,
                account: accountDetails.account
            };

            $scope.paymentOrder.type = accountDetails.type;
            setActiveTransferTabs();


            if($scope.paymentOrder.type === $scope.poTypeEnum.bank) {
                if($scope.usTransfer) {
                    $scope.paymentOrder.counterpartyAccount = accountDetails.account;
                } else {
                    $scope.paymentOrder.counterpartyIban = accountDetails.account;
                }
            } else if($scope.paymentOrder.type === $scope.poTypeEnum.p2pEmail) {
                $scope.paymentOrder.counterpartyEmail = accountDetails.account;
            }

            $scope.paymentOrderForm.$setDirty();
        };

        // Validate that accounts ( from / to ) are not equal
        $scope.notEqualAccounts = function() {
            if (!$scope.accountsModel.selected) {
                return false;
            }

            return $scope.accountsModel.selected.iban !== $scope.paymentOrder.counterpartyIban;
        };

        $scope.onAccountChange = function() {
            checkValidAccounts();
        };

        $scope.toggleModal = function() {
            $scope.showContactsOptions = !$scope.showContactsOptions;
        };

        //close the exchange rate modal
        $scope.toggleExchangeRateModal = function() {
            $scope.exchangeRateModalShown = !$scope.exchangeRateModalShown;
        };

        $scope.toggleSaveContactDetailsModal = function() {
            $scope.modalShown = !$scope.modalShown;
        };

        $scope.toggleIbanModal = function() {
            $scope.ibanModalShown = !$scope.ibanModalShown;
        };

        $scope.toggleRoutingNumberModal = function() {
            $scope.routingModalShown = !$scope.routingModalShown;
        };

        $scope.hideAllModals = function() {
            $scope.urgentTransferModalShown = false;
            $scope.exchangeRateModalShown = false;
            $scope.ibanModalShown = false;
            $scope.modalShown = false;
        };

        $scope.toggleUrgentTransferModal = function() {
            $scope.urgentTransferModalShown = !$scope.urgentTransferModalShown;
        };

        $scope.setScheduledTransfer = function(value) {

            if(value === 'scheduled') {
                $scope.paymentOrder.isScheduledTransfer = true;
                $scope.toggleTabs.oneTime = false;
                $scope.toggleTabs.scheduled = true;
            } else if(value === 'one-time') {
                $scope.paymentOrder.isScheduledTransfer = false;
                $scope.toggleTabs.oneTime = true;
                $scope.toggleTabs.scheduled = false;
            }
        };

        $scope.$on('reset', function() {
            $scope.paymentOrder.isScheduledTransfer = false;
            $scope.toggleTabs.oneTime = true;
            $scope.toggleTabs.scheduled = false;
        });


        /**
         * Other set up
         */

        widget.addEventListener('preferencesSaved', function () {
            widget.refreshHTML();
            initialize();
        });

        // Responsive
        lpUIResponsive.enable($rootElement)
            .rule({
                'max-width': 200,
                then: function() {
                    $scope.responsiveClass = 'lp-tile-size';
                    applyScope($scope);
                }
            })
            .rule({
                'min-width': 201,
                'max-width': 350,
                then: function() {
                    $scope.responsiveClass = 'lp-small-size';
                    applyScope($scope);
                }
            }).rule({
                'min-width': 351,
                'max-width': 600,
                then: function() {
                    $scope.responsiveClass = 'lp-medium-size';
                    applyScope($scope);
                }
            }).rule({
                'min-width': 601,
                then: function() {
                    $scope.responsiveClass = 'lp-large-size';
                    applyScope($scope);
                }
            });

        initialize();
    };
});
