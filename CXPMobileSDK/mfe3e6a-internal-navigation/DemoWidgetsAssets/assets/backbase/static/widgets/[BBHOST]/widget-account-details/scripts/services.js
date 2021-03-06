/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.TransactionHistory = function() {
        var data = {
            "2cdb2224-8926-4b4d-a99f-1c9dfbbb4699": [
                {
                    "id": "b3d83988-9cac-4b44-9a8f-13f278f1e69f",
                    "accountId": "2cdb2224-8926-4b4d-a99f-1c9dfbbb4699",
                    "categoryId": "d8788d03-eca9-43d6-983e-1e3b5865ac7a",
                    "bookingDateTime": 1415028660003,
                    "counterpartyAccount": "NL67RABO0842497587",
                    "counterpartyName": "Lisa Nijenhuis",
                    "counterPartyLogoPath": null,
                    "instructedAmount": 155.00,
                    "instructedCurrency": "EUR",
                    "transactionAmount": 155.00,
                    "transactionCurrency": "EUR",
                    "transactionType": "Online Transfer",
                    "address": {},
                    "location": {},
                    "merchantType": null,
                    "remittanceInformation": null,
                    "creditDebitIndicator": "DBIT",
                    "description": null
                },
                {
                    "id": "7e671c45-b606-4fd2-9426-048ac87891c3",
                    "accountId": "2cdb2224-8926-4b4d-a99f-1c9dfbbb4699",
                    "categoryId": "d8788d03-eca9-43d6-983e-1e3b5865ac7a",
                    "bookingDateTime": 1414028105004,
                    "counterpartyAccount": "cal.lightman@gmail.com",
                    "counterpartyName": "Cal Lightman",
                    "counterPartyLogoPath": null,
                    "instructedAmount": 125.00,
                    "instructedCurrency": "EUR",
                    "transactionAmount": 125.00,
                    "transactionCurrency": "EUR",
                    "transactionType": "Online Transfer",
                    "address": {},
                    "location": {},
                    "merchantType": null,
                    "remittanceInformation": null,
                    "creditDebitIndicator": "DBIT",
                    "description": null
                },
                {
                    "id": "b3d83988-9cac-4b44-9a8f-13f278f1e69f",
                    "accountId": "2cdb2224-8926-4b4d-a99f-1c9dfbbb4699",
                    "categoryId": "d8788d03-eca9-43d6-983e-1e3b5865ac7a",
                    "bookingDateTime": 1413027660003,
                    "counterpartyAccount": "NL67RABO0842497587",
                    "counterpartyName": "T-mobile",
                    "counterPartyLogoPath": null,
                    "instructedAmount": 68.00,
                    "instructedCurrency": "EUR",
                    "transactionAmount": 68.00,
                    "transactionCurrency": "EUR",
                    "transactionType": "Online Transfer",
                    "address": {},
                    "location": {},
                    "merchantType": null,
                    "remittanceInformation": null,
                    "creditDebitIndicator": "DBIT",
                    "description": null
                },
                {
                    "id": "7e671c45-b606-4fd2-9426-048ac87891c3",
                    "accountId": "2cdb2224-8926-4b4d-a99f-1c9dfbbb4699",
                    "categoryId": "d8788d03-eca9-43d6-983e-1e3b5865ac7a",
                    "bookingDateTime": 1412026105004,
                    "counterpartyAccount": "cal.lightman@gmail.com",
                    "counterpartyName": "Pizza Hut",
                    "counterPartyLogoPath": null,
                    "instructedAmount": 15.99,
                    "instructedCurrency": "EUR",
                    "transactionAmount": 15.99,
                    "transactionCurrency": "EUR",
                    "transactionType": "Online Transfer",
                    "address": {},
                    "location": {},
                    "merchantType": null,
                    "remittanceInformation": null,
                    "creditDebitIndicator": "DBIT",
                    "description": null
                },
                {
                    "id": "7e671c45-b606-4fd2-9426-048ac87891c3",
                    "accountId": "2cdb2224-8926-4b4d-a99f-1c9dfbbb4699",
                    "categoryId": "d8788d03-eca9-43d6-983e-1e3b5865ac7a",
                    "bookingDateTime": 1411024105004,
                    "counterpartyAccount": "245135135135",
                    "counterpartyName": "AT&T",
                    "counterPartyLogoPath": null,
                    "instructedAmount": 183.99,
                    "instructedCurrency": "USD",
                    "transactionAmount": 183.99,
                    "transactionCurrency": "USD",
                    "transactionType": "Online Transfer",
                    "address": {},
                    "location": {},
                    "merchantType": null,
                    "remittanceInformation": null,
                    "creditDebitIndicator": "DBIT",
                    "description": null
                }
            ]
        };

        return {
            get: function(accountId) {
                return (data[accountId]) ? data[accountId] : null;
            }
        };
    };
});
