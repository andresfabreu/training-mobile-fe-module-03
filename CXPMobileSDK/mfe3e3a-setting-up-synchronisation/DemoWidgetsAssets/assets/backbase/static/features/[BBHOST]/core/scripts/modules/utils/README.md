#utils

Core utilities module exposed as `lpCoreUtils` angular constant object.

##Table of content

- [Constants](#constants)
    - [lpCoreUtils](#lpCoreUtils)

##Content

###Constants

####<a name="lpCoreUtils"></a>lpCoreUtils


{Description}

######Methods

#####`getCookie(name) :String`

Returns cookie by name

Params:

| Param| Type| Description|
| :----| :----| :----|
| name| String| Name of a cookie|


<br>

#####`dateToISOString(date) :String`

Returns a string in ISO format, `YYYY-MM-DDTHH:mm:ss.sssZ`, UTC format.

Params:

| Param| Type| Description|
| :----| :----| :----|
| date| Date| The input date|


<br>

#####`isValidEmail(email) :Boolean`

Check if input is valid email address.

Params:

| Param| Type| Description|
| :----| :----| :----|
| email| String| Email address|


<br>

#####`isValidUUID(string) :Boolean`

Check if string is valid UUID

Params:

| Param| Type| Description|
| :----| :----| :----|
| string| String| {Description}|


<br>

#####`parseBoolean(val) :Boolean`

Normalizes boolean values, to be real Boolean type.

Params:

| Param| Type| Description|
| :----| :----| :----|
| val| String,Boolean,Number| {Description}|

Examples:

```
lpCoreUtils.parseBoolean(''); // false
```


<br>

#####`resolvePortalPlaceholders(string) :String`

Resolve portal client placeholders.

Params:

| Param| Type| Description|
| :----| :----| :----|
| string| String| Path to be resolved|

Examples:

```
lpCoreUtils.resolvePortalPlaceholders('$(contextPath)/some/page.html'); // "/real/context/path/some/page.html"
```


<br>

#####`getWidgetBaseUrl(widgetInstance) :String`

Returns the base URL of the given widget instance.

Params:

| Param| Type| Description|
| :----| :----| :----|
| widgetInstance| Widget| Instance of the widget|


<br>

#####`getPortalProperty(property) :String`

Return value of the portal configuration property

Params:

| Param| Type| Description|
| :----| :----| :----|
| property| String| Name of the portal property|


<br>

#####`getPagePreference(prop) :String`

Returns value of the page configuration preference

Params:

| Param| Type| Description|
| :----| :----| :----|
| prop| String| Name of the page property|


<br>

#####`getPortalPage() :Element`

Returns the portal page element


<br>

#####`stripHtml(str) :String`

Removes all the html tags from `str`.

Params:

| Param| Type| Description|
| :----| :----| :----|
| str| String| Input string|


<br>

#####`parseQuerystring(str) :Object`

Given a `string` returns the json `object` equivalent.

Params:

| Param| Type| Description|
| :----| :----| :----|
| str| String| The query string|


<br>

#####`buildQueryString(obj) :String`

Given an `object` returns its query string equivalent.

Params:

| Param| Type| Description|
| :----| :----| :----|
| obj| Object| A json compliant object|

Examples:

```
lpCoreUtils.buildQueryString({
  search: 'backbase',
  page: 3
}); // "search=backbase&page=3"
```


<br>


<br>

