# Launchpad Core :: Bus Module

A mediator object that implements the pub/sub pattern. Any object can publish an event, optionally passing some data, in a channel and all the subscribed listeners to that event in that channel will be called in order.

## Information
| name                  | version       | bundle     |
| ----------------------|:-------------:| ----------:|
| core.bus              | 1.0.0         | launchpad  |

## Dependencies
* [base][base-url]

## Includes

### Factories

#### lpCoreBus

To create a new channel or get an already created one.

```javascript
var channel = lpCoreBus.getChannel('widget-sample');
```

Use the channel to publish/subscribe on that channel events. An event should include the source of the event and the type of event separated by a colon character.

```javascript
var event = 'user:add';
channel.publish(event);
channel.subscribe(event, function() { console.log('User added'); });
```

It is possible to publish/subscribe an event in a channel directly.

```javascript
var channel = 'widget-sample';
var event = 'user:error';
var data = {
    code: 400,
    message: 'User not found'
};

lpCoreBus.publish(channel, event, data);
lpCoreBus.subscribe(channel, event, function(error) { ... });
```

#### lpCoreBus.EventEmitter

The bus factory also exposes the internal eventemitter to use separetely from the bus itself. It is useful sometimes to emit and listen events between cooperating objects. For that you can create a new `eventemitter`

```javascript
var emitter = lpCoreBus.EventEmitter.create();

emitter.on('warning', function(message) {
    console.log(message);
});

emitter.emit('warning', 'Lorem ipsum');
```

or you can mix the `eventemitter` methods right into the object and use them as it were part of the original object.

```javascript
var alerts = {
    show: function(message) {
        ...
        this.emit('show', message);
    }
};

lpCoreBus.EventEmitter.mixin(alerts);
```


[base-url]:http://stash.backbase.com:7990/projects/lpm/repos/foundation-base/browse/
[core-url]: http://stash.backbase.com:7990/projects/lpm/repos/foundation-core/browse/
[ui-url]: http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/
[config-url]: https://stash.backbase.com/projects/LP/repos/config/browse
[api-url]:http://stash.backbase.com:7990/projects/LPM/repos/api/browse/
