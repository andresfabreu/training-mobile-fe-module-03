# Card Loyalty

Offers details and actions for the loyalty program related to the selected credit card.

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-card-loyalty   | 1.0.0 			| Launchpad        |

## Dependencies

* [base][base-url]
* [core][core-url]
* [ui][ui-url]
* [module-accounts][module-accounts-url]

## Dev Dependencies

* [angular-mocks ~1.2.28][angular-mocks-url]
* [config][config-url]

## Preferences

Get widget preference `widget.getPreference(string)`

* **title**: Widget title
* **thumbnailUrl**: Url to the widget's icon
* **cardDataSrc**: Data source for cards data


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