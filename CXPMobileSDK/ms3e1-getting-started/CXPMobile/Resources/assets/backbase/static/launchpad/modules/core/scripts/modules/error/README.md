# Launchpad Core :: Error Module

Error handler system

## Information
| name                  | version       | bundle     |
| ----------------------|:-------------:| ----------:|
| core.error            | 1.0.0         | launchpad  |

## Dependencies
* [base][base-url]

## Table of Contents

- [Configuration](#config)
- [Api](#api)
- [Events](#events)
- [Resources](#resources)


## <a name="config"></a> Configuration
Overides the default Angular [$exceptionHandler](https://docs.angularjs.org/api/ng/service/$exceptionHandler) action.


## <a name="api"></a> Api

**lpCoreError** is the name of the factory API.

```javascript
//Create a custom Error Exception
lpCoreError.createException
//Capture the exception and pass it to Angular exceptionHandler
lpCoreError.captureException
// Throwing Error
lpCoreError.throwException
//Throwing Error async
lpCoreError.throwExceptionAsync
```

## Throwing errors

1. Throwing normal Error object (not recomended)
 
```javascript
exports.MainCtrl = function(lpCoreError) {
    if(somethingWrong) {
        lpCoreError.throwException('Normal Error');
    }
}
```

- this will throw an exception.name of type **Error** which will be caught by the **$exceptionHandler**

2. Throwing your own errors (exceptions) (recommended, categorized exceptions)
 
```javascript
// Create a custom exception Error with Widgets.SampleWidget as name
var WidgetErrorException = lpCoreError.createException('WidgetError');

exports.MainCtrl = function(lpCoreError) {
    if(somethingWrong) {
         lpCoreError.throwException( new WidgetErrorException('message something wrong'));
    }
}
```

- this will throw an exception.name of type **WidgetError** 

2. Throwing errors in promises

```javascript
 var someOtherAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    lpCoreError.throwException( new WidgetErrorException('something wrong'));
  });
};
```

- you don't need to use reject method.

### Correctly throwing an error

1. Errors should be thrown in the low-level parts of the application (**base,core, modules**)

2. Always throw an instance of Error class, never throw a string or an object. Getting stack trace is only possible via Error object, for example.

3. Throwing an error stops code execution. If the error is not serious enough, throw it asynchronously


##Capturing errors

1. Used in a try-catch block

```javascript
try {
    someUnpredictableMethod();
} catch(error) {
    lpCoreError.captureException(error);
}
```

2. Used in a Promise

```javascript
someAsyncThing()
    .then(someOtherAsyncThing)
    .catch(function(error) {
        lpCoreError.captureException(error);
    });
```

- you can pass extra option in **lpCoreError.captureException(error, {some: 'option'})**


### Custom Error types in LP
1. Widgets Error types
**WidgetError**

```javascript
var WidgetErrorException = lpCoreError.createException('WidgetError');
```

2. Modules Error types
**ModuleError**

```javascript
var ModuleErrorException = lpCoreError.createException('ModuleError');
```


3. Core Error types
    *   **LPCoreHttp**
    *   **LPCoreI18n**
    *   **LPCoreStore**
    *   **LPCoreBus**
    *   ...etc..

### Error types

Besides the generic Error constructor, there are six other core error constructors in JavaScript. For client-side exceptions, see Exception Handling Statements.

1. **EvalError**
Creates an instance representing an error that occurs regarding the global function eval().

2. **InternalError** 
Creates an instance representing an error that occurs when an internal error in the JavaScript engine is thrown. E.g. "too much recursion".

3. **RangeError**
Creates an instance representing an error that occurs when a numeric variable or parameter is outside of its valid range.

4. **ReferenceError**
Creates an instance representing an error that occurs when de-referencing an invalid reference.

5. **SyntaxError**
Creates an instance representing a syntax error that occurs while parsing code in eval().

6. **TypeError**
Creates an instance representing an error that occurs when a variable or parameter is not of a valid type.

7. **URIError**
Creates an instance representing an error that occurs when encodeURI() or decodeURI() are 

##<a name="event"></a> Events

*TODO broadcast some specific errors EX. (connection timeout )*

##<a name="resources"></a> Resources
http://www.slideshare.net/nzakas/enterprise-javascript-error-handling-presentation
http://eloquentjavascript.net/1st_edition/chapter5.html
https://docs.angularjs.org/api/ng/service/$exceptionHandler
http://blog.loadimpact.com/2014/06/03/exception-handling-in-an-angularjs-web-application-tutorial/
https://technology.amis.nl/2014/10/06/automatic-error-handling-in-angularjs/
http://odetocode.com/blogs/scott/archive/2014/04/21/better-error-handling-in-angularjs.aspx
http://bahmutov.calepin.co/catch-all-errors-in-angular-app.html
http://www.nczonline.net/blog/2009/03/03/the-art-of-throwing-javascript-errors/


[base-url]:http://stash.backbase.com:7990/projects/lpm/repos/foundation-base/browse/
[core-url]: http://stash.backbase.com:7990/projects/lpm/repos/foundation-core/browse/
[ui-url]: http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/
[config-url]: https://stash.backbase.com/projects/LP/repos/config/browse
[api-url]:http://stash.backbase.com:7990/projects/LPM/repos/api/browse/
