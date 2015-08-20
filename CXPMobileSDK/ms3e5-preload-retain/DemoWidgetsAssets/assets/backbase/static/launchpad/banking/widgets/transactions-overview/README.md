# Transactions Overview

## Information

| name                              | version           | bundle           |
| ----------------------------------|:-----------------:| ----------------:|
| widget-transactions-overview	    | 1.1.3             | Banking          |

## Brief Description

Implements a separate list of transactions (with search, but without accounts list, which goes as a separate widget)

## Dependencies

* base
* core
* ui
* module-transactions

## Dev Dependencies

* angular-mocks ~1.2.28
* config

## Preferences

Get widget preference `lpWidget.getPreference(string)`
   

Get preference inherited from widget's parents `lpWidget.getPreferenceFromParents(string)`

* 

##Events

The following is a list of pub/sub event which the widget subscribes to:

* 

The following is a list of pub/sub event which the widget publishes to:

*

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