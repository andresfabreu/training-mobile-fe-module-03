# module-transactions

The purpose of this module is to be able to work with transactions in any widget. It
also allows you to use P2P transactions. It contains filters and directives to display
categories of every transaction.


# Information
| name                  | version       | bundle     |
| ----------------------|:-------------:| ----------:|
| module-transactions   | 2.7.12         | launchpad  |


## Dependencies
* [base][base-url]
* [core][core-url]
* [ui][ui-url]
* [module-tags][module-tags-url]


## Table of Contents

- [Provider](#provider)
- [Components](#components)


<a name="provider"></a>
### Provider

###### Initial Setup
The provider `lpTransactions` has to be configured in the `run` method of the widget
that includes it. Allows to customize:
* __transactionsEndpoint__ : url used to retrieve the transactions of a certain account, the account is
specified by the placeholder `$(accountId)`.
* __transactionDetailsEndpoint__ : url used to fetch the transaction details pointed by `$(transactionId)`.
* __pageSize__ : number of rows to return in every request.
* __from__ : index of the first row to retrive (1 is the first).
* __sort__ : a label indicating the field that will be used to sort the returned rows. If `-` sign is prepended it will return the results in descending order. Possible values are:

    * bookingDateTime
    * transactionAmount

```javascript
// @ngInject
function run(lpWidget, lpTransactions) {
    lpTransactions.setConfig({
        'transactionsEndpoint': '/path/to/$(accountId)/transactions',
        'transactionDetailsEndpoint': '/path/to/transaction/$(transactionId)/details',
        'pageSize': 20,
        'from': 1,
        'sort': '-bookingDateTime'
    });
}
```

###### Usage
Once the provider has been configured it can be injected, to start using it call the method api, it
will return a fresh instance of transactions model with all the public methods available.
```javascript
...
$scope.transactions = lpTransactions.api();
...
```


<a name="components"></a>
### Components

#### Transactions Categories
##### Provider
* `lpTransactionsCategory`

##### Filters
* `categoryList`
* `selectedCategory`
* `markedCategory`

##### Directives
* `lpCategoryDisplay`
* `lpCategoryItem`
* `lpCategorySelect`


#### Transactions Currency
##### Provider
* `lpTransactionsCurrency`


#### Transactions P2P
##### Provider
* `lpP2PTransactions`

[base-url]:http://stash.backbase.com:7990/projects/lpm/repos/foundation-base/browse/
[core-url]: http://stash.backbase.com:7990/projects/lpm/repos/foundation-core/browse/
[ui-url]: http://stash.backbase.com:7990/projects/lpm/repos/ui/browse/
[module-tags-url]: http://stash.backbase.com:7990/projects/lpm/repos/module-tags/browse/

