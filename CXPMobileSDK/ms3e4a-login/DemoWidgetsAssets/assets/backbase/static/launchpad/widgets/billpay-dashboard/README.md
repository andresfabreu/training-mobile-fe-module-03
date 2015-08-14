# Bill Pay Dashboard

## Information

| name                 			| version           | bundle           |
| ------------------------------|:-----------------:| ----------------:|
| widget-billpay-dashboard	    | 1.0.0 			| Ebilling         |

## Brief Description

Provides a dashboard where the user can see a list of added payees..

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

* **billPaymentsDataSrc**: The URL endpoint for Bill Payment service
* **calendarDataSrc**: The URL endpoint for Business Calendar service

Get preference inherited from widget's parents `widget.getPreferenceFromParents(string)`

* **defaultAccount**: The default account

##Events

_This widget does not publish or subscribe to any events._
