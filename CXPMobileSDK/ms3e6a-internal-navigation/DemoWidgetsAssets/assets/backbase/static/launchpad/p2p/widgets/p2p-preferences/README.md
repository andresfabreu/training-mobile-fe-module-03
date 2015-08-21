# P2P Preferences

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-p2p-preferences    | 1.0.0 			| P2P        |

## Brief Description

Settings for Person-to-person functionality allowing the user to select a deposit account and email.

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
* **locale**: The locale information

##Events

The following is a list of pub/sub event which the widget subscribes to:

* **launchpad-retail.userP2PEnrolled** - When this message is received, widget gets enrollment information


The following is a list of pub/sub event which the widget publishes to:

* **launchpad-retail.userP2PVerification.unverified** - Published when the user is the P2P preferences are not verified
* **launchpad-retail.openP2PEnrollment** - Published when the P2P enrollment is completed

## Test


## Build
