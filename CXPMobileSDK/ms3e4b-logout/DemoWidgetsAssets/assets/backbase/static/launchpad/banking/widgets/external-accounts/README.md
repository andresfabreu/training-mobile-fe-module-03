# External Accounts

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-external-accounts    | 1.0.0 			| Banking        |

## Brief Description

Provides the ability of adding external accounts to the online banking solution.
The widget displays a list of accounts and their groups. Different accounts may offer different interaction and information options. An account can be a pension scheme, a complex savings product or a straightforward current on-demand account. 

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

* **financialInstitutionsSrc**: The URL endpoint to retrieve the list of financial institutions
* **membershipRequestsSrc**: The URL endpoint to retrieve membership requests
* **amountToLoad**: Amount of financial institutions to be loaded at each increment of the lazy loading mechanism
   

##Events

The following is a list of pub/sub event which the widget subscribes to:

_This widget does not subscribe to any events._


The following is a list of pub/sub event which the widget publishes to:

* **launchpad-retail.closeActivePanel** - Published when the active panel is closed
