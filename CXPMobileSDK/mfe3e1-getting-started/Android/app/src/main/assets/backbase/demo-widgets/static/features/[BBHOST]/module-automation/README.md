# Automation module

There are myriad ways end users want to engage in online banking. With the automation widget, end users can set up their own automated actions. Examples include: notifications of salary coming in, automatic bill payment, and automatic saving. The widget offers a conversational wizard that offers a channel for the configuration of all these different actions. On the back end, any type of trigger and action can be added, following a predefined development structure. 

# Information

| name                  | version       | bundle     |
| ----------------------|:-------------:| ----------:|
| module.charts         | 2.0.4         | launchpad  |

## Dependencies
* base
* core

## Dev Dependencies
* angular-mocks ~1.2.28
* config


## Install

```bash
bower i module-charts --save && bower link
```

## Develop

```bash
git clone ssh://git@stash.backbase.com:7999/lpm/module-charts.git && cd module-charts
bower install
bower link
```

For developing/building/testing the module, use [Backbase Launchpad-CLI tools](https://stash.backbase.com/projects/LP/repos/cli/browse)

## Usage

-- TO BE ADDED


## Testing

```
bblp test
```

with watch flag
```
bblp test -w
```

## Build

```
bblp build
```
