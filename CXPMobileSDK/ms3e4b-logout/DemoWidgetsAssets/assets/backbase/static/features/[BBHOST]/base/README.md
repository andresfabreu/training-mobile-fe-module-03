
Base Launchpad library including 3rd party and requirejs configuration

# Information

| name                  | version       | bundle     |
| ----------------------|:-------------:| ----------:|
| base                  | 2.8.0        | launchpad  |


## Dependencies
* [angular ~1.2.28](https://code.angularjs.org/1.2.28/docs/api)
* [lodash ~3.10.1](https://lodash.com/docs)
* [jquery ~2.1.3](https://lodash.com/docs) - for now is used for testing purpose

## Dev Dependencies
* [angular-mocks ~1.2.28](https://github.com/angular/bower-angular-mocks)
* config 2.x


## Install

```bash
bower i base && bower link
```

## Develop

```bash
git clone ssh://git@stash.backbase.com:7999/lpm/foundation-base.git  base && cd base    
bower install
bower link
```

## Usage

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

```


## Testing

```
bblp test
```

with watch flag
```
bblp test -w
```

## Build

```
bblp build
```




