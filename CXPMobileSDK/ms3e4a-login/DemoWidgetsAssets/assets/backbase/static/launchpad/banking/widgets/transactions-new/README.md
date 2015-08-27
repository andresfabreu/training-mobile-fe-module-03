# Transactions

## Information

| name                  | version           | bundle           |
| ----------------------|:-----------------:| ----------------:|
| widget-transactions    | 1.0.0            | Banking        |

## Brief Description

Displays transaction information for any selected account, in 3 views (transaction list, balance, split view). Selecting a transaction will display further details of that transaction. The Smart Suggest functionality allows for very fast searches.

## Dependencies

* [core][core-url]
* [ui][ui-url]
* [module-users][module-users-url]
* [module-accounts][module-accounts-url]
* [module-transactions][module-transactions-url]
* [module-contacts][module-contacts-url]
* [module-tags][module-tags-url]
* [module-charts][module-charts-url]
* [module-freshness][module-freshness-url]

## Dev Dependencies

* [angular-mocks ~1.2.28][angular-mocks-url]
* [config][config-url]

## Preferences

Get widget preference `widget.getPreference(string)`

* __accountsDataSrc__: The endpoint URL to retrieve account data
* __transactionsDataSrc__: The endpoint URL to retrieve transactions data
* __categoryDataSrc__: The endpoint URL to retrieve category data
* __transactionDetailsDataSrc__: The endpoint URL to retrieve transaction details data
* __contactsDataSrc__: The endpoint URL to retrieve contacts data
* __accountBalanceChartDataSrc__: The endpoint URL to retrieve balance chart data
* __transactionsPageSize__: Defines the number of transactions to be loaded at each iteration
* __showTransactionIcons__: Shows/hides transaction icons
* __showCharts__: Shows/hides charts
* __showAccountSelect__: Shows/hides account selection option
* __preferenceService__: The endpoint URL to
* __categorySpendingDataSrc__: The endpoint URL to retrieve category spending chart data
* __categoriesDataSrc__: The endpoint URL to retrieve transaction categories data
* __hideTransactionDetails__: Hide transaction details when expanded
* __showDatesAllTransactions__: To show transaction date in each row

##Events

The following is a list of pub/sub event which the widget subscribes to:

* __launchpad-retail.accountSelected__ - When this message is received, the selected account dropdown will be updated and will reload related transactions
* __launchpad-retail.cardSelected__ - When this message is received,  the selected card dropdown will be updated and will reload related transactions
* __lpDataFreshnessRefresh__ - When this message is received, the account/card dropdown will be reloaded and the widget will be reinitialized
* __launchpad-retail.transactions.applyFilter__ - When this message is received, the transactions list will be reloaded with the supplied filters
* __launchpad-retail.transactions.newTransferSubmitted__ - When this message is received, the transactions list will be reloaded
* __launchpad-retail.donutCategoryChartSelection__ - When this message is received, the category supplied will be selected and the transactions reloaded
* __launchpad-retail.accountsLoaded__ - When this message is received, the user accounts data will be reloaded
* __launchpad-retail.transactionsDateSearch__ - When this message is received, the transactions list will be filtered by the date range supplied

The following is a list of pub/sub event which the widget publishes to:

* __lpDataFreshnessChanged__ - Notifies when the accounts have been loaded after attending __lpDataFreshnessRefresh__ event
* __launchpad-retail.accountSelected__ - The account in the dropdown has changed. Arguments: `{accountId: $scope.accountsModel.selected.id, originType: 'transactions', _noBehavior: true}`
* __launchpad-retail.requestMoneyTransfer__ - Published when the button Transfer Money is selected
* __launchpad-retail.transactionsDateSearch__ - Notifies a date range change in the filter component. Arguments: `{fromDate: filters.fromDate, toDate: filters.toDate}`
* __launchpad-retail.transactionsCategorySearch__ - Notifies a category change in the filter component. Arguments: `currentSuggestion.category`
* __launchpad-retail.spendingDataUpdated__ - Triggered after loading the spendings by category data. Arguments: `{spendings: result.spendings, categories: result.categories}`


[core-url]: http://stash.backbase.com:7990/projects/lpm/repos/foundation-core/browse/
[ui-url]: http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/
[config-url]: https://stash.backbase.com/projects/LP/repos/config/browse
[api-url]: http://stash.backbase.com:7990/projects/LPM/repos/api/browse/
[angular-mocks-url]: https://github.com/angular/bower-angular-mocks/
[module-users-url]: https://stash.backbase.com/projects/LPM/repos/module-users/browse/
[module-accounts-url]: https://stash.backbase.com/projects/LPM/repos/module-accounts/browse/
[module-transactions-url]: https://stash.backbase.com/projects/LPM/repos/module-transactions/browse/
[module-contacts-url]: https://stash.backbase.com/projects/LPM/repos/module-contacts/browse/
[module-tags-url]: https://stash.backbase.com/projects/LPM/repos/module-tags/browse/
[module-charts-url]: https://stash.backbase.com/projects/LPM/repos/module-charts/browse/
[module-freshness-url]: https://stash.backbase.com/projects/LPM/repos/module-freshness/browse/
