# Accounts

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-accounts	    | 1.0.0 			| Banking          |

## Brief Description

Provides a list of accounts tied to the user currently logged in. Accounts can be grouped.
When a specific account is selected, other widgets may listen for this event and update their view or options. Different accounts may offer different interaction and information options. An account can be a pension scheme, a complex savings product or a straightforward current on­demand account. 

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

* **showGroups**: Show/hide group names
* **showGroupTotals**: Show/hide group total balances
* **showAccountHolderName**: Show/hide name of the account holder
* **showAccountType**: Show/hide account type
* **showAccountHolderCategory**: Show/hide category of the account holder
   

Get preference inherited from widget's parents `widget.getPreferenceFromParents(string)`

* **preferredBalanceView**: Defines the default balance (current or available)

##Events

The following is a list of pub/sub event which the widget subscribes to:

* **launchpad-retail.accountSelected** - Listens for selected accounts and highlights that account
* **lpDataFreshnessRefresh** - Refreshes the widget if data freshness status changes from `updating` to `actual`


The following is a list of pub/sub event which the widget publishes to:

* **launchpad-retail.portfolioSelected** - Emits the event when a portfolio is selected
* **launchpad-retail.openCardManagement** - Emits the event when a card is selected
* **launchpad-retail.cardSelected** - Emits the event when a card is selected
Arguments: `{account: account}`
* **launchpad-retail.accountSelected** - Emits the event when an account is selected
Arguments: `{accountId: account.id, originType: 'accounts'}`
* **launchpad-retail.requestMoneyTransfer** - Emits the event when the button Transfer Money is selected
