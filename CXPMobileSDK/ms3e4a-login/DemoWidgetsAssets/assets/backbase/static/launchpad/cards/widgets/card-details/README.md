# Card Details

Widget allows to see important information about the selected credit card. 
The information and actions are defined by the services available per card.

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-card-details   | 1.0.0 			| Launchpad        |

## Dependencies

* base
* core
* ui
* module-accounts

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `widget.getPreference(string)`

* **title**: Widget title
* **thumbnailUrl**: Url to the widget's icon
* **cardDataSrc**: Data source for Cards data


##Events

The following is a list of pub/sub event which the widget subscribes to:

* **launchpad-retail.cardSelected**


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
[module-accounts-url]: https://stash.backbase.com/projects/LPM/repos/module-accounts/browse/