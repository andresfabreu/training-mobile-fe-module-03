# P2P Enrollment

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-p2p-enrollment    | 1.0.0 			| P2P        |

## Brief Description

Provides a multi-step wizard that allows the current user to enroll and set initial configuration for Person-to-Person Transfers.

## Dependencies

* base
* core
* ui
* module-accounts

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `widget.getPreference(string)`

* **accountsDataSrc**: The end-point URL containing information about the user bank accounts


##Events

The following is a list of pub/sub event which the widget subscribes to:

_This widget does not subscribe to any events._


The following is a list of pub/sub event which the widget publishes to:

* **launchpad-retail.p2pEnrollmentComplete** - Published on completion of the P2P enrollment
Arguments: `{verified: true}`
* **launchpad-retail.openP2PTransactions** - Published when the P2P enrollment is completed, opens the P2P Transactions widget

## Test



## Build
