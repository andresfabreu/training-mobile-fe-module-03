define(function(require, exports, module) {
    'use strict';

    var $ = window.jQuery;
    var base = require('base');
    var angular = base.ng;
    var lpUIUtils = base.inject('lpUIUtils', require('ui').name);

    // @ngInject
    exports.counterPartyFilter = function($templateCache, transferTypes, $document, ProfileDetailsService, lpCoreError) {

        $templateCache.put('$counterPartyFilter.html',
            '<div class="lp-counter-party-filter">' +
                '<div class="input-group has-clear">' +
                    '<input class="name-field form-control" type="text" ng-model="counterpartyName" ng-click="showContactList()" ng-keydown="showContactList($event)" aria-label="Counterparty Name" />' +
                    '<span class="counterparty-to text-muted">To:</span>' +
                    '<span class="input-clear" ng-click="clearCounterParty()" ng-show="counterpartyName.length"><i class="glyphicon glyphicon-remove cursor-pointer"></i></span>' +
                    '<span class="input-group-btn">' +
                        '<button type="button" role="button" aria-label="Auto Suggest" tabindex="0" class="btn btn-default dropdown-toggle" ng-click="toggleShowContacts()">' +
                            '<i class="lp-icon lp-icon-addressbook"></i>' +
                        '</button>' +
                    '</span>' +
                '</div>' +
                '<div class="dropdown">' +
                    '<ul ng-show="showContacts && (counterpartyList | filter:counterpartyName).length > 0" class="col-xs-12 dropdown-menu filter-list" style="display: block;">' +
                        '<li class="contact" ng-repeat="contact in counterpartyList | filter: counterpartyName | limitTo: 25 track by $index" >' +
                            '<div class="border" ng-class="{\'border-my-accounts\': contact.ownAccounts, \'border-other\': !contact.ownAccounts}"></div>' +
                            '<div class="filter-contact clearfix" ng-class="{\'single-account-selection\': contact.accounts.length === 1}" ng-click="prepareSelection(contact)" ng-keydown="handleContactAccountToggleKeyDown(contact, $event)" dynamic-focus="contact">' +
                                '<div class="pull-left photo-container">' +
                                    '<img class="contact-photo media-object" ng-src="{{getProfileImageByName(contact.photoUrl,contact.name)}}" />' +
                                '</div>' +
                                '<div class="contact-info pull-left contact-details">' +
                                    '<span class="contact-name">{{contact.name}}</span>' +
                                    '<p class="account-info" ng-if="contact.accounts.length > 1">{{contact.accounts.length}} account(s)</p>' +
                                    '<p class="account-info" ng-if="contact.accounts.length === 1">{{contact.accounts[0].account}}</p>' +
                                '</div>' +
                                '<div ng-if="contact.accounts.length > 1" class="pull-left contact-account-list">' +
                                    '<p tabindex="0" class="toggle-accounts" ng-show="!contact.open" ng-click="toggleContactAccounts(contact)" ng-keydown="handleContactAccountToggleKeyDown(contact, $event)"  aria-label="View accounts for {{contact.name}}">View all accounts <span class="caret"></span></p>' +
                                    '<p tabindex="0" class="toggle-accounts" ng-show="contact.open" ng-click="toggleContactAccounts(contact)" ng-keydown="handleContactAccountToggleKeyDown(contact, $event)" aria-label="Close accounts for {{contact.name}}">Close all accounts <span class="caret"></span></p>' +
                                    '<div class="contact-accounts" ng-class="{\'contact-accounts-open\': contact.open}">' +
                                        '<div tabindex="0" ng-show="contact.open" ng-repeat="account in contact.accounts track by $index" class="contact-single-account" ng-click="prepareSelection(contact, account)" ng-keydown="handleSingleAccountKeyDown(contact, account, $event)" dynamic-aria-label="dynamic-aria-label" aria-contact="contact" aria-account="account">' +
                                            '<div class="col-xs-10 col-xs-offset-2">' +
                                                '<p ng-if="account.name">{{account.name}}</p>' +
                                                '<p>{{account.account}}</p>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</li>' +
                    '</ul>' +
                '</div>' +
            '</div>'
        );



        return {
            restrict: 'A',
            scope: {
                "counterpartyName": "=ngModel",
                "contacts": "=lpContacts",
                "accounts": "=lpAccounts",
                "onSelect": "="
            },
            require: ["ngModel", "^form"],
            template: $templateCache.get("$counterPartyFilter.html"),
            link: function(scope, element, attrs, ctrls) {

                var modelCtrl = ctrls[0];
                var formCtrl = ctrls[1];

                modelCtrl.$name = attrs.name;
                formCtrl.$addControl(modelCtrl);

                var input = angular.element(element.find("input"));
                var elementNode = element.get(0);

                var keyCodes = {
                    up: 38,
                    down: 40,
                    enter: 13
                };

                var contactAccountFields = {
                    email: transferTypes.p2pEmail,
                    account: transferTypes.bank
                };

                var initialize = function() {

                    scope.counterpartyList = [];
                    scope.showContacts = false;

                    ProfileDetailsService.getData().success(function(response) {
                        scope.profile = ProfileDetailsService.formatResponse(response, scope.messages);


						scope.deregisterContactsWatch = scope.$watch("contacts", function(newValue) {
							if(newValue.length > 0) {
								preprocessContacts(scope.contacts);
								scope.deregisterContactsWatch();
							}
						});

						scope.deregisterAccountsWatch = scope.$watch("contacts", function(newValue) {
							if(newValue.length > 0) {
								preprocessAccounts(scope.accounts);
								scope.deregisterAccountsWatch();
							}
						});

                    });

                    scope.accountsConfigured = false;
                    scope.contactsConfigured = false;
                };

                /**
                 * Validation hooks
                 */
                modelCtrl.$formatters.push(function(value) {

                    if(value.length > 0) {
                        modelCtrl.$setValidity("required", true);
                    } else {
                        modelCtrl.$setValidity("required", false);
                    }

                    return value;
                });

                modelCtrl.$parsers.push(function(value) {

                    if(value.length > 0) {
                        modelCtrl.$setValidity("required", true);
                    } else {
                        modelCtrl.$setValidity("required", false);
                    }

                    return value;
                });


                /**
                 * Preprocess contacts list and add to counterpartyList
                 * @param contacts
                 */
                var preprocessContacts = function(contacts) {

                    var contact;

                    for(var i = 0; i < contacts.length; i ++) {
                        contact = contacts[i];
                        contact.open = false;
                        contact.accounts = [];


                        for(var key in contact) {
                            if(contact.hasOwnProperty(key)) {
                                if(contactAccountFields[key] && contact[key]) {
                                    contact.accounts.push({
                                        "type": contactAccountFields[key],
                                        "account": contact[key]
                                    });
                                }
                            }
                        }

                        scope.counterpartyList.push(contact);
                    }
                };

                /**
                 * Preprocess accounts array and add extra properties
                 * @param accounts
                 */
                var preprocessAccounts = function(accounts) {

                    var myAccounts = {};

                    myAccounts.name = scope.profile.fullname;
                    myAccounts.open = false; //closed by default
                    myAccounts.ownAccounts = true;
                    myAccounts.accounts = [];

                    for(var i = 0; i < accounts.length; i ++) {
                        myAccounts.accounts.push({
                            type: transferTypes.bank,
                            account: accounts[i].identifier,
                            name: accounts[i].alias
                        });
                    }

                    scope.counterpartyList.unshift(myAccounts);
                };

                var bindHideContacts = function() {

                    $document.bind("click", function(e) {

                        if(!elementNode.contains(e.target)) {
                            scope.$apply(function() {
                                scope.showContacts = false;
                            });
                            unbindHideContacts();
                        }
                    });
                };

                var unbindHideContacts = function() {
                    $document.unbind("click");
                };

                var findFirstContact = function() {
                    return $(element.find(".contact")[0]);
                };

                /**
                 * Focuses on the selected contacts account toggle
                 * @param target
                 */
                var focusContactsAccountsButton = function(target) {

                    //focus on close button
                    var toFocus;
                    target = angular.element(event.target);

                    if(target.next().hasClass("toggle-accounts")) {
                        toFocus = target.next();
                    } else if(target.prev().hasClass("toggle-accounts")) {
                        toFocus = target.prev();
                    }

                    if(toFocus) {
                        setTimeout(function() {
                            toFocus.focus();
                        }, 0);
                    }
                };

                /**
                 * Find the toggle buttons in a contact container
                 * @param contactContainer
                 * @returns {*}
                 */
                var findAccountToggles = function(contactContainer) {

                    return contactContainer.find(".toggle-accounts");
                };

                /**
                 * focus on the active toggle when selection an an contact account toggle
                 * @param buttons
                 */
                var focusOnActiveToggle = function(buttons) {

                    var toFocus;

                    if($(buttons[0]).css("display") === "block") {
                        toFocus = buttons[0];
                    } else {
                       toFocus = buttons[1];
                    }

                    if(toFocus) {
                        setTimeout(function() {
                            toFocus.focus();
                        }, 0);
                    }
                };

                /**
                 * returns the surrounding .contact element of an account or account toggle
                 * @param target
                 * @returns {*}
                 */
                var getContactParentContainer = function(target) {
                    return target.parents(".contact");
                };


                /**
                 * Show/Hide functions
                 */
                scope.toggleShowContacts = function() {

                    scope.showContacts = !scope.showContacts;

                    if(scope.showContacts) {
                        bindHideContacts();
                    } else {
                        unbindHideContacts();
                    }
                };

                /**
                 * Clear CounterParty filter field
                 */
                scope.clearCounterParty = function() {
                    scope.counterpartyName = '';

                    scope.showContacts = true;
                    bindHideContacts();
                    scope.onSelect();

                    (element.find(input)[0]).focus();
                };

                scope.$on("reset", function() {
                    scope.showContacts = false;
                });

                scope.showContactList = function(event) {

                    //unbind before rebinding again
                    unbindHideContacts();

                    //if no event passed, or space or down arrow
                    if(!event || (event.which === keyCodes.enter || event.which === keyCodes.down || event.which === keyCodes.up)) {

                        if(event) {
                            event.preventDefault();
                            event.stopPropagation();
                        }

                        bindHideContacts();

                        if(!scope.showContacts) {
                            //open list of contacts
                            scope.showContacts = true;
                        } else if(event && event.which === keyCodes.down) {
                            //select first contact
                            var contact = findFirstContact();
                            var buttons = findAccountToggles(contact);
                            if(buttons.length > 0) {
                                focusOnActiveToggle(buttons);
                            } else {
                                contact.find(".filter-contact").focus();
                            }
                        } else if(event && (event.which === keyCodes.up || event.which === keyCodes.enter)) {
                            //close contacts
                            scope.showContacts = false;
                            unbindHideContacts();
                        }
                    }

                };

                /**
                 * Hide/close a contacts list of accounts
                 * @param contact
                 * @param event
                 */
                scope.toggleContactAccounts = function(contact) {

                    //loop through accounts
                    for(var i = 0; i < scope.counterpartyList.length; i ++) {
                        //toggle this contact's accounts open or closed
                        if(scope.counterpartyList[i] === contact) {
                            scope.counterpartyList[i].open = !scope.counterpartyList[i].open;
                        } else {
                            //hide all else
                            scope.counterpartyList[i].open = false;
                        }
                    }
                };


                /**
                 * Handle key press on account toggles
                 * @param contact
                 * @param event
                 */
                scope.handleContactAccountToggleKeyDown = function(contact, event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if(event.which === keyCodes.enter) {
                        //selection
                        if(contact.accounts.length === 1) {
                            scope.prepareSelection(contact);
                        } else {
                            scope.toggleContactAccounts(contact);
                            focusContactsAccountsButton(event.target);
                        }
                    } else if(event.which === keyCodes.down || event.which === keyCodes.up) {
                        //navigation
                        scope.keyToNextAccountToggle(event);
                    }
                };

                /**
                 * handle keypress on individual account selection
                 * @param contact
                 * @param account
                 * @param event
                 */
                scope.handleSingleAccountKeyDown = function(contact, account, event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if(event.which === keyCodes.enter) {
                        //selection
                        scope.prepareSelection(contact, account);
                    } else if(event.which === keyCodes.down || event.which === keyCodes.up) {
                        //navigation
                        scope.keyToNextAccount(event);
                    }
                };

                /**
                 * Focus on the next Account toggle based on keypress
                 * @param event
                 */
                scope.keyToNextAccountToggle = function(event) {

                    var target = $(event.target);
                    var contactContainer = getContactParentContainer(target), buttons;

                    if(event.which === keyCodes.down) {
                        //are accounts open?
                        if(target.next("div").length > 0) {
                            contactContainer.find(".contact-single-account")[0].focus();
                        } else {
                            //go to next account dropdown
                            var nextContact = contactContainer.next(".contact");
                            buttons = findAccountToggles(nextContact);

                            if(buttons.length > 0) {
                                focusOnActiveToggle(buttons);
                            } else {
                                //only one account!
                                nextContact.find(".filter-contact").focus();
                            }

                        }
                    } else if(event.which === keyCodes.up) {

                        var prevContact = contactContainer.prev(".contact");
                        buttons = findAccountToggles(prevContact);

                        if(buttons.length > 0) {
                            focusOnActiveToggle(buttons);
                        } else if(prevContact.find(".filter-contact").length > 0) {
                            //only one account!
                            prevContact.find(".filter-contact").focus();
                        } else {
                            //no more accounts, focus on input
                            input.focus();
                        }
                    }
                };

                /**
                 * focus on next single account from keypress
                 * @param event
                 */
                scope.keyToNextAccount = function(event) {

                    var target = $(event.target), toFocus, contactContainer, buttons;

                    if(event.which === keyCodes.down) {
                        if(target.next(".contact-single-account").length === 1) {
                            //next account
                            toFocus = target.next(".contact-single-account");
                        }
                    } else if(event.which === keyCodes.up) {
                        if(target.prev(".contact-single-account").length === 1) {
                            //previous account
                            toFocus = target.prev(".contact-single-account");
                        } else {
                            contactContainer = getContactParentContainer(target);
                            buttons = findAccountToggles(contactContainer);
                            if(buttons.length > 0) {
                                //no more accounts, go to account toggle
                                focusOnActiveToggle(buttons);
                            }
                        }
                    }
                    if(toFocus) {
                        setTimeout(function () {
                            toFocus.trigger("focus");
                        }, 0);
                    }
                };


                /**
                 * Prepare a selection for assignment to payment order
                 * @param contact
                 * @param account
                 * @param event the event passed from the user interaction
                 */
                scope.prepareSelection = function (contact, account) {

                    if(!account) {
                        if(contact.accounts.length > 1) {
                            return;
                        } else {
                            account = contact.accounts[0];
                        }
                    }

                    scope.showContacts = false;
                    unbindHideContacts();
                    modelCtrl.$setViewValue(contact.name);
                    scope.onSelect(account);

                    setTimeout(function() {
                        input.focus();
                    }, 0);


                };

                /**
                 * Decode URL of profile photo for contact
                 * @param photoUrl
                 * @returns {string}
                 */
                scope.getProfileImageByName = function(photoUrl, name) {
                    if (photoUrl) {
                        return lpUIUtils.decodePhotoUrl(photoUrl);
                    } else if (name) {
                        return lpUIUtils.getDefaultProfileImage(name, 100, 100);
                    } else {
                        lpCoreError.throwException('Expected a name but got ' + name);
                        return '';
                    }
                };

                initialize();

            }
        };
    };
});
