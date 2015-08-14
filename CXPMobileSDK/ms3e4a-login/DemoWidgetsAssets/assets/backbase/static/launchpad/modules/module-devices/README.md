# module-devices
Module for providing data for authorized devices.


# Information
| name                  | version       | bundle     |
| ----------------------|:-------------:| ----------:|
| module-devices        | 1.0.0         | launchpad  |


## Dependencies
* [base][base-url]
* [core][core-url]


## Table of Contents

- [Provider](#provider)
- [API](#API)
- [Build](#build)
- [Test](#Test)

##<a name="provider"></a> Provider

* Provider can be configured using setConfig method:

```
    function run(lpWidget, lpDevices) {
        lpDevices.setConfig({
            'devicesEndpoint': lpWidget.getPreference('devicesEndpoint')
        });
    }
```

* The url for getting mock data is:

> /mock/v1/authorized-devices

##<a name="API"></a> API

The exposed API is the following:

* getAll

> gets all authorized devices

##<a name="build"></a> Build

```
bblp build
```

##<a name="test"></a> Test

```
bblp test
```

