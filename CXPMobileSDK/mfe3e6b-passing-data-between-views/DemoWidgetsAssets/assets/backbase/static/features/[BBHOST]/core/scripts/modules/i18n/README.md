#i18n

This module is responsible for internationalisation of all Launchpad widgets.

#####Configuration

External settings that are passed to it are:

- `locale` – <a href="http://www.w3.org/TR/html401/struct/dirlang.html#h-8.1.1">Language code</a>.
Read from the lang attribute of html tag of the page.
If lang attribute is not defined, fallbacks to browser's default language.
You can change locale on the fly by publishing `lpCoreI18nUtils.LOCALE_CHANGE_EVENT`

- `path` – Path where common translation files and angular locale files are stored.
Default path is `$(contextRoot)/static/launchpad/modules/config/i18n`

- `mergedFiles` – Used to determine if translation files are merged
into one (one common and one per widget) or every language is separated in it's own file.
Default value is `true` (files are merged)

Backend is responsible for determining the right locale and printing it as a value of `html.lang` attribute.
It is doing so in the following order:

1. If present, then return launchpad user(party) preference `lpLocale`.
2. If present, then return page preference `lpLocale`.
3. If present, then return portal preference `lpLocale`.
4. If present, then return value of `launchpad.defaultLocale` defined in `backbase.properties`.

To change the `path` and `mergedFiles` settings, create i18n object with those keys
on global window.launchpad object, for example:

```
window.launchpad = {
  i18n: {
    path: 'bower_components/config/i18n',
    mergedFiles: false
  }
}
```

Path to <a href="https://github.com/angular/angular.js/tree/master/src/ngLocale" target="_blank">angular locale files</a>
is built like: `path + '/ng-locale/angular-locale_{locale}.js'`,
where `{locale}` is replaced with current locale string.

Every Launchpad widgets contains property `locale` (accessible in Portal Manager).
This property is used just to enable/disable i18n support.
If there is no value, widget will not be initialized for i18n support.
Any value will enable i18n but it is never used internally.

#####Translation files

Widget translation strings are defined inside `locale/all.json` in widget's directory
and in `i18n.path/common.json` file. This applies when `mergedFiles` setting is set to true,
otherwise, each laguage will have it's own file in the same location.
Translation file can look like this:

```
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

#####Translation
To translate string used in Launchpad Widget html template, use angular tranlate filter:

```
<span>{{'Statement as of'|translate}}</span>
```

or lp-i18n directive described below.

#####Enable i18n Language Switching in the UI
To Enable i18n Language Switching in the UI, follow the below instructions to add a preference to a widget.
1. Open the PortalManager.
2. Navigate the Explorer to `Portals > Retail-banking > Items > Home`.
3. Select "widget-navbar-advanced..".
4. Select the "Properties" tab.
5. Activate the add property button "+".
6. In the "Create Preference" modal set.
 1. Name to locales.
 2. Label to locales.
 3. Value to en-US,nl-NL  (comma separated list of languages).
7. Click save and now in the Client Portal a language menu should appear.

Note: the language preference is not saved in a session.

##Table of content

- [Providers](#providers)
    - [lpCoreI18n](#lpCoreI18n)
- [Directives](#directives)
    - [lpI18n](#lpI18n)
    - [lpI18nSwitch](#lpI18nSwitch)
- [Filters](#filters)
    - [currencySymbol](#currencySymbol)
- [Constants](#constants)
    - [lpCoreI18nUtils](#lpCoreI18nUtils)

##Content

###Providers

####<a name="lpCoreI18n"></a>lpCoreI18n


{Description}

######Methods

#####`useWidgetInstance(widget)`

Set up i18n configuration based on widget instance

Params:

| Param| Type| Description|
| :----| :----| :----|
| widget| Object| instance widget|


<br>

#####`setLocale(locale)`

Changes locale of the widget module.

Params:

| Param| Type| Description|
| :----| :----| :----|
| locale| String| Locale string, e.g. 'en-US'|


<br>

#####`formatCurrency(amount, currency) :String`

Returns proper currency format, using currency filter.

Params:

| Param| Type| Description|
| :----| :----| :----|
| amount| Number| Amount|
| currency| String| Currency code|

Examples:

```
lpCoreI18n.formatCurrency(24, 'USD'); // "$24"
```


<br>

#####`formatDate(value, format) :String`

Returns localized date format, using date filter

Params:

| Param| Type| Description|
| :----| :----| :----|
| value| Number| Date as Unix timestamp|
| format| String| Format|

Examples:

```
lpCoreI18n.formatDate(1288323623006, 'yyyy-MM-dd HH:mm:ss Z'); // "2010-10-29 05:40:23 +0200"
```


<br>

#####`instant(string) :String`

Returns a translation instantly from the internal state of loaded translation.

Params:

| Param| Type| Description|
| :----| :----| :----|
| string| String| A string which represents a translation id or array of strings.|

Examples:

```
lpCoreI18n.instant('Enrol for Estatements'); // "Schrijf je in voor eStatements" for locale "nl-NL"
```


<br>

###Directives

####<a name="lpI18n"></a>lpI18n


Use lp-i18n angular directive to translate string used in Launchpad Widget HTML template.

Examples:

```
<span lp-i18n="Statement as of"></span>
```

`label`, `placeholder` and `help` attributes inside of `lp-field`, `lp-input`, `lp-text-input`,
`lp-password-input` or `lp-checkbox` directives will also be automatically translated:

```
<div lp-field="lp-field" label="Enrol for Estatements"></div>
```


<br>

####<a name="lpI18nSwitch"></a>lpI18nSwitch


{Description}


<br>

###Filters

####<a name="currencySymbol"></a>currencySymbol


Renders proper currency symbol.

Examples:

```
<span>{{'JPY'|currencySymbol}}</span>
<span>¥</span>
```


<br>

###Constants

####<a name="lpCoreI18nUtils"></a>lpCoreI18nUtils


NOTE: Doesn't work with angular Dependecy Injection

######Methods

#####`parseLocale(locale) :Object`

Normalizes locale string, returning object containing normalized string and external flag.

Params:

| Param| Type| Description|
| :----| :----| :----|
| locale| String| to normalize, e.g. 'en-us' or 'en_US' or 'EN-US' becomes 'en-US'|


<br>


<br>

