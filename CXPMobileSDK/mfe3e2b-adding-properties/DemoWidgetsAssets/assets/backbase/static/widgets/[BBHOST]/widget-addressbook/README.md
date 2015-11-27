# Addressbook

Offer users single location to manage and interact with their (finance related) contacts.

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-addressbook    | 3.0.5 			| Launchpad        |

## Dependencies

* [base][base-url]
* [core][core-url]
* [ui][ui-url]
* [module-payments][module-payments-url]
* [module-contacts][module-contacts-url]
* [module-transactions][module-transactions-url]
* [module-accounts][module-accounts-url]

## Dev Dependencies

* [angular-mocks ~1.2.28][angular-mocks-url]
* [config][config-url]

## Preferences

Get widget preference `widget.getPreference(string)`

* **title**: Widget title
* **thumbnailUrl**: Url to the widget's icon
* **paymentOrdersDataSrc**: The URL endpoint for the payment orders, passed to [module-payments][module-payments-url]
* **contactListDataSrc**: The URL endpoint to retrieve the list of contacts for the user
* **contactDataSrc**: The URL endpoint to retrieve an individual contact
* **contactDetailsDataSrc**: The URL endpoint to retrieve various details about the contact, including transaction history
* **messageSrc**: The URL endpoint to retrieve the different keywords used by the Addressbook widget
* **locale**: Locale settings
   

Get preference inherited from widget's parents `widget.getPreferenceFromParents(string)`

* **defaultAccount**: The default account

##Events

The following is a list of pub/sub event which the widget subscribes to:

* **launchpad.contacts.load** - When this message is received, the widget will reload its contacts model


The following is a list of pub/sub event which the widget publishes to:

* **launchpad-retail.transactions.applyFilter** - Publishes an applyFilter event to any interested parties.
Arguments: `{contactName: contact.name, filters: { contact: contact.account}}`
* **launchpad-retail.paymentOrderInitiated** - Published when a quick transfer is placed, opens the Review Transfers widget

## Templates

Widget uses templates with the following keys:

* **addressbook** - Main widget template.
* **contactsAdd** - Add new contact template.
* **contactsEdit** - Edit contact template.
* **contactsList** - List contacts template.
* **contactsNone** - Empty addressbook template.
* **contactsView** - View selected contact template.

To redefine template create preference with this format: widgetTemplate_{templateKey}.

For example, for main template create property `widgetTemplate_addressbook` with the value equal to a path to load template from. The path can either be local relative path or external absolute path (http:// and https:// protocols).

## Test

```bash
$ bb start
```

with watch flag
```bash
bb test -w
```


## Build

```bash
$ bb build
```

##TODO

* Move jquery/placeholder dependency to UI

[base-url]:http://stash.backbase.com:7990/projects/lpm/repos/foundation-base/browse/
[core-url]: http://stash.backbase.com:7990/projects/lpm/repos/foundation-core/browse/
[ui-url]: http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/
[config-url]: https://stash.backbase.com/projects/LP/repos/config/browse
[api-url]:http://stash.backbase.com:7990/projects/LPM/repos/api/browse/
[angular-mocks-url]:https://github.com/angular/bower-angular-mocks/
[module-payments-url]: http://stash.backbase.com:7990/projects/lpm/repos/module-payments/browse/
[module-contacts-url]: https://stash.backbase.com/projects/LPM/repos/module-contacts/browse/
[module-transactions-url]: https://stash.backbase.com/projects/LPM/repos/module-transactions/browse/
[module-accounts-url]: https://stash.backbase.com/projects/LPM/repos/module-accounts/browse/