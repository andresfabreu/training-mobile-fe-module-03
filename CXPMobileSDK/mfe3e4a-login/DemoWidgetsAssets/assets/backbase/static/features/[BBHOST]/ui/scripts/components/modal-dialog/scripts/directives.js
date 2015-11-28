define(function (require, exports) {

    'use strict';

    var $ = window.jQuery;
    var be = window.be;
    var bd = window.bd;

    var getIceContent = function (widget) {

        var edit = function (wg) {
            if (be && be.ice && be.ice.controller) {
                wg.iceConfig = be.ice.config;
                var templateUrl = String(wg.getPreference('templateUrl'));
                if (templateUrl.match(/\/image\.html$/)) {
                    templateUrl = templateUrl.replace(/\/image\.html$/, '/image-editorial.html');
                }
                return be.ice.controller.edit(wg, templateUrl)
                    .then(function (dom) {
                        return dom;
                    });
            }
        };

        if (bd && bd.designMode === 'true') {
            return edit(widget);
        }
    };

    // @ngInject
    exports.modalDialog = function (widget, $templateCache) {

        $templateCache.put('$modalDialog.html',
            '<div class="lp-modal modal" ng-show="show">' +
            '    <div class="ng-modal-overlay" ng-click="hideModal()"></div>' +
            '    <div class="modal-dialog" ng-style="dialogStyle" tabindex="-1">' +
            '        <div class="modal-content" ng-transclude=""></div>' +
            '    </div>' +
            '</div>');

        return {
            restrict: 'AE',
            scope: {
                show: '='
            },
            replace: true, // Replace with the template below
            transclude: true, // we want to insert custom content inside the directive
            template: $templateCache.get('$modalDialog.html'),
            link: function (scope, element, attrs) {
                scope.closable = attrs.closable ? scope.$parent.$eval(attrs.closable) : true;
                scope.dialogStyle = {};
                if (attrs.width) {
                    scope.dialogStyle.width = attrs.width;
                }
                if (attrs.height) {
                    scope.dialogStyle.height = attrs.height;
                }

                var bindCloseModal = function () {
                    $(element).find('.modal-close-button').on('click', function () {
                        scope.hideModal();
                        scope.$apply();
                    });
                };

                if (attrs.isice && widget.getPreference('templateUrl')) {
                    var c = getIceContent(widget);
                    if (c) {
                        c.then(function (dom) {
                            $(element).find('.bp-g-include').html(dom);
                            $(element).find('[contenteditable]').on('keypress keydown', function (e) {
                                e.stopPropagation();
                            });
                            bindCloseModal();
                        });
                    } else {
                        bindCloseModal();
                    }
                }

                scope.hideModal = function () {
                    scope.show = false;
                };

                scope.focusModal = function () {
                    element.find('.modal-dialog').focus();
                };

                var escapeEvent = function (event) {
                    if (event.keyCode === 27) {
                        event.stopPropagation();
                        event.preventDefault();

                        scope.hideModal();
                        scope.$apply();
                    }
                };
                scope.$watch('show', function (newValue) {
                    if (newValue) {
                        element.bind('keydown.modalDialog', escapeEvent);
                        scope.focusModal();
                    } else {
                        element.unbind('keydown.modalDialog', escapeEvent);
                    }
                });
            }
        };
    };

});
