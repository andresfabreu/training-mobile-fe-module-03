#core

Launchpad Core module contains commonly used APIs for all Launchpad modules.

|  Name |  Version |  Bundle |
|--|--|--|
|  core |  2.12.4 |  launchpad |

##Dependencies


- base ^2.0.0
- angular-resource ~1.2.28
- angular-translate ~2.6.0
- moment ~2.9.0
- angular-dynamic-locale ~0.1.27
- jquery ~2.1.4

##Usage

###Install


1. Install core module:

```
bower i core --save
```

1. Add `core` as a dependency of your angular module:

```
// main.js
var core = require('core');
var deps = [
  ...
  core.name,
  ...
];

module.exports = base.createModule(module.name, deps);
```
###Develop

```
git clone ssh://git@stash.backbase.com:7999/LPM/foundation-core.git
cd core

bower install && bblp start
```
###Testing

```
bblp test
```
###Build

```
bblp build
```
##Content

###Modules


- [bus](scripts/modules/bus/README.md)
- [cache](scripts/modules/cache/README.md)
- [configuration](scripts/modules/configuration/README.md)
- [error](scripts/modules/error/README.md)
- [http](scripts/modules/http/README.md)
- [i18n](scripts/modules/i18n/README.md)
- [session](scripts/modules/session/README.md)
- [store](scripts/modules/store/README.md)
- [template](scripts/modules/template/README.md)
- [update](scripts/modules/update/README.md)
- [utils](scripts/modules/utils/README.md)

