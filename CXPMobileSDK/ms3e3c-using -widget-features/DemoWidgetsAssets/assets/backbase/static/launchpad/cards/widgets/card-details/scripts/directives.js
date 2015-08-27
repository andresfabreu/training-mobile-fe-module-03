// #TODO move to component

define(function(require, exports, module) {
    'use strict';

    /**
     * Get style values directly from stylesheets
     *
     * @param style
     * @param selector
     * @param sheet
     * @returns {*}
     */
    var getStyleRuleValue = function (style, selector, sheet) {
        var sheets = typeof sheet !== 'undefined' ? [sheet] : document.styleSheets;
        for (var i = 0, l = sheets.length; i < l; i++) {
            var iSheet = sheets[i];
            if( !iSheet.cssRules ) { continue; }
            for (var j = 0, k = iSheet.cssRules.length; j < k; j++) {
                var rule = iSheet.cssRules[j];
                if (rule.selectorText && rule.selectorText.split(',').indexOf(selector) !== -1) {
                    return rule.style[style];
                }
            }
        }
        return null;
    };

    /**
     * Convert rgb to hex color
     *
     * @param rgb
     * @returns {string}
     */
    var rgb2hex = function (rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? '#' +
        ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    };

    /**
     * Aggregate function to get HEX color from stylesheets
     *
     * @param name
     * @returns {string}
     */
    var getColor = function(name) {
        var ruleHex = getStyleRuleValue('color', '.card-icon-color-' + name.toLowerCase());
        if (!ruleHex) {
            // TODO: Proper error logging.
            if (console && console.warn) {
                console.warn('Style .card-icon-color-' + name.toLowerCase() + ' not found');
            }
            return name;
        }
        else {
            return rgb2hex(ruleHex);
        }
    };

    // @ngInject
    exports.lpIconColorPicker = function(lpCoreUtils) {

        function templateFn() {
            return ['<div>',
                        '<div class="col-sm-3">',
                            '<label class="control-label">',
                                '{{label}}',
                            '</label>',
                        '</div>',
                        '<div class="col-sm-9">',
                            '<ul class="color-picker" role="radiogroup" aria-label="Color picker">',
                                '<li ng-repeat="color in selectableColors" tabindex="0" class="icon-colored cursor-pointer" title="{{color.name}}" ng-click="selectColor(color)" role="radio" aria-label="{{color.name}}" aria-selected="{{(model == color.hex) ? true : false}}">',
                                    '<div class="lp-icon {{icon}}" ng-style="color.styles"></div>',
                                '</li>',
                            '</ul>',
                        '</div>',
                    '</div>'].join('');
        }

        return {
            restrict: 'A',
            replace: true,
            require: 'ngModel',
            scope: {
                label: '=label',
                icon: '=iconClass',
                model: '=ngModel',
                onChangeFn: '&onChangeFn'
            },
            template: templateFn,
            link: function(scope, element, attrs, ngModelCtrl) {

                var modelCtrl = ngModelCtrl;

                var selectColorByHex = function(hexCode, executeOnChange) {

                    //function to switch bg and font color (selected)
                    var swapTextAndBGColor = function(color) {

                        var colorHolder, bgHolder;

                        colorHolder = color.styles.color;
                        bgHolder = color.styles.backgroundColor;

                        color.styles.color = bgHolder;
                        color.styles.backgroundColor = colorHolder;
                    };

                    if(scope.selectedColor) {
                        swapTextAndBGColor(scope.selectedColor);
                    }

                    for(var i = 0; i < scope.selectableColors.length; i++) {
                        if(scope.selectableColors[i].hex === hexCode) {
                            //selected color found, do switch
                            scope.selectedColor = scope.selectableColors[i];
                            swapTextAndBGColor(scope.selectedColor);
                            break;
                        }
                    }

                    //if no parameter passed or true, execute
                    if(executeOnChange || executeOnChange === undefined) {
                        scope.onChangeFn.call();
                    }
                };

                var processColorStyles = function() {
                    //create property on color object to specify styles of selected color
                    for(var i = 0; i < scope.selectableColors.length; i++) {
                        scope.selectableColors[i].styles = {
                            color: scope.selectableColors[i].hex,
                            backgroundColor: '#FFFFFF'
                        };
                    }
                };
                var initialize = function() {

                    scope.selectableColors = [
                        {
                            name: 'Licorice',
                            hex: getColor('Licorice')
                        },
                        {
                            name: 'Magnesium',
                            hex: getColor('Magnesium')
                        },
                        {
                            name: 'Tangerine',
                            hex: getColor('Tangerine')
                        },
                        {
                            name: 'Salmon',
                            hex: getColor('Salmon')
                        },
                        {
                            name: 'Maraschino',
                            hex: getColor('Maraschino')
                        },
                        {
                            name: 'Grape',
                            hex: getColor('Grape')
                        },
                        {
                            name: 'Aqua',
                            hex: getColor('Aqua')
                        }
                    ];

                    processColorStyles();

                    scope.selectedColor = null;
                };

                scope.selectColor = function(color) {

                    scope.model.iconColor = color.hex;
                    selectColorByHex(color.hex);
                };

                modelCtrl.$formatters.push(function(value) {

                    if(value.iconColor) {
                        selectColorByHex(value.iconColor, false);
                    }
                    return value;
                });



                initialize();
            }
        };

    };

});
