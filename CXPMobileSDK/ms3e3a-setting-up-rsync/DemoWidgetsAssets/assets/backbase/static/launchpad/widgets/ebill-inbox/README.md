# E-Bill Inbox

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-ebill-inbox    | 1.0.0 			| Ebilling        |

## Brief Description

Provides the ability to accept new e-Bill requests, view unpaid e-Bills, pay e-Bills and also decline. Moreover, it displays additional information about the selected e-Bill, such as Payee, Bill Reference Number, and Amount.

## Dependencies

* base
* core
* ui
* module-ebilling

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `widget.getPreference(string)`

* **accountsDataSrc**: The URL endpoint to retrieve the list of accounts
* **debitOrdersSrc**: The URL endpoint to retrieve the list of debit orders
* **mandatesSrc**: The URL endpoint to retrieve the list of mandates
   

##Events

The following is a list of pub/sub event which the widget subscribes to:

_This widget does not subscribe to any events._

The following is a list of pub/sub event which the widget publishes to:

* **lp.widget.e-bill-inbox:sync** - Published when the widget refreshes
