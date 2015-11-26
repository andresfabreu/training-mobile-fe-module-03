
Base Launchpad library including 3rd party and requirejs configuration

# Information

| name                  | version       | bundle     |
| ----------------------|:-------------:| ----------:|
| base                  | 1.0.0        | launchpad  |

## Dependencies
* [angular ~1.2.28](https://code.angularjs.org/1.2.28/docs/api)
* [lodash ~3.3.0](https://lodash.com/docs)

## Dev Dependencies
* [angular-mocks ~1.2.28](https://github.com/angular/bower-angular-mocks)
* [config] [config-url]


## Table of Contents
- [Install](#develop)
- [Develop](#resources)
- [Usage](#usage)
- [Unit Test/Lint](#test)
- [Build](#build)


##<a name="install"></a> Install

```bash
bower i base && bower link
```

##<a name="develop"></a> Develop

```bash
git clone ssh://git@stash.backbase.com:7999/lpm/foundation-base.git && cd base    
bower install
bower link
```

##<a name="usage"></a> Usage

* Create Angular Module

```javascript

module.name = 'widget-demo';

var base = require('base');
var deps = []; // no deps

// Create Angular Module
module.exports = base.createModule(module.name, deps);

```

* Require Widget

Global function to bootstrap widgets


```javascript

base.requireWidget(__WIDGET__ , 'scripts/main');

//or

requireWidget(__WIDGET__, 'dist/scripts/main');
```



* Using external utils

```javascript

var utils = require('base').utils // lodash + base utils

var ng = require('base').ng // angular

```


##<a name="testing"></a> Testing

```
bb test
```

with watch flag
```
bb test -w
```

##<a name="build"></a> Build

```
bb build
```



[base-url]:http://stash.backbase.com:7990/projects/lpm/repos/foundation-base/browse/
[core-url]: http://stash.backbase.com:7990/projects/lpm/repos/foundation-core/browse/
[ui-url]: http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/
[config-url]: https://stash.backbase.com/projects/LP/repos/config/browse
[api-url]:http://stash.backbase.com:7990/projects/LPM/repos/api/browse/
[angular-mocks]:https://github.com/angular/bower-angular-mocks
