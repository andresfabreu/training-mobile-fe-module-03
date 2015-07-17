#Launchpad Core :: Update Module

A module which should configure updating widgets' models depending on other widgets actions

## Information
| name                  | version       | bundle     |
| ----------------------|:-------------:| ----------:|
| core.update           | 1.0.0         | launchpad  |

## Dependencies
* [base][base-url]

### Main idea
* [description](https://docs.google.com/a/backbase.com/document/d/1BtDNCvYegmyzel4YPBFNxJaUZ2ywYUeBbzkLB4LpQzM/edit)

###lpCoreUpdate

Example of subscribing at an update event within the widget's controller:

```javascript
var invoker = function() { ctrl.widgetModel.load(); };
lpCoreUpdate.subscribe(widget.name, invoker);
```

Example of triggering update event:

```javascript
var eventName = widget.name;
lpCoreUpdate.trigger(eventName);
```


[base-url]:http://stash.backbase.com:7990/projects/lpm/repos/foundation-base/browse/
[core-url]: http://stash.backbase.com:7990/projects/lpm/repos/foundation-core/browse/
[ui-url]: http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/
[config-url]: https://stash.backbase.com/projects/LP/repos/config/browse
[api-url]:http://stash.backbase.com:7990/projects/LPM/repos/api/browse/
