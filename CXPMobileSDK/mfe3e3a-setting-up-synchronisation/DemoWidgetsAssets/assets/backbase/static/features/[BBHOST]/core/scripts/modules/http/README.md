#http

Main lpCoreHttp module

##Table of content

- [Factories](#factories)
    - [lpCoreHttpInterceptor](#lpCoreHttpInterceptor)

##Content

###Factories

####<a name="lpCoreHttpInterceptor"></a>lpCoreHttpInterceptor


Request/Response http interceptor

######Methods

#####`request(config) :Object`

Interceptors get called with a http config object.
The function is free to modify the config object or create a new one.
The function needs to return the config object directly,
or a promise containing the config or a new config object.

Params:

| Param| Type| Description|
| :----| :----| :----|
| config| Object| Original request configuration|


<br>

#####`requestError(responseErr) :Object`

Interceptor gets called when a previous interceptor threw an error or resolved with a rejection.

Params:

| Param| Type| Description|
| :----| :----| :----|
| responseErr| Object| Response http error|


<br>

#####`response(response) :Object`

Interceptors get called with http response object.
The function is free to modify the response object or create a new one.
The function needs to return the response object directly,
or as a promise containing the response or a new response object.

Params:

| Param| Type| Description|
| :----| :----| :----|
| response| Object| HTTP response|


<br>

#####`responseError(responseErr) :Object`

Interceptor gets called when a previous interceptor threw an error or resolved with a rejection.

Params:

| Param| Type| Description|
| :----| :----| :----|
| responseErr| Object| Response http error|


<br>

#####`configureNotifications(params)`

Configuring of responseError interceptor notification behavior. Widgets have ability to prevent notifications from poping up for certain endpoints.

Params:

| Param| Type| Description|
| :----| :----| :----|
| params| Object| Configuration of the notifications and retry queue.|
| params.ignore| Array| Array of urls or regular expression patters responseError interseptor will use to decide whether to show notification or not.|

Examples:

Here is the example of how widget can configure interceptor to ignore accounts and debit accounts modules service error, as well as an example of regular expression pattern:

```
lpCoreHttpInterceptor.configureNotifications({
    ignore: [
        widget.getPreference('accountsDataSrc'),
        '$(servicesPath)/services/rest/v1/debit-accounts',
        /services\/profile\/.+?/
    ]
});
```

Ignore array can contain of simple URL strings or regular expression patterns. Placeholders like `$(servicesPath)` and `$(contextRoot)` are substituted automatically.


<br>

