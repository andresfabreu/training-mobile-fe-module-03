# Launchpad Core :: I18n Module

## Information
| name                  | version       | bundle     |
| ----------------------|:-------------:| ----------:|
| core.i18n             | 1.0.0         | launchpad  |

## Dependencies
* [base](http://stash.backbase.com:7990/projects/lpm/repos/foundation-base/browse/)
* [angular-translate](https://github.com/angular-translate/angular-translate)
* [angular-dynamic-locale](https://github.com/lgalfaso/angular-dynamic-locale)

## Configuration

There are 3 preferences which values determine how widget localization is handled:

* `locale` - main locale string, for example: _en-US_ or _nl-NL_
* `commonTranslationPath` - path to the file with common translation strings, used by all widgets
* `localeLocationPattern` - path to the Angular's [ngLocale locale file](https://github.com/angular/angular.js/tree/master/src/ngLocale) used for time/date/number formatting 

Values of these preferences are determined in the following order:

* page preference of the same name
* or portal preference (set inside `backbase.properties` file)
* or for `locale` preference, _navigator.locale_ property of the browser

## Translation Files

Widget translation strings are defined inside `locale/all.json` in widget's directory or in common translation file.
Translation file can look like this:

```json
{
  "nl-NL": {
    "Enrol for Estatements": "Schrijf je in voor eStatements",
    "Statement as of": "Verklaring als van"
  },

  "ru-RU": {
    "Enrol for Estatements": "Получать отчеты",
    "Statement as of": "Отчет за"
  }
}
```

## Examples

To translate string used in Launchpad Widget html template, use lp-i18n angular directive, for example:

```html
<span lp-i18n="Statement as of"></span>
```

or use angular filter:

```html
<span>{{'Statement as of'|translate}}</span>
```

`label`, `placeholder` and `help` attributes inside of `lp-field, lp-input, lp-text-input, lp-password-input` or `lp-checkbox` directives will also be automatically translated 

```html
<div lp-field="lp-field" label="Enrol for Estatements"></div>
```

## API

### lpCoreI18n

#### Methods:

##### .setLocale(locale)
>_locale_: locale string  
Set locale to dynamically change translation of the current page

##### .formatCurrency(amount, currency)
>_amount_: Number respresenting amount  
_currency_: String, currency code  
Returns proper currency format, using [currency filter](https://docs.angularjs.org/api/ng/filter/currency).
Example:

```js
lpCoreI18n.formatCurrency(24, 'USD'); // returns $24
```

##### .formatDate(value, format)
>_value_: Number respresenting date
_format_: String, representing format
Returns localized date format, using [date filter](https://docs.angularjs.org/api/ng/filter/date).
Example:

```js
lpCoreI18n.formatDate(1288323623006, 'yyyy-MM-dd HH:mm:ss Z'); // returns '2010-10-29 05:40:23 +0200'
```

##### .instant(translationId)
>_translationId_: A string which represents a translation id or array of strings.  
Returns a translation instantly from the internal state of loaded translation.
Example:

```js
lpCoreI18n.instant('Enrol for Estatements'); // returns 'Schrijf je in voor eStatements' for locale 'nl-NL'
```

### lpCoreI18nUtils

#### Properties:

###### CURRENCY_MAP
>_default_: {..., 'EUR': '€', ... GBP': '£', 'USD': '$', ...}  
Hash containing currency symbols for every currency code.
Example:

```js
lpCoreI18nUtils.CURRENCY_MAP.USD // returns $
```

###### COMMON_I18N_LOAD_EVENT
>_default_: 'lpi18n:data:load'  
Name of the event triggered when locale data is loaded

###### LOCALE_CHANGE_EVENT
>_default_: 'lpi18n:locale:change'  
Name of the event triggered when locale string changes

```js
lpCoreBus.subscribe(lpCoreI18nUtils.LOCALE_CHANGE_EVENT, function(locale) {
    alert(locale); // alerts current locale
});
```

#### Methods:

##### .parseLocale(locale)
>_locale_: locale string  
Normalizes locale string, returning object containing normalized string and external flag.
Example:

```js
lpCoreI18nUtils.parseLocale('en_us'); // returns {id: 'en-US', external: false}
```
