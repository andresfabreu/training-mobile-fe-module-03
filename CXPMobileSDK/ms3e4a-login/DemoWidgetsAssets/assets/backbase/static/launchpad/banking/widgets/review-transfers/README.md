# Review Transfers

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-review-transfers    | 1.0.0 			| Banking        |

## Brief Description

Displays a list of initialized though not submitted payment orders. It handles payment authorization. Additionally, allows the user to update and remove payments.

## Dependencies

* base
* core
* ui
* module-accounts
* module-payments

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Screenshots
<img src="docs/media/screenshot.png" width="50%" title="Widget Screenshot" />


## Preferences

Get widget preference `widget.getPreference(string)`

* **accountsDataSrc**: The URL endpoint to retrieve account data
* **paymentOrdersDataSrc**: The URL endpoint to retrieve payment orders data
* **p2pEnrollmentEndpoint**: The URL endpoint to retrieve P2P enrollment status


##Events

The following is a list of pub/sub event which the widget subscribes to:

* **reviewTransfer** - When this message is received, the model is updated


The following is a list of pub/sub event which the widget publishes to:

* **launchpad-retail.requestMoneyTransfer** - Published when the Make New Transfer button is selected
* **launchpad-retail.transactions.newTransferSubmitted** - Published when a A2A or P2P transfer is submitted
