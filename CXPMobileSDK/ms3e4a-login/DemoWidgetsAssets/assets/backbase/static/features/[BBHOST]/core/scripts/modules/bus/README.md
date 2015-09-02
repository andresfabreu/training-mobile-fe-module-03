#bus

A mediator object that implements
the <a href="http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern" target="_blank">pub/sub pattern</a>.
Any object can publish an event, optionally passing some data
in a channel, and all the subscribed listeners to that
event in that channel will be called in order.

##Table of content

- [Providers](#providers)
    - [lpCoreBus](#lpCoreBus)

##Content

###Providers

####<a name="lpCoreBus"></a>lpCoreBus


NOTE: If `windows.gadgets.pubsub` is available, this service is just a wrapper around it.

All event names should include the source of the event and the type of event separated by a colon character.

######Methods

#####`subscribe(name, callback) :Undefined`

Adds the specified event listener for the specified event.
Allows subscription to the events published by other Launchpad modules / widgets.

Params:

| Param| Type| Description|
| :----| :----| :----|
| name| String| Event name|
| callback| Function| Listener|

Examples:

```
bus.subscribe('someEvent', function (data) {
  console.log('Event has published with:', data);
});
```


<br>

#####`publish(name) :Undefined`

Publishes the specified event.
Allows publishing of events that other modules / widgets can subscribe to.

Params:

| Param| Type| Description|
| :----| :----| :----|
| name| String| Event name|

Examples:

```
var handler = function (arg1, arg2) {
  console.log('Event has published', arg1, arg2);
};

bus.subscribe('someEvent', handler);
bus.publish('someEvent', 'Hello', {foo: 'bar'}); // Event has published, Hello, {foo: "bar"}
```


<br>

#####`unsubscribe(name, callback) :Undefined`

Unsubscribes callback function from the event published by other Launchpad modules / widgets.

Params:

| Param| Type| Description|
| :----| :----| :----|
| name| String| Event name|
| callback| Function| Listener|

Examples:

```
var handler = function () {
  console.log('Event has published');
};

bus.subscribe('someEvent', handler);
bus.publish('someEvent'); // Event has published

bus.unsubscribe('someEvent', handler);
bus.publish('someEvent'); // Nothing happened here
```


<br>

