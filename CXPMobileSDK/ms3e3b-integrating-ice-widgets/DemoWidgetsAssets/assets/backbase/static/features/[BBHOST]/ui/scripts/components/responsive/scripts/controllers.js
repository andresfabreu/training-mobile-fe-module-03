define(function(require, exports, module) {

    'use strict';

    var base = require('base');
    var utils = base.utils;

    // @ngInject
    exports.ResponsiveController = function($scope, $attrs, $parse, $timeout, lpUIResponsiveConfig, lpUIResponsive) {
        var self = this,
            setSize = (!utils.isUndefined($attrs.lpSize)) ? $parse($attrs.lpSize).assign : null,
            resizeFn = utils.identity;

        this.init = function(element) {
            this.element = element;
            this.responsive = lpUIResponsive.enable(element);

            var rules = (!utils.isUndefined($attrs.sizeRules)) ? $scope.$eval($attrs.sizeRules) : lpUIResponsiveConfig.rules;
            this.addRules(rules);

            if ( $attrs.lpOnResize ) {
                resizeFn = $parse( $attrs.lpOnResize );
                this.setResizeWatcher();
            }
        };

        this.addRules = function(rules) {
            utils.forEach(rules, function(rule) {
                self.addRule(rule.min, rule.max, rule.size);
            });
        };

        var expressionHandler;
        if ($attrs.onSizeChange) {
            expressionHandler = $parse($attrs.onSizeChange);
        }

        this.addRule = function(min, max, size) {
            var rule = {};
            if (min) {
                rule['min-width'] = min;
            }
            if (max) {
                rule['max-width'] = max;
            }

            utils.extend(rule, {
                then: function() {
                    var oldSize = self.size;

                    $timeout(function() {
                        self.toggleClass(size, oldSize);
                        self.size = size;
                        if (expressionHandler) {
                            expressionHandler($scope, { size: size });
                        }
                    });
                }
            });

            this.responsive.rule(rule);
        };

        this.toggleClass = function(newSize, oldSize) {
            self.element.addClass(lpUIResponsiveConfig.classPattern.replace('{{size}}', newSize));
            if (oldSize) {
                self.element.removeClass(lpUIResponsiveConfig.classPattern.replace('{{size}}', oldSize));
            }

            if ( setSize ) {
                setSize($scope, newSize);
            }
        };

        var width = null;

        this.setResizeWatcher = function() {
            this.responsive.resize = function( object ) {
                if ( object.width !== width ) {
                    width = object.width;
                    $scope.$apply( function() {
                        resizeFn( $scope, {width: width} );
                    });
                }
            };
        };
    };
});
