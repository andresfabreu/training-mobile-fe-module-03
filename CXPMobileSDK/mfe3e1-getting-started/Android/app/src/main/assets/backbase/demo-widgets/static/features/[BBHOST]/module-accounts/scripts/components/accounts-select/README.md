# Account Select

Used to render a drop-down select box for a user to select from a list of their bank accounts.

## Dependencies
* dropdown-select (ui {angular-bootstrap})
* lp-amount (ui)
* lp-aria-number (ui)
* lp-i18n (core)
* lp-responsive (ui)

## Attributes

- **preferredBalanceView**. {String} To show either current, or available balance. Options: current, available. Default: current.
- **type**. {String} To show as either list of cards, or list of accounts. Options: cards, accounts. Default: accounts.
- **designatedClass**. {String} Additional class to add to the root element.
- **hideAmounts** {Boolean} Whether or not to hide amount fields.
- **ngModel**. The object that will be bound to the selected account.
- **customFields**. Comma-separated list of additional fields to show in the select box.
