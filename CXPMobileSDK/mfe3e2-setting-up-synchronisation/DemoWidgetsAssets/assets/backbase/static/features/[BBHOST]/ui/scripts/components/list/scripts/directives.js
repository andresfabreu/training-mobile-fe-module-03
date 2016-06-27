define(function(require, exports, module) {

    'use strict';

    // @ngInject
    exports.lpList = function() {

        var ng = window.angular;
        var CLASS_LIST = 'list-group';

        function templateFn() {
            return [
                '<div class="list">',
                '</div>'
            ].join('');
        }

        function compileFn($element, $attr) {
            // Create DOM.
            var listEl = ng.element(templateFn())
                .append( $element.contents() ) // transclude element contents
                .addClass(CLASS_LIST);
            $element.append(listEl);
        }

        return {
            restrict: 'EA',
            priority: Number.MAX_VALUE,
            //replace: false, DO NOT USE REPLACE  ([DEPRECATED!], will be removed in next major release)
            compile: compileFn,
            // bindToController: true 1.3
            scope: { }
        };
    };

    // @ngInject
    exports.lpItem = function() {

        var ng = window.angular;
        var CLASS_LIST_ITEM = 'list-group-item clearfix';
        var CLASS_LIST_CONTAINER = 'list-group-container';

        function ctrlFn(ctrl, el, attr) {
            ctrl.href = function() {
                return attr.href || attr.ngHref;
            };
            ctrl.target = function() {
                return attr.target || '_self';
            };
        }

        function templateFn(isAnchor) {
            return [
                '<div',
                ((isAnchor) ? ' ng-href="{{href()}}" target="{{target()}}"' : ''),
                '>',
                '</div>'
            ].join('');
        }

        function compileFn($element, $attrs) {
            var isAnchor, itemEl;

            // Create DOM.
            isAnchor = ng.isDefined($attrs.href) || ng.isDefined($attrs.ngHref);

            // If anchor item, (has href) use the anchor template.
            itemEl = ng.element(templateFn(isAnchor));
            itemEl.append($element.contents()); // transclude item contents.
            itemEl.addClass(CLASS_LIST_ITEM);
            $element.append(itemEl);

            // Add class to the item element
            $element.addClass(CLASS_LIST_CONTAINER);

            return ctrlFn;
        }

        return {
            restrict: 'EA',
            compile: compileFn,
            scope: true
        };
    };

    // @ngInject
    exports.lpItemCell = function() {

        var ng = window.angular;

        function templateFn() {
            return [
                '<div>',
                '</div>'
            ].join('');
        }

        // TODO: provide auto widths like flexbox.
        function markupColumnWidths($element, $attrs) {
            var supportedWidths = ['xs', 'sm', 'md', 'lg'];
            var defaultWidth = ( ng.isDefined($attrs.width) ) ? $attrs.width : (Math.floor(12 / $element.children().length));
            ng.forEach(supportedWidths, function(widthType) {
                var widthAttr = widthType + 'Width';
                var width = (ng.isDefined($attrs[widthAttr])) ? $attrs[widthAttr] : defaultWidth;
                $element.addClass('col-' + widthType + '-' + width);
            });
        }

        function compileFn($element, $attrs) {
            var cellEl;

            // Create DOM.
            cellEl = ng.element(templateFn());
            cellEl.append($element.contents()); // tranclude cell contents.

            // Markup column widths.
            markupColumnWidths($element, $attrs);

            $element.append(cellEl);
        }

        return {
            restrict: 'EA',
            compile: compileFn,
            scope: true
        };
    };

});
