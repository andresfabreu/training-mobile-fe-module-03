/**
 * Directives
 * @module directives
 */
define(function(require, exports) {

    'use strict';

    var d3 = require('d3');
    var $ = window.jQuery;

    // @ngInject
    exports.categorySpendingsChart = function(lpCoreBus) {
        var bus = lpCoreBus;

        return {
            restrict: 'EA',
            replace: true,
            template: '<svg class="category-spendings-chart" width="350" height="350"></svg>',
            link: function($scope, $element) {
                var spendings, categories = null;
                var width = 350;
                var height = 350;
                var radius = Math.min(width, height / 2);
                var innerRadius = radius * 0.55;
                var outerRadius = radius;
                var arcGenerator = d3.svg.arc()
                                .outerRadius(outerRadius)
                                .innerRadius(innerRadius);
                var svg;

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

                /**
                 * Converts radians to degrees
                 * @param  {number} radians Value in radians
                 * @return {number}         Value in degrees
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

                function clean() {
                    svg.selectAll('.arrow').remove();
                    svg.selectAll('.historical-change-arrow').remove();
                    svg.selectAll('.inner-labels text').text('');
                }

                function setCategoryInfo(data) {
                    if(!data) {
                        return;
                    }

                    clean();
                    categoryArrow(data);
                    wrapText(svg.select('.name'), data.name);

                    var historicalChangeFactor = data.historicalChangeFactor || 1;

                    svg.select('.amount').text('$' + parseFloat(data.amount).toFixed(2));

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

                function initialize() {
                    var svgEl = d3.select($element[0])
                                .append('g')
                                .attr({
                                    'class': 'donut',
                                    transform: 'translate(' + width / 2 + ',' + height / 2 + ')'
                                });

                    // chart inner circle
                    svgEl.append('circle').attr({
                        'class': 'inner-circle',
                        cx: 0, cy: 0, r: innerRadius
                    });

                    svgEl.append('g').attr('class', 'arcs');

                    //Labels placed in the middle of the chart
                    var innerLabels = svgEl.append('g').attr('class', 'inner-labels');
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
                    svgEl.append('g').attr('class', 'arrow-group');

                    return svgEl;
                }

                function onArcClick(d) {
                    setCategoryInfo(d.data);
                    bus.publish('launchpad-retail.donutCategoryChartSelection', d.data);
                }

                function update(spending, partyCategories) {
                    clean();

                    var vCategories = partyCategories;

                    var totalData = {
                        amount: spending.amount,
                        historicalChangeFactor: spending.historicalChangeFactor,
                        name: 'All Categories',
                        totalFraction: 1
                    };
                    setCategoryInfo(totalData);

                    var spendingByCategory = spending.categoriesSpendings;
                    spendingByCategory.sort(function(a, b) {
                        if (a.amount > b.amount) {
                            return 1;
                        } else if(a.amount < b.amount) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });

                    $.each(spendingByCategory, function(index, categorySpending) {
                        var category = $.grep(vCategories, function(vCategory) {
                            return vCategory.id === categorySpending.categoryId;
                        })[0];

                        categorySpending.name = category.name;
                        categorySpending.color = category.color;
                    });

                    var amountFn = function(category) { return category.amount; };
                    var scale = d3.scale.linear()
                            .domain([d3.min(spendingByCategory, amountFn), d3.max(spendingByCategory, amountFn)])
                            .range([100, 360]);

                    var pie = d3.layout.pie()
                            .sort(null)
                            .value(function(d) { return scale(Math.abs(d.amount)); });

                    var arc = svg.select('.arcs').selectAll('.arc').data(pie(spendingByCategory)); // JOIN new data with old elems
                    arc.classed('update', true); //UPDATE old elems
                    arc.enter().append('path') //ENTER, create new elements if needed
                        .classed('arc', true)
                        .attr('d', arcGenerator)
                        .style('fill', function(d) { return d.data.color; })
                        .on('click', onArcClick);
                    arc.attr('d', arcGenerator).style('fill', function(d) { return d.data.color; }); //ENTER + UPDATE
                    arc.exit().remove(); //EXIT, remove old elements
                }

                svg = initialize();

                bus.subscribe('launchpad-retail.spendingDataUpdated', function(data) {
                    spendings = data.spendings;
                    categories = data.categories;
                    update(spendings, categories);
                });

                bus.subscribe('launchpad-retail.transactionsCategorySearch', function(vCategories) {
                    if(vCategories.length === 1) {
                        var categoriesSpendings = spendings.categoriesSpendings;
                        var spending = categoriesSpendings.filter(function(vSpending) {
                            return vSpending.categoryId === vCategories[0].id;
                        })[0];


                        setCategoryInfo(spending);
                    }
                });

            }
        };
    };
});
