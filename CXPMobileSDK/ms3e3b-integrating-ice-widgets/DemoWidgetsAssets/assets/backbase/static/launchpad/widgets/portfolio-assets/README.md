# Portfolio Assets Allocation widget


## Information
| name              | version | bundle |
| ------------------|---------| -------|
| portfolio-assets  | 1.0.0   | wealth |

## Brief Description

 Provides an asset allocation (Equities, Other Investments, Bonds, Cash) chart over time. It allows a specific column to be selected. The selected timeframe is affected by portfolio-minimap widget.

## Dependencies
* Wealth


## Events
| name                               |           | data type        | data description                                      |
|------------------------------------|-----------|------------------|-------------------------------------------------------|
| launchpad-retail.portfolioSelected | subscribe | {Object}         | Selected portfolio                                    |
| portfolio-rangeSelected            | subscribe | [{Date}, {Date}] | Selected timeframe (after a timeframe is selected)    |
| portfolio-rangeSelected-live       | subscribe | [{Date}, {Date}] | Selected timeframe (during selection, each mousemove) |
| portfolio-itemSelected             | subscribe | {Date}           | Selected item (month)                                 |
| portfolio-itemSelected             | publish   | {Date}           | Selected item (month)                                 |


## Preferences
| name    | label       | description  | default value                                                    |
|---------|-------------|--------------|------------------------------------------------------------------|
| dataSrc | Data Source | API endpoint | //private-acee1-indamix.apiary-mock.com/bb/wealth/portfolio/{id} |


## Directives
| name             | description                            |
| -----------------| ---------------------------------------|
| lp-wealth-assets | Assets Allocation (Stacked Area) chart |
