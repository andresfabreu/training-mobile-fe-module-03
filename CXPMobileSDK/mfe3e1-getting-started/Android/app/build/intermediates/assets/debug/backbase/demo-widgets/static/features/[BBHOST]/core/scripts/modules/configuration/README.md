#configuration

Auto configuration module

##Table of content

- [Providers](#providers)
    - [lpCoreConfiguration](#lpCoreConfiguration)

##Content

###Providers

####<a name="lpCoreConfiguration"></a>lpCoreConfiguration


{Description}

######Methods

#####`getLocale() :String`

Returns current value of locale attribute

Examples:

```
var locale = configProvider.getLocale(); // "en"
```


<br>

#####`defineAttribute(attr, definition) :Undefined`

Defines a new config attribute with the specified attribute name
and the specified attribute description.

Params:

| Param| Type| Description|
| :----| :----| :----|
| attr| String| Attribute name|
| definition| Object| {Description}|

Examples:

```
// Define attribute "permission" and set "readonly" as a default value
configProvider.defineAttribute('permission', {
  'default': 'readonly'
});
```


<br>

#####`get(attr) :*`

Returns value of the specified attribute.
Returns default value if actual value is undefined.

Params:

| Param| Type| Description|
| :----| :----| :----|
| attr| String| Attribute name|


<br>

#####`getDefault(attr) :*`

Returns default value of the specified attribute or null,
if the attribute doesn't have default value;

Params:

| Param| Type| Description|
| :----| :----| :----|
| attr| String| Attribute name|

Examples:

```
// Read default value for "locale" attribute
var defaultValue = configProvider.getDefault('locale'); // "en"
```


<br>

#####`getAbsPath() :String`

Returns the ABS path if there is one. Only works if a widget is set, otherwise assumes
ABS path is on the root `/`.


<br>

