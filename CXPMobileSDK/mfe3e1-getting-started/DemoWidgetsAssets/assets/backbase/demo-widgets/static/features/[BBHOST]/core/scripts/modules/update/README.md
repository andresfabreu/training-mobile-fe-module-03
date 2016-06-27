#update

Configures
<a href="https://docs.google.com/document/d/1BtDNCvYegmyzel4YPBFNxJaUZ2ywYUeBbzkLB4LpQzM/edit">updating</a>
widgets' models depending on other widgets actions.

##Table of content

- [Providers](#providers)
    - [lpCoreUpdate](#lpCoreUpdate)

##Content

###Providers

####<a name="lpCoreUpdate"></a>lpCoreUpdate


{Description}

######Methods

#####`subscribe(name, callback) :Undefined`

Add listener to proper widget's queue

Params:

| Param| Type| Description|
| :----| :----| :----|
| name| String| {Description}|
| callback| Function| {Description}|

Examples:

Subscribing at an update event within the widget's controller:

```
var invoker = function() {
  ctrl.widgetModel.load();
};

lpCoreUpdate.subscribe(widget.name, invoker);
```


<br>

#####`trigger(name) :Undefined`

Invoke callbacks for this particular event name

Params:

| Param| Type| Description|
| :----| :----| :----|
| name| String| {Description}|

Examples:

Triggering update event:

```
var eventName = widget.name;
lpCoreUpdate.trigger(eventName);
```


<br>

