/**
 *  ----------------------------------------------------------------
 *  Copyright © Backbase B.V.
 *  ----------------------------------------------------------------
 *  Author : Backbase R&D - Amsterdam - New York
 *  Filename : core.spec.js
 *  Description:
 *  ----------------------------------------------------------------
 */

'use strict';

var accountSelect = require('../../scripts/main');
var ng = window.angular;
var ngModule = window.module;
var ngInject = window.inject;

var markupCards = function() {
    return [
        '<lp-accounts-select name="accountId" class="lp-accounts-header" ',
            'ng-model="selectedAccount" ',
            'lp-accounts="cards" ',
            'type="cards">',
            '</lp-accounts-select>'
    ].join('');
};

var markupAccounts = function() {
    return [
        '<lp-accounts-select name="accountId" class="lp-accounts-header" ',
            'ng-model="selectedAccount" ',
            'lp-accounts="accounts">',
            '</lp-accounts-select>'
    ].join('');
};

var markupAccountsCustomFields = function() {
    return [
        '<lp-accounts-select name="accountId" class="lp-accounts-header" ',
            'ng-model="selectedAccount" ',
            'custom-fields="fieldA,fieldB" ',
            'lp-accounts="accounts">',
            '</lp-accounts-select>'
    ].join('');
};

var markupAccountsBookedBalance = function() {
    return [
        '<lp-accounts-select name="accountId" class="lp-accounts-header" ',
            'ng-model="selectedAccount" ',
            'preferred-balance-view="booked" ', // show's booked balance, instead of available
            'lp-accounts="accounts">',
            '</lp-accounts-select>'
    ].join('');
};

var mockCards = function() {
    return [
       {
          'id': 3,
          'number': '4539-0796-7240-7281',
          'maskedNumber': 'XXXX-XXXX-XXXX-7281',
          'name': null,
          'alias': 'Visa Premium Rewards Card',
          'holderName': 'Sara Williams',
          'balanceCredit': -1210.5,
          'availableCredit': 5346.72,
          'creditLine': 4136.22,
          'currency': 'EUR',
          'expiryDate': '08/16',
          'iconColor': '#e35a2d',
          'brand': 'VISA',
          'alerts': false,
          'partyId': '1',
          'cardNumber': 'XXXX-XXXX-XXXX-7281',
          'availableBalance': 5346.72,
          'bookedBalance': -1210.5,
          'cardHolderName': 'Sara Williams'
       },
       {
          'id': 4,
          'number': '4716-7404-6394-8446',
          'maskedNumber': 'XXXX-XXXX-XXXX-8446',
          'name': null,
          'alias': 'Corporate AMEX',
          'holderName': 'Sara Williams',
          'balanceCredit': -2549.15,
          'availableCredit': 1752.34,
          'creditLine': 796.81,
          'currency': 'EUR',
          'expiryDate': '01/16',
          'iconColor': '#b6c320',
          'brand': 'AMEX',
          'alerts': false,
          'partyId': '1',
          'cardNumber': 'XXXX-XXXX-XXXX-8446',
          'availableBalance': 1752.34,
          'bookedBalance': -2549.15,
          'cardHolderName': 'Sara Williams'
       },
       {
          'id': 5,
          'number': '4716-7404-6394-1242',
          'maskedNumber': 'XXXX-XXXX-XXXX-1242',
          'name': null,
          'alias': 'Backup Mastercard',
          'holderName': 'Sara Williams',
          'balanceCredit': -4058.86,
          'availableCredit': 6516.88,
          'creditLine': 2458.02,
          'currency': 'EUR',
          'expiryDate': '01/17',
          'iconColor': '#13a581',
          'brand': 'Mastercard',
          'alerts': false,
          'partyId': '1',
          'cardNumber': 'XXXX-XXXX-XXXX-1242',
          'availableBalance': 6516.88,
          'bookedBalance': -4058.86,
          'cardHolderName': 'Sara Williams'
       }
    ];
};

var mockAccounts = function () {
    return [
        {
            'id': '4280afc5-4f7e-46c0-b0db-927138aa46c2',
            'currency': 'EUR',
            'alias': 'Personal Checking Account',
            'availableBalance': 17123.36,
            'bookedBalance': 17784.36,
            'accountIdentification': [
                {'scheme': 'IBAN', 'id': 'NL66INGB0280680457'},
                {'scheme': 'BBAN', 'id': '280680457'}
            ],
            'creditLine': 680,
            'identifier': 'NL66INGB0280680457',
            'delta': 0,
            'fieldA': 'foobar',
            'fieldB': 'barfoo'
        },
        {
            'id': '306f874a-9d64-439d-81a6-70a6e33f35ee',
            'currency': 'EUR',
            'alias': 'Business Account',
            'availableBalance': -17505.01,
            'bookedBalance': -17505.01,
            'accountIdentification': [
                {'scheme': 'IBAN', 'id': 'NL67RABO0842497587'},
                {'scheme': 'BBAN', 'id': '842497587'}
            ],
            'creditLine': 786,
            'identifier': 'NL67RABO0842497587',
            'delta': 0,
            'fieldA': 'foobar',
            'fieldB': 'barfoo'
        },
        {
            'id': 'a05f5b9d-9a7e-4b2f-9feb-5bb7a8a98d87',
            'currency': 'EUR',
            'alias': 'Shared Account',
            'availableBalance': 10826,
            'bookedBalance': 10826,
            'accountIdentification': [
                {'scheme': 'IBAN', 'id': 'NL56ABNA0519431642'},
                {'scheme': 'BBAN', 'id': '519431642'}
            ],
            'creditLine': 260,
            'identifier': 'NL56ABNA0519431642',
            'delta': 0,
            'fieldA': 'foobar',
            'fieldB': 'barfoo'
        }
    ];
};

