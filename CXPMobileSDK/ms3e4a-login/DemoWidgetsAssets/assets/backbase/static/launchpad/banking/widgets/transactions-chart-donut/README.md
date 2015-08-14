# Transactions Charts Donut

## Brief Description

Implements a donut chart

## Dependencies

* base
* core
* ui
* module-accounts
* module-transactions

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `lpWidget.getPreference(string)`  

Get preference inherited from widget's parents `lpWidget.getPreferenceFromParents(string)`

* animation: Time in milliseconds for the donut to animate.
* animation-direction: Set to 'anticlockwise' for donut to animation anti-clockwise (otherwise it will be clockwise).

##Events

The following is a list of pub/sub event which the widget subscribes to:

* 

The following is a list of pub/sub event which the widget publishes to:

* **launchpad-retail.accountSelected** - Emits the event when an account is selected

## Test

```bash
$ bblp start
```

with watch flag
```bash
bblp test -w
```


## Build

```bash
$ bblp build
```
