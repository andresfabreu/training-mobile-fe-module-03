# P2P Tab

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-p2p-tab    | 1.0.0 			| P2P        |

## Brief Description

Provides navigation tabs related with P2P Transfers. If the user is not enrolled in P2P, the option to access the P2P Enrollment widget is displayed. Otherwise, the options to access the P2P Transactions and P2P preferences are displayed.

## Dependencies

* base
* core
* ui

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `widget.getPreference(string)`

_This widget does not have any preference._

##Events

The following is a list of pub/sub event which the widget subscribes to:

* **launchpad-retail.p2pEnrollmentComplete** - When this message is received, the widget changes the options available from P2P Enrollment, to P2P Transactions and P2P Preferences


The following is a list of pub/sub event which the widget publishes to:

* **launchpad-retail.openP2PEnrollment** - Published when the user selects P2P Enrollment tab
* **launchpad-retail.openP2PTransactions** - Published when the user selects P2P Transactions tab
* **launchpad-retail.openP2PPreferences** - Published when the user selects P2P Preferences tab

## Test


## Build
