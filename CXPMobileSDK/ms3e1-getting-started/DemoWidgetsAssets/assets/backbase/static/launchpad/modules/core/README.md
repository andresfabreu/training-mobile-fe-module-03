Launchpad Core Module

#Information
| name                  | version       | bundle     |
| ----------------------|:-------------:| ----------:|
| core                  | 1.0.0         | launchpad  |

##Dependencies
* [base][base-url]

## Modules:
* [bus](scripts/modules/bus)
* [error](scripts/modules/error)
* [http](scripts/modules/http)
* [i18n](scripts/modules/i18n)
* [session](scripts/modules/session)
* [store](scripts/modules/store)
* [template](scripts/modules/template)
* [utils](scripts/modules/utils)


## Table of Contents
- [Install](#develop)
- [Develop](#resources)
- [Unit Test/Lint](#test)
- [Build](#build)

##<a name="install"></a> Install

```bash
bower i core --save
```

##<a name="develop"></a> Develop

```bash
git clone ssh://git@stash.backbase.com:7999/LPM/foundation-core.git
cd core

bb install -l && bb start
```

##<a name="testing"></a> Testing

```bash
bb test
```

##<a name="build"></a> Build

```bash
bb build
```


[base-url]:http://stash.backbase.com:7990/projects/lpm/repos/foundation-base/browse/
[core-url]: http://stash.backbase.com:7990/projects/lpm/repos/foundation-core/browse/
[ui-url]: http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/
[config-url]: http://stash.backbase.com:7990/projects/LP/repos/widget-config-sample/browse/
[api-url]:http://stash.backbase.com:7990/projects/LPM/repos/api/browse/
