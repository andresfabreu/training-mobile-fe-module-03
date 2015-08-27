# P2P Transactions

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-p2p-transactions    | 1.0.0 			| P2P        |

## Brief Description

Provides an overview of all P2P transactions of a user, including related information such as Date, Beneficiary Name, Beneficiary E-mail or Phone Number, Amount and Status.

## Dependencies

* base
* core
* ui
* module-accounts
* module-transactions

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `widget.getPreference(string)`

* **transactionsDataSrc**: The end-point URL containing transactions data
* **locale**: Locale of the widget

##Events

The following is a list of pub/sub event which the widget subscribes to:

* **launchpad-retail.p2pTransactions.newTransferSubmitted** - When this message is received, the transactions list is cleaned and more transactions are loaded


The following is a list of pub/sub event which the widget publishes to:

* **launchpad-retail.requestMoneyTransfer** - Published when the user selects the Transfer Money button, opens New Transfer widget
* **launchpad-retail.requestMoneyTransfer.setTab** - Published when the user selects the Transfer Money button, selects Email tab on New Transfer widget
Arguments: `{tab: 'P2P_EMAIL'}`

## Test


## Build
