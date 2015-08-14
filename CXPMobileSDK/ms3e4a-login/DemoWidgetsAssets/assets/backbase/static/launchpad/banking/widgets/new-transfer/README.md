# New Transfer

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-new-transfer    | 1.0.0 			| Banking        |

## Brief Description
Provide the ability to transfer money. Different types of money transfer are supported: Direct, Address book, and P2P.
It allows the transfer of funds from one bank account to another and supports several different payment types, simple SEPA, US transfer, international transfer, etc. Depending on the locale of the widget, different payment types may be offered.

## Dependencies

* base
* core
* ui
* module-accounts
* module-contacts
* module-payments
* module-transactions

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Screenshots
<img src="docs/media/screenshot.png" width="50%" title="Widget Screenshot" />

## Preferences

Get widget preference `widget.getPreference(string)`

* **paymentOrdersDataSrc**: The URL endpoint to retrieve payment orders
* **autosaveContactsPreference**: Enable/disable autosave of new contacts
* **locale**: Defines the locale of the widget
* **defaultBalanceView**: Default balance to be displayed by default (current or available)
* **accountsDataSrc**: The URL endpoint to retrieve user accounts
* **forceAccountSelection**: Enable/disable default account to be selected when widget is initially open
* **defaultCurrencyEndpoint**: The URL to retrieve the default currency of the user
* **currencyListEndpoint**: The URL to retrieve the other currencies, with exchange rate based on the default currency
* **disableCurrencySelection**: Enable/disable ability for the user to select a currency for the transfer
* **contactListDataSrc**: The URL endpoint to retrieve the user contacts list
* **contactDataSrc**: The URL endpoint to retrieve the user contacts
* **contactDetailsDataSrc**: The URL endpoint to retrieve the user contact details
* **ibanDataSrc**: The URL to retrieve the list of supported IBAN formats to validate against
* **enableIbanCountrySearch**: Enable/disable the ability for the user to select the IBAN country code


Get preference inherited from widget's parents `widget.getPreferenceFromParents(string)`

* **defaultBalanceView**: The default balance
* **defaultAccount**: The default account

##Events

The following is a list of pub/sub event which the widget subscribes to:

* **launchpad-retail.userP2PEnrolled** -
* **launchpad-retail.accountSelected** - Listens for selected account
* **launchpad-retail.requestMoneyTransfer.setTab** - Listens for


The following is a list of pub/sub event which the widget publishes to:

* **launchpad.contacts.load** - Published when a contact is created
* **launchpad-retail.userP2PEnrolled** - Published when the user is enrolled to P2P
Arguments: `{enrolled: true}`
* **launchpad-retail.p2pEnrollmentComplete** - Published when the P2P enrollment is completed
Arguments: `{verified: true}`
* **Launcher:openWidget** - Published when the payment is created successfully
Arguments: `{widgetName: 'review-transfers-v1'}`
* **launchpad-retail.paymentOrderInitiated** - Published when the payment is created successfully
Arguments: `{paymentId: paymentOrder.id}`
* **launchpad-retail.closeActivePanel** - Published when the cancel hyperlink is selected

## Test

## Build