/*----------------------------------------------------------------*/
/* Basic testing
/*----------------------------------------------------------------*/
describe('Account select component', function() {

    var $compile, $rootScope;

    beforeEach(ngModule(accountSelect.name));

    beforeEach(ngInject(function(_$compile_, _$rootScope_, _$document_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should be an object', function() {
        expect(accountSelect).toBeObject();
    });

    it('should create a card selector', function() {
        var element, cardsElements;

        // Init.
        $rootScope.cards = mockCards();
        element = $compile(markupCards())($rootScope);
        $rootScope.$digest();

        // Click to open.
        ng.element(element[0].querySelector('.dropdown-toggle')).triggerHandler('click');

        // Check for 3 card elements.
        cardsElements = element[0].querySelectorAll('.card-name-info');
        expect(cardsElements.length).toBe($rootScope.cards.length);

        // Click first to select.
        ng.element(element[0].querySelector('.dropdown-menu li')).triggerHandler('click');
        expect($rootScope.selectedAccount.id).toBe($rootScope.cards[0].id);
        cardsElements = element[0].querySelectorAll('.card-name-info');
        expect(cardsElements.length).toBe(1); // menu is now closed, with 1 selected.
        expect(ng.element(cardsElements[0]).html()).toContain($rootScope.selectedAccount.maskedNumber);
    });

    it('should create an accounts selector', function() {
        var element, accountElements;

        // Init.
        $rootScope.accounts = mockAccounts();
        element = $compile(markupAccounts())($rootScope);
        $rootScope.$digest();

        // Click to open.
        ng.element(element[0].querySelector('.dropdown-toggle')).triggerHandler('click');

        // Check for 3 account elements.
        accountElements = element[0].querySelectorAll('.lp-acct-detail');
        expect(accountElements.length).toBe($rootScope.accounts.length);
        expect(element.html()).toContain('Available');

        // Click first to select.
        ng.element(element[0].querySelector('.dropdown-menu li')).triggerHandler('click');
        expect($rootScope.selectedAccount.id).toBe($rootScope.accounts[0].id);
        accountElements = element[0].querySelectorAll('.lp-acct-detail');
        expect(accountElements.length).toBe(1); // menu is now closed, with 1 selected.
        expect(ng.element(accountElements[0]).html()).toContain($rootScope.selectedAccount.accountIdentification[0].id);

        // Check no custom fields.
        expect(element.html()).not.toContain('foobar');
        expect(element.html()).not.toContain('barfoo');
    });

    it('should show preferred balance as the booked balance', function() {
        var element, accountElements;

        // Init.
        $rootScope.accounts = mockAccounts();
        element = $compile(markupAccountsBookedBalance())($rootScope);
        $rootScope.$digest();

        // Click to open.
        ng.element(element[0].querySelector('.dropdown-toggle')).triggerHandler('click');

        // Check for 3 account elements.
        accountElements = element[0].querySelectorAll('.lp-acct-detail');
        expect(accountElements.length).toBe($rootScope.accounts.length);
        expect(element.html()).toContain('Current');

        ng.element(element[0].querySelector('.dropdown-menu li')).triggerHandler('click');
        expect($rootScope.selectedAccount.id).toBe($rootScope.accounts[0].id);
        accountElements = element[0].querySelectorAll('.lp-acct-detail');
        expect(accountElements.length).toBe(1); // menu is now closed, with 1 selected.
        expect(ng.element(accountElements[0]).html()).toContain($rootScope.selectedAccount.accountIdentification[0].id);
    });

    it('should show custom fields', function() {
        var element;

        // Init.
        $rootScope.accounts = mockAccounts();
        element = $compile(markupAccountsCustomFields())($rootScope);
        $rootScope.$digest();

        // Click to open.
        ng.element(element[0].querySelector('.dropdown-toggle')).triggerHandler('click');

        // Check for custom fields.
        expect(element.html()).toContain('foobar');
        expect(element.html()).toContain('barfoo');
    });
});
