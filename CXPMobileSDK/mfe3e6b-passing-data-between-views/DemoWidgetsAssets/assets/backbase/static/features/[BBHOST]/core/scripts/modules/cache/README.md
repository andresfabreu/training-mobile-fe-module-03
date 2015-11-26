#cache

Provides generic cache system. Use this module to cache async calls.

##Table of content

- [Factories](#factories)
    - [lpCoreCachePromise](#lpCoreCachePromise)

##Content

###Factories

####<a name="lpCoreCachePromise"></a>lpCoreCachePromise


Returns cached promise for the key if it exists.
Otherwise calls the function returning promise, and return it.

Params:

| Param| Type| Description|
| :----| :----| :----|
| options| Object| Object containing:   {String} key        Cache key   {Function} promise  Function returning promise|

