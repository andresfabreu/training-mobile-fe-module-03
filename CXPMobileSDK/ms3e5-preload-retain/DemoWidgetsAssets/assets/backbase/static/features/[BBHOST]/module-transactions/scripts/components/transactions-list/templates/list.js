define(function (require, exports, module) {
    'use strict';

    var template = '' +
        '<div class="lp-widget-body" ng-class="{logohidden: hideLogo, \'preview-all\': previewAll }">' +
        '    <div class="category-toggle" ng-if="showCategories && showCategoriesToggle">' +
        '        <button class="btn btn-default" tabindex="0" aria-pressed="{{ previewAll }}" ng-click="toggleCategoryView()" ng-class="{ \'active\': previewAll }">' +
        '            <i title="Category view" class="lp-icon lp-icon-tag"></i>' +
        '            <span class="sr-only">Show Categories</span>' +
        '        </button>' +
        '    </div>' +
        '    <div class="panel-message" ng-if="transactions.noTransactionsFound()" role="alert">' +
        '        <p>There are no transactions to display' +
        '            <span ng-show="!transactions.isSearching()">for this account</span>' +
        '            <span ng-show="transactions.isSearching()">for this search</span>.' +
        '        </p>' +
        '    </div>' +
        '    <div lp-freshness-message="lp-freshness-message"></div>' +
        '    <div class="transactions-list-wrapper" ' +
        '        lp-infinite-scroll="loadMoreTransactions()" ' +
        '        lp-infinite-scroll-disabled="!showScrollbar || transactions.loading || !accounts.selected" ' +
        '        lp-infinite-scroll-end="!transactions.moreAvailable">' +
        '    <ul id="transactions-list" role="presentation" class="list-group list-view transactions-list" element-resize="updateItemSize(data)">' +
        '        <li class="list-group-item list-view-row expandable clearfix" ng-class="{ open: transaction.showDetails }"' +
        '            ng-repeat="transaction in transactions.transactions track by $index">' +
        '            <div class="list-view-container cursor-pointer clearfix" ng-click="openDetails(transaction)"' +
        '                tabindex="0" ng-keydown="transactionKeydown($event, transaction)"' +
        '                ng-mouseleave="closePreview(transaction)" role="button"' +
        '                id="transaction-{{transaction.id}}" aria-expanded="{{ !!transaction.showDetails }}"' +
        '                aria-controls="transaction-details-{{transaction.id}}">' +

                         /* transactions categories */
        '                <div class="categories" ng-mouseover="categoryLayout == \'small\' || openPreview(transaction)" ng-if="showCategories">' +
        '                    <div class="lp-transactions-list-category" lp-category-display="lp-category-display" lp-category-view="previewAll" lp-category-list="transactionsCategories.categories" ng-model="transaction" category-click="categoryClick($event, transaction)" category-start-swipe="categorySwipeStart($event, transaction)" category-swipe="categorySwipe($event, transaction)" category-end-swipe="categorySwipeEnd($event, transaction)"></div>' +
        '                </div>' +

                         /* transaction date */
        '                <div class="info" data-role="transactions-item-info">' +
        '                    <div class="column" ng-class="[categoryLayout == \'small\' ? \'col-xs-2\' : \'col-sm-1\']" ng-mouseover="categoryLayout == \'small\' || openPreview(transaction)">' +
        '                        <div class="centered">' +
        '                            <div class="h4 text-center lp-transactions-date" aria-hidden="true" ng-if="transaction.newDate || showDatesAllTransactions">' +
        '                                <span itemprop="dateTimeMonth">{{transaction.bookingDateTime | date:\'MMM\'}}</span>' +
        '                                <br />' +
        '                                <span itemprop="dateTimeDate">{{transaction.bookingDateTime | date:\'dd\'}}</span>' +
        '                            </div>' +
        '                        </div>' +
        '                    </div>' +

                             /* transaction icon */
        '                    <div class="col-sm-1 hidden-xs column" ng-class="{ hidden: categoryLayout == \'small\' || !showTransactionIcons }">' +
        '                        <div class="centered">' +
        '                            <div ng-if="showTransactionIcons" class="lp-transaction-icon hidden-xs gray-image-hover">' +
        '                                <img ng-if="transaction.counterPartyLogoPath" ng-src="{{transaction.counterPartyLogoPath}}" width="35" height="35" alt=""/>' +
        '                            </div>' +
        '                        </div>' +
        '                    </div>' +

                             /* transaction title */
        '                    <div class="main-content column left-align" ng-class="[categoryLayout == \'small\' ? \'col-xs-7\' : \'col-sm-8\']">' +
        '                        <div class="centered">' +
        '                            <div class="h4 transactions-list-item-name counterparty-name" itemProp="counterpartyName">' +
        '                                <span class="sr-only">Name</span>{{getTransactionDescription(transaction)}}' +
        '                            </div>' +
        '                            <span class="h6 transactions-list-item-type text-muted hidden-xs" itemProp="transactionType">' +
        '                                <span class="sr-only">Transaction type</span>{{getTransactionSubDescription(transaction)}}' +
        '                            </span>' +
        '                            <span class="h6 transactions-list-item-info text-muted hidden-sm hidden-md visible-xs">' +
        '                                <span class="sr-only transactions-list-item-date" lp-i18n="Date"></span>{{transaction.bookingDateTime | date:\'MMM\'}} {{transaction.bookingDateTime | date:\'dd\'}} <span class="h6 text-muted transactions-list-item-amount" itemProp="transactionAmount" lp-amount="transaction.transactionAmount" lp-amount-currency="transaction.transactionCurrency"></span>' +
        '                            </span>' +
        '                        </div>' +
        '                    </div>' +

                             /* transaction amount */
        '                    <div class="col-xs-3 col-sm-2 column right-align">' +
        '                        <div class="centered">' +
        '                            <span class="sr-only">Amount</span>' +
        '                            <span class="h4" itemProp="transactionAmount"' +
        '                                  lp-amount="transaction.transactionAmount"' +
        '                                  lp-amount-currency="transaction.transactionCurrency"></span>' +
        '                        </div>' +
        '                    </div>' +
        '                </div>' +
        '            </div>' +
        '            <div class="clearfix details transaction-details" id="transaction-details-{{transaction.id}}" aria-labelledby="transaction-details-data-{{transaction.id}}"></div>' +
        '        </li>' +
        '    </ul>' +
        '    <div ng-if="showScrollbar && transactions.loading" role="alert">' +
        '       <div class="text-center" lp-i18n="Loading transactions..."></div>' +
        '    </div>' +
        '    <div ng-if="!showScrollbar">' +
        '      <div ng-show="transactions.allowMoreResults()">' +
        '           <p class="lp-transactions-list-more text-center">' +
        '               <a href="" class="lp-transactions-list-more-button cursor-pointer" tabindex="0" ng-click="loadMoreTransactions()" lp-i18n="Show more"></a>' +
        '            </p>' +
        '       </div>' +
        '       <div ng-if="transactions.loading" role="alert">' +
        '           <p class="panel-message text-center" lp-i18n="Loading transactions..."></p>' +
        '       </div>' +
        '    </div>' +
        '    </div>' +
        '</div>';

    return template;
});
