define(function(require, exports, module) {
    'use strict';

    var d3 = require('d3');

    // @ngInject
    exports.lpCategoriesSpendings = function($templateCache, lpCoreBus, lpCoreUtils, $q, CategorySpendingsResource, CategoriesResource) {
        function linkFn(scope, elem, attrs) {
            scope.options = lpCoreUtils.assign({}, scope.options, scope.lpCategoriesSpendings);
            scope.accountId = null;
            scope.fromDate = null;
            scope.toDate = null;

            scope.viewLoading = true;
            scope.missingData = false;
            scope.showChart = false;

            scope.$watchCollection('[viewLoading,missingData]', function(newVals, oldVals) {
                var viewLoading = newVals[0];
                var missingData = newVals[1];
                scope.showChart = !viewLoading && !missingData;
            });

            /**
             * Updates both categories and spending data, based on changed
             * query values for CategorySpendingsResource
             */
            scope.updateData = function() {
                $q.all({
                    spendings: CategorySpendingsResource.get({
                            accountIds: scope.accountId,
                            start: scope.fromDate,
                            end: scope.toDate
                        }).$promise,
                    categories: CategoriesResource.get().$promise
                }).then(function(result) {
                    if(result.spendings.categoriesSpendings.length === 0) {
                        scope.missingData = true;
                        scope.viewLoading = false;
                        return;
                    }

                    scope.viewLoading = false;
                    scope.missingData = false;

                    lpCoreBus.publish('launchpad-retail.spendingDataUpdated', {
                        spendings: result.spendings,
                        categories: result.categories
                    });
                }, function(error) {
                    scope.viewLoading = false;
                    scope.missingData = true;
                });
            };

            //Listen for user accounts data load
            var onAccountsLoaded = function(accounts) {
                var accountIds = '';

                lpCoreUtils.forEach(accounts, function(account) {
                    if (account.ids) {
                        accountIds = account.ids;
                    }
                });

                scope.accountId = accountIds;
                scope.updateData();

                //Listen for user account selection
                lpCoreBus.subscribe('launchpad-retail.accountSelected', function(params) {
                    scope.accountId = params.allAccounts ? accountIds : params.accountId;
                    scope.updateData();
                });
            };
            lpCoreBus.subscribe('launchpad-retail.accountsLoaded', onAccountsLoaded);
            lpCoreBus.subscribe('lpAccounts.loaded', onAccountsLoaded);

            //Listen for transaction filtering by date
            lpCoreBus.subscribe('launchpad-retail.transactionsDateSearch', function(params) {
                scope.fromDate = params.fromDate;
                scope.toDate = params.toDate;
                scope.updateData();
            });
        }

        function compileFn(elem, attrs) {
            return linkFn;
        }

        // retrieve template
        function templateFn(scope) {
            return (
                '<div class="ng-cloak" ng-class="responsiveClass">' +
                '	<div class="lp-widget-content widget widget-default" role="application">' +
                '		<div class="lp-widget-body widget-body">' +
                '			<div ng-if="missingData" class="panel-message" >' +
                '				<div class="panel-body text-center">You have no data available.</div>' +
                '			</div>' +
                '			<div ng-if="viewLoading" class="panel-message loading-panel" role="alert">' +
                '				<i class="lp-icon lp-icon-spinner2 lp-spin loading-icon"></i>' +
                '				<span class="sr-only">Busy</span>' +
                '			</div>' +
                '			<div category-spendings-chart="category-spendings-chart" ng-show="showChart"></div>' +
                '		</div>' +
                '	</div>' +
                '</div>'
            );
        }

        // Directive configuration
        return {
            scope: {
                lpCategoriesSpendings: '=?',
                options: '=?'
            },
            restrict: 'AE',
            compile: compileFn,
            template: templateFn
        };
    };

    // @ngInject
    exports.categorySpendingsChart = function(lpCoreBus, lpCoreUtils, lpCoreI18n, lpWidget) {
        return {
            restrict: 'EA',
            replace: true,
            template: '<svg class="category-spendings-chart" width="350" height="350"></svg>',
            link: function(scope, $element) {
                scope.options = lpCoreUtils.assign({}, scope.options);
                var animationDirectionReverse = scope.options.animationDirection === 'anticlockwise';
                var spendings, categories = null;
                var width = 350;
                var height = 350;
                var radius = Math.min(width, height / 2);
                var innerRadius = radius * 0.55;
                var outerRadius = radius;
                var arcGenerator = d3.svg.arc()
                                .outerRadius(outerRadius)
                                .innerRadius(innerRadius);

                function initialize() {
                    var localSVG = d3.select($element[0])
                                .append('g')
                                .attr({
                                    'class': 'donut',
                                    transform: 'translate(' + width / 2 + ',' + height / 2 + ')'
                                });

                    // chart inner circle
                    localSVG.append('circle').attr({
                        'class': 'inner-circle',
                        cx: 0, cy: 0, r: innerRadius
                    });

                    localSVG.append('g').attr('class', 'arcs');

                    //Labels placed in the middle of the chart
                    var innerLabels = localSVG.append('g').attr('class', 'inner-labels');
                    innerLabels.append('text').attr({'class': 'name', x: 0, y: -(innerRadius * 0.34), width: innerRadius});
                    innerLabels.append('text').attr({'class': 'amount', x: 0, dy: innerRadius * 0.15 });
                    innerLabels.append('text').attr({
                        'class': 'total-fraction',
                        x: -(innerRadius * 0.4),
                        dy: innerRadius * 0.5
                    });

                    var comparisonGroup = innerLabels.append('g').attr('class', 'historical-change-group');
                    comparisonGroup.append('text').attr({'class': 'historical-change-factor', x: innerRadius * 0.45, dy: innerRadius * 0.5});

                    // Arrow group which is used to rotate elements in the group according to arc
                    localSVG.append('g').attr('class', 'arrow-group');

                    return localSVG;
                }

                var svg = initialize();

                function clean() {
                    svg.selectAll('.arrow').remove();
                    svg.selectAll('.historical-change-arrow').remove();
                    svg.selectAll('.inner-labels text').text('');
                }

                /**
                 * Converts radians to degrees
                 * @param  {number} radians Value in radians
                 * @return {number}      Value in degrees
                 */
                function radiansToDegree(radians) {
                    return radians * (180 / Math.PI);
                }

                function categoryArrow(data) {
                    var categoryArc = svg.selectAll('.arc').filter(function(arc) {
                        return arc.data.categoryId === data.categoryId;
                    });

                    if(categoryArc[0].length > 0) {
                        var datum = categoryArc.datum();

                        svg.select('.arrow-group').append('path').attr({
                            'class': 'arrow',
                            transform: [
                                'translate(0,' + (-1 * innerRadius * 0.9 ) + ')',
                                'rotate(180)'
                            ].join(' '),
                            d: 'M 0 0 l 15.5 27.5 l -30 0',
                            fill: data.color
                        });

                        var rotateBy = (datum.endAngle - datum.startAngle) / 2 + datum.startAngle;

                        svg.selectAll('.arrow-group').attr({
                            transform: 'rotate(' + radiansToDegree(rotateBy) + ')',
                            'fill': data.color
                        });
                    }
                }

                function wrapText(textNode, text) {
                    textNode.selectAll('tspan').remove();

                    var textNodeWidth = textNode.attr('width');
                    var tspanCount = 1;
                    var tspan = textNode.append('tspan');
                    var words = text.split(/\s+/);
                    var lineHeight = 20;

                    if(words.length === 1 && text.length > 15) {
                        tspan.text(text.slice(0, 12) + '...');
                        return textNode;
                    }

                    for (var i = 0; i < words.length; i++) {
                        if(tspan.node().getComputedTextLength() > textNodeWidth) {
                            tspanCount++;

                            // allow only two lines of text, otherwise end title with ellipsis
                            if(tspanCount >= 3) {
                                tspan.text(tspan.text() + '...');
                                break;
                            }

                            tspan = textNode.append('tspan').attr({x: 0, dy: lineHeight});
                        }

                        tspan.text(tspan.text() + ' ' + words[i]);
                    }

                    return textNode;
                }

                function setCategoryInfo(data) {
                    if(!data) { return; }

                    clean();
                    categoryArrow(data);
                    wrapText(svg.select('.name'), data.name);

                    var historicalChangeFactor = data.historicalChangeFactor || 1;

                    svg.select('.amount').text(lpCoreI18n.formatCurrency(data.amount, spendings.currency));

                    svg.select('.historical-change-factor').text(
                        parseFloat(Math.abs(historicalChangeFactor * 100)).toFixed(2) + '%'
                    );

                    svg.select('.historical-change-group').classed({
                        'up': historicalChangeFactor > 0,
                        'down': historicalChangeFactor <= 0
                    });

                    // svg.selectAll('.historical-change-arrow').remove();

                    var comparisonArrow = svg.select('.historical-change-group')
                                                .append('g')
                                                .attr('class', 'historical-change-arrow');

                    // define marker
                    comparisonArrow.append('svg:defs').append('marker')
                        .attr({
                            'id': 'arrow-head',
                            'refX': 0, 'refY': 2,
                            'markerWidth': 2, 'markerHeight': 4,
                            'orient': 'auto'
                        })
                        .append('svg:path')
                        .attr('d', 'M0,0 V4 L2,2 Z');

                    comparisonArrow.append('path')
                                .attr({
                                    'id': 'arrow-line',
                                    'marker-end': 'url(#arrow-head)',
                                    'fill': 'none',
                                    'd': 'M0,0 L0,-18'
                                });

                    var arrowUp = ['translate(6,' + innerRadius * 0.31 + ')', 'rotate(180)'].join(' ');
                    var arrowDown = ['translate(6,' + innerRadius * 0.54 + ')', 'rotate(0)'].join(' ');
                    var arrow = svg.select('.historical-change-group').classed('down') ? arrowUp : arrowDown;

                    svg.select('.historical-change-arrow').attr('transform', arrow);
                    svg.select('.total-fraction').text(parseFloat(data.totalFraction * 100).toFixed(2) + '%');
                }

                function onArcClick(d) {
                    setCategoryInfo(d.data);
                    lpCoreBus.publish('launchpad-retail.donutCategoryChartSelection', d.data);
                }

                function update(spending, partyCategories) {
                    clean();

                    var spendingByCategory = spending.categoriesSpendings;
                    spendingByCategory.sort(function(a, b) {
                        return a.amount - b.amount;
                    });

                    lpCoreUtils.each(spendingByCategory, function(categorySpending) {
                        var category = lpCoreUtils.find(partyCategories, function(currentCategory) {
                            return currentCategory.id === categorySpending.categoryId;
                        });

                        categorySpending.name = category.name;
                        categorySpending.color = category.color;
                    });

                    var pie = d3.layout.pie()
                            .sort(null)
                            .value(function(d) { return d.amount; });

                    var initial = spendingByCategory.map(function (d) {
                        return {
                            categoryId: d.categoryId,
                            color: d.color,
                            amount: Number.MIN_VALUE
                        }
                    });

                    initial[animationDirectionReverse ? 'unshift' : 'push']({
                        color: 'none',
                        amount: Number.MAX_VALUE
                    });
                    spendingByCategory[animationDirectionReverse ? 'unshift' : 'push']({
                        color: 'none',
                        amount: Number.MIN_VALUE
                    });

                    var arc = svg.select('.arcs').selectAll('.arc').data(pie(initial)); // JOIN new data with old elems
                    arc.enter().append('path') //ENTER, create new elements if needed
                        .classed('arc', true)
                        .attr('d', arcGenerator)
                        .style('fill', function(d) { return d.data.color; })
                        .each(function (d) {
                            this._current = d;
                        })
                        .on('click', onArcClick);
                    arc.attr('d', arcGenerator).style('fill', function(d) { return d.data.color; }); //ENTER + UPDATE
                    arc.exit().remove(); //EXIT, remove old elements

                    var duration = scope.options.animation || 250;

                    change();

                    function change() {
                        arc.data(pie(spendingByCategory));
                        arc.transition().duration(duration).attrTween('d', arcTween);
                        setTimeout(function () {
                            // Selecting largest category:
                            setCategoryInfo(spendingByCategory[spendingByCategory.length - (animationDirectionReverse ? 1 : 2)]);
                        }, duration);
                    }
                }

                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function (t) {
                        return arcGenerator(i(t));
                    }
                }

                lpCoreBus.subscribe('launchpad-retail.spendingDataUpdated', function(data) {
                    spendings = data.spendings;
                    categories = data.categories;
                    update(spendings, categories);
                });

                lpCoreBus.subscribe('launchpad-retail.transactionsCategorySearch', function(transactionsCategories) {
                    if(transactionsCategories.length === 1) {
                        var categoriesSpendings = spendings.categoriesSpendings;
                        var spending = categoriesSpendings.filter(function(currentSpending) {
                            return currentSpending.categoryId === transactionsCategories[0].id;
                        })[0];


                        setCategoryInfo(spending);
                    }
                });
            }
        };
    };
});
