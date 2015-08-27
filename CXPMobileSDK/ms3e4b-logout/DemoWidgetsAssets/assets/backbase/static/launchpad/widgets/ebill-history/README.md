# E-bill Inbox

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-ebill-history 	| 1.0.0 			| Ebilling        |

## Brief Description
Provides the ability to show a list of past bill payments containing information about the payment date, and payment status.

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

* **debitOrdersSrc**: The URL endpoint for the debit orders
* **mandatesSrc**: The URL endpoint for the mandates
* **locale*8: Locale settings

##Events

The following is a list of pub/sub event which the widget subscribes to:

* **lp.widget.e-bill-inbox:sync** - When this message is received, the widget fetches new bills


The following is a list of pub/sub event which the widget publishes to:

_This widget does not publish any events._
