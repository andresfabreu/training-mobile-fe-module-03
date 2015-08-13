# Profile Summary

## Information

| name                   | version           | bundle           |
| -----------------------|:-----------------:| ----------------:|
| widget-profile-summary | 2.1.0 			| Universal        |

## Brief Description

Displays information about the currently logged in user. Additionally, it can also provide the ability to navigate to the profile details view and to logout.

## Dependencies

* base
* core
* ui

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

* **profileLink**: The URL for the user profile
* **preferenceService**: The end-point URL to save the user preferences


##Events

_This widget does not subscribe/publish to any events._


## Test

```bash
$ bb start
```

with watch flag
```bash
bb test -w
```


## Build

```bash
$ bb build
```


[base-url]:http://stash.backbase.com:7990/projects/lpm/repos/foundation-base/browse/
[core-url]: http://stash.backbase.com:7990/projects/lpm/repos/foundation-core/browse/
[ui-url]: http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/
[config-url]: https://stash.backbase.com/projects/LP/repos/config/browse
[api-url]:http://stash.backbase.com:7990/projects/LPM/repos/api/browse/
[angular-mocks-url]:https://github.com/angular/bower-angular-mocks/
[module-accounts-url]:https://stash.backbase.com/projects/LPM/repos/module-accounts/browse/
