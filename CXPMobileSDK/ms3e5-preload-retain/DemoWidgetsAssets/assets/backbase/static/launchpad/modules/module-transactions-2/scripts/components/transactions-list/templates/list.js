define(function (require, exports, module) {
    'use strict';

    var template = '' +
        '<div class="lp-widget-body" ng-class="{logohidden: hideLogo, \'preview-all\': previewAll }">' +
        '' +
        '    <div class="category-toggle" ng-if="showCategories">' +
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
        '' +
        '    <div lp-freshness-message="lp-freshness-message"></div>' +
        '' +
        '    <ul id="transactions-list" role="presentation" class="list-group list-view transactions-list">' +
        '        <li class="list-group-item list-view-row expandable clearfix" ng-class="{ open: transaction.showDetails }"' +
        '            ng-repeat="transaction in transactions.transactions track by $index">' +
        '            <div class="list-view-container cursor-pointer clearfix" ng-click="openDetails(transaction)"' +
        '                tabindex="0" ng-keydown="transactionKeydown($event, transaction)"' +
        '                ng-mouseleave="closePreview(transaction)" role="button"' +
        '                id="transaction-{{transaction.id}}" aria-expanded="{{ !!transaction.showDetails }}"' +
        '                aria-controls="transaction-details-{{transaction.id}}">' +

                         /* transactions categories */
        '                <div class="categories" ng-mouseover="categoryLayout == \'small\' || openPreview(transaction)" ng-if="showCategories">' +
        '                    <div lp-category-display="lp-category-display" lp-category-view="previewAll" lp-category-list="transactionsCategories.categories" ng-model="transaction" category-click="categoryClick"></div>' +
        '                </div>' +

                         /* transaction date */
        '                <div class="info" element-resize="updateItemSize(transaction, data)">' +
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
        '                            <div class="h4 counterparty-name" itemProp="counterpartyName">' +
        '                                <span class="sr-only">Name</span>{{getTransactionDescription(transaction)}}' +
        '                            </div>' +
        '                            <span class="h6 text-muted hidden-xs" itemProp="transactionType">' +
        '                                <span class="sr-only">Transaction type</span>{{getTransactionSubDescription(transaction)}}' +
        '                            </span>' +
        '                            <span class="h6 text-muted hidden-sm hidden-md visible-xs">' +
        '                                <span class="sr-only" lp-i18n="Date"></span>{{transaction.bookingDateTime | date:\'MMM\'}} {{transaction.bookingDateTime | date:\'dd\'}} <span class="h6 text-muted" itemProp="transactionAmount" lp-amount="transaction.transactionAmount" lp-amount-currency="transaction.transactionCurrency"></span>' +
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
        '            <div class="clearfix details transaction-details" id="transaction-details-{{transaction.id}}" aria-labelledby="transaction-details-data-{{transaction.id}}">' +
        '                <div class="col-xs-12 col-sm-12">' +
        '                    <div alert="alert" class="alert alert-info" ng-show="transaction.errorCode">' +
        '                        <span lp-i18n="{{transaction.errorCode}}"></span>' +
        '                    </div>' +
        '' +
        '                    <ul tabset="tabset" class="" ng-if="showCategories && transaction.showDetails && !hideDetailsPreference">' +
        '                        <li tab="tab" select="selectDetailsTab(transaction)" active="transaction.detailTabs.details">' +
        '                            <span tab-heading="tab-heading" lp-i18n="Details"></span>' +
        '                            <div ' +
        '                               lp-transactions-list-details="lp-transactions-list-details" ' +
        '                               transaction="transaction"></div>' +
        '                        </li>' +
        '                        <li tab="tab" active="transaction.detailTabs.categories">' +
        '                            <span tab-heading="tab-heading" lp-i18n="Categories"></span>' +
        '                            <div lp-category-select="lp-category-select" ng-model="transactionsCategories" transaction="transaction" update="updateTransactionCategory" small-layout="categoryLayout === \'small\'" offset-top-correction="offsetTopCorrection" class="panel-body no-padding"></div>' +
        '                        </li>' +
        '                    </ul>' +
        '                    <div class="panel-body no-padding" ng-if="showCategories && transaction.showDetails && hideDetailsPreference">' +
        '                       <br><div lp-category-select="lp-category-select" ng-model="transactionsCategories" transaction="transaction" update="updateTransactionCategory" small-layout="categoryLayout === \'small\'" offset-top-correction="offsetTopCorrection" class="panel-body no-padding"></div>' +
        '                   </div>' +
        '                    <div ' +
        '                       lp-transactions-list-details="lp-transactions-list-details" ' +
        '                       transaction="transaction" ' +
        '                       ng-if="!showCategories && transaction.showDetails && !hideDetailsPreference"></div>' +
        '                </div>' +
        '            </div>' +
        '        </li>' +
        '    </ul>' +
        '' +
        '' +
        '    <div ng-show="transactions.allowMoreResults()">' +
        '        <p class="text-center">' +
        '            <a href="" class="cursor-pointer" tabindex="0" ng-click="loadMoreTransactions()" lp-i18n="Show more"></a>' +
        '        </p>' +
        '    </div>' +
        '    <div ng-if="transactions.loading" role="alert">' +
        '        <p class="panel-message text-center" lp-i18n="Loading transactions..."></p>' +
        '    </div>' +
        '</div>';

    return template;
});
