# Accounts Dropdown

## Information

| name                          | version           | bundle           |
| ------------------------------|:-----------------:| ----------------:|
| widget-accounts-dropdown	    | 1.0.0 		      	| Banking          |

## Brief Description

Implements a dropdown with all accounts as items and one special item 'All Accounts'

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

Get widget preference `lpWidget.getPreference(string)`

* **accountsDataSrc**: Endpoint to list of accounts
* **initialAccountId**: Account to be pre-selected (default --> '', means "All Accounts" will be selected)
   

Get preference inherited from widget's parents `lpWidget.getPreferenceFromParents(string)`

* 

##Events

The following is a list of pub/sub event which the widget subscribes to:

* 

The following is a list of pub/sub event which the widget publishes to:

* **lpAccounts.loaded** - Emits the event when a list of accounts loaded
Arguments: `accounts list`
* **lpAccounts.failed** - Emits the event when a list of accounts failed to load
* **launchpad-retail.accountSelected** - Emits the event when an account is selected
Arguments: `{accountId: account.id}`

## Test

```bash
$ bblp start
```

with watch flag
```bash
bblp test -w
```


## Build

```bash
$ bblp build
```