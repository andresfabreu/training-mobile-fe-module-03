# Add Bill Payee

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-ebill-add	    | 1.0.0 			| Ebilling        |

## Brief Description

Provides a wizard where the user is guided through the flow of adding a new bill payee (both electronic and check payee), so that the user can subsequently schedule a bill. Additionally, if the payee is eligible for e-billing, it provides the possibility of enabling e-billing where the user is asked to provide credentials to login to the 3rd party system.

## Dependencies

* base
* core
* ui
* module-accounts
* module-payments
* module-ebilling

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `widget.getPreference(string)`

* **billPaymentsDataSrc**: The URL endpoint for Bill Payment service
* **calendarDataSrc**: The URL endpoint for Business Calendar service

Get preference inherited from widget's parents `widget.getPreferenceFromParents(string)`

* **defaultAccount**: The default account

##Events

_This widget does not publish or subscribe to any events._
