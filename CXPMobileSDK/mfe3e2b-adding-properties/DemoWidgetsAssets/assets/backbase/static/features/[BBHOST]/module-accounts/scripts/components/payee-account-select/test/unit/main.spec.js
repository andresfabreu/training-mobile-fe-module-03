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

var payeeAccountSelect = require('../../scripts/main');
var ng = window.angular;
var ngModule = window.module;
var ngInject = window.inject;

var markupAccounts = function() {
    return [
        '<lp-payee-account-select name="accountId" class="lp-payee-account-select" ',
            'ng-model="selectedAccount" ',
            'lp-accounts="accounts">',
            '</lp-payee-account-select>'
    ].join('');
};

var markupAccountsCustomFields = function() {
    return [
        '<lp-payee-account-select name="accountId" class="lp-payee-account-select" ',
            'ng-model="selectedAccount" ',
            'custom-fields="fieldA,fieldB" ',
            'lp-accounts="accounts">',
            '</lp-payee-account-select>'
    ].join('');
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
describe('Payee account select component', function() {

    var $compile, $rootScope;

    beforeEach(ngModule(payeeAccountSelect.name));

    beforeEach(ngInject(function(_$compile_, _$rootScope_, _$document_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should be an object', function() {
        expect(payeeAccountSelect).toBeObject();
    });

    it('should create an accounts selector', function() {
        var element,
            accountElements;

        // Init.
        $rootScope.accounts = mockAccounts();
        element = $compile(markupAccounts())($rootScope);
        $rootScope.$digest();

        // Click to open.
        ng.element(element[0].querySelector('.dropdown-toggle')).triggerHandler('click');

        // Check for 3 account elements.
        accountElements = element[0].querySelectorAll('.lp-acct-detail');
        expect(accountElements.length).toBe($rootScope.accounts.length);

        // Click first to select.
        ng.element(element[0].querySelector('.dropdown-menu li')).triggerHandler('click');
        expect($rootScope.selectedAccount.id).toBe($rootScope.accounts[0].id);
        accountElements = element[0].querySelectorAll('.lp-acct-detail');
        expect(accountElements.length).toBe(1); // menu is now closed, with 1 selected.

        // Check no custom fields.
        expect(element.html()).not.toContain('foobar');
        expect(element.html()).not.toContain('barfoo');
    });

    it('should show short account number fields', function() {
        var element,
            accountElements,
            accountNumber,
            shortAccountNumber;

        // Init.
        $rootScope.accounts = mockAccounts();
        element = $compile(markupAccountsCustomFields())($rootScope);
        $rootScope.$digest();

        // Click to open.
        ng.element(element[0].querySelector('.dropdown-toggle')).triggerHandler('click');

        // Click first to select.
        ng.element(element[0].querySelector('.dropdown-menu li')).triggerHandler('click');
        expect($rootScope.selectedAccount.id).toBe($rootScope.accounts[0].id);
        accountElements = element[0].querySelectorAll('.lp-acct-detail');
        expect(accountElements.length).toBe(1); // menu is now closed, with 1 selected.

        expect(ng.element(accountElements[0]).html()).toContain($rootScope.selectedAccount.alias);

        shortAccountNumber = ' * ' + $rootScope.selectedAccount.accountIdentification[0].id.substr(-4);
        accountNumber = $rootScope.selectedAccount.accountIdentification[0].id;
        expect(ng.element(accountElements[0]).html()).toContain(shortAccountNumber);
        expect(ng.element(accountElements[0]).html()).not.toContain(accountNumber);
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
