# Portfolio Aggregated View widget


## Information
| name                      | version | bundle |
| --------------------------|---------| -------|
| portfolio-aggregated-view | 2.1.0   | wealth |

## Brief Description

Provides a tabbed view consisting of 4 treemaps (Assets Allocation, Geographical Allocation, Combined Assets and Geographical, Equity Sectors) and 1 barchart (Bonds Details)


## Dependencies
* Wealth


## Events
| name                               |           | data type | data description   |
|------------------------------------|-----------|-----------|--------------------|
| launchpad-retail.portfolioSelected | subscribe | {Object}  | Selected portfolio |

## Preferences
| name    | label       | description  | default value                                                     |
|---------|-------------| -------------|-------------------------------------------------------------------|
| dataSrc | Data Source | API endpoint | //private-acee1-indamix.apiary-mock.com/bb/wealth/aggregated/{id} |


## Directives
| name                      | attrs.type | description   |
| --------------------------|------------|---------------|
| lp-wealth-aggregated-view | treemap    | Treemap chart |
| lp-wealth-aggregated-view | barchart   | Bar chart     |
