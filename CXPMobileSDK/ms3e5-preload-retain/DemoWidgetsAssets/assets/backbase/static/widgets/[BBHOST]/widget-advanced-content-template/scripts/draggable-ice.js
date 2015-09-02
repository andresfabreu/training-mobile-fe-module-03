/*global define, bd, be */
define(function (require, exports, module) {

    'use strict';

    var $ = require('jquery');

    /**
     * Draggable behavior for copyright text on the promo carousel
     *
     * An element called 'Grippy' appears above the draggable area and dragging grippy,
     * causes the draggable area to move
     *
     * @param $
     * @param widget
     * @param options
     * @returns {{init: Function, position: Function, grippy: {show: Function, hide: Function}}}
     * @constructor
     */
    var DraggableICEBehavior = function (widget, options) {

        /**
         * Configuration object
         * @type {Object}
         */
        var config = $.extend({
            draggableAreaSelector: '.lp-content-text-area',
            containersSelector: '.lp-promo-slide',
            grippyContents: 'Drag',
            draggableClass: 'draggable',
            preferenceName: 'content-position',
            defaultCoordinates: {
                top: '50px',
                left: '50px'
            }
        }, options);

        /**
         * List of elements to drag
         */
        var $containers;

        /**
         * Widget DOM element
         */
        var $body = $(widget.body);

        /**
         * 'Constants' for code maintainability
         */
        var GRIPPY_CLASS = 'lp-grippy';
        var ANIMATION_DURATION = 400;

        /**
         * Object holding coordinates of contents
         */
        var coordinates;

        /**
         * Where we are in portal manager, or public site
         */
        var isDesignMode = true;


        /**
         * Make element draggable.
         *
         * @return undefined
         */
        var makeDraggable = function(element, $handle, opt) {
            opt = $.extend({onStop: function() {}, prevent: true}, opt);

            var mouseMoveFn;

            // Called when mouseup for this grippy is fired
            var mouseUpFn = function() {
                // Cleanup
                element.removeClass(config.draggableClass);
                element.parents().unbind('mousemove', mouseMoveFn);
                $(document).unbind('mouseup', mouseUpFn);

                // Call appropriate handler
                opt.onStop(element);
            };

            $handle.on('mousedown', function(e) {
                if (opt.prevent) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                element.addClass(config.draggableClass);

                var drgH = element.outerHeight(),
                    drgW = element.outerWidth(),
                    posX = element.offset().top + drgH - e.pageY,
                    posY = element.offset().left + drgW - e.pageX;

                mouseMoveFn = function(ev) {
                    var top = ev.pageY + posX - drgH,
                        left = ev.pageX + posY - drgW;

                    // Constraintment inside widget body
                    var minTop = $body.offset().top,
                        maxTop = minTop + $body.outerHeight(),
                        minLeft = $body.offset().left,
                        maxLeft = minLeft + $body.outerWidth();

                    if ((top < minTop || top > maxTop - 20) || (left < minLeft || left > maxLeft - 20)) {
                        return;
                    }

                    // Update position
                    element.offset({
                        top: top,
                        left: left
                    });
                };
                element.parents().on('mousemove', mouseMoveFn);
                $(document).on('mouseup', mouseUpFn);
            });
        };


        /**
         * Update the coordinates for the content of a specific element
         *
         * @param  {Object} element jQuery object of the element
         * @return undefined
         */
        var refreshCoordinates = function(id, element) {
            coordinates[id] = {
                top: element.css('top'),
                left: element.css('left')
            };

            widget.setPreference(config.preferenceName, JSON.stringify(coordinates));
            widget.model.save();
        };


        /**
         * Create & attach grippy to the element we want to drag.
         *
         * @return undefined
         */
        var attachGrippy = function(el) {
            var grippy = $('<div/>')
                .text(config.grippyContents)
                .addClass(GRIPPY_CLASS)
                .appendTo(el);

            // Track grippy's hover state
            grippy.hover(function() {
                grippy.data('is:hover', true);
            }, function() {
                grippy.data('is:hover', false);
            });

            el.hover(function () {
                grippy.show();

                // Cancel hiding if reused here
                if (grippy.data('timeout')) {
                    clearTimeout(grippy.data('timeout'));
                }
            }, function () {
                var timeoutId = setTimeout(function() {
                    if ( !grippy.data('is:hover') ) {
                        grippy.hide();
                    }
                }, 500);
                grippy.data('timeout', timeoutId);
            });

            makeDraggable(el, grippy, {
                onStop: function(element) {
                    refreshCoordinates(element.attr('id'), element);
                }
            });
        };

        /**
         * Setup containers for the draggable ICE elemenents.
         *
         * NOTE: A number of CSS properties (like absolute position) are needed for the dragging to work.
         * Best thing is to set them in the CSS files, but as a last resort, we set them inline with JS, if they are not set
         *
         * @return undefined
         */
        var setupContainers = function() {
            $containers = $(config.containersSelector, $body);

            $containers.each(function (index, value) {
                var el = $(value).find(config.draggableAreaSelector);

                if (isDesignMode) {
                    attachGrippy(el);
                }

                if (el.css('position') !== 'absolute') {
                    el.css('position', 'absolute');
                }
            });
        };
         /**
         * Position the ICE content on the screen, based on the preferences
         *
         * @return undefined
         */
        var positionContent = function() {
            var text = $containers.find(config.draggableAreaSelector);

            var coords = coordinates[$containers.attr('id')];

            if (coords === 'undefined' || !coords) {
                coords = {
                    top: config.defaultCoordinates.top,
                    left: config.defaultCoordinates.left
                };
            }

            text.css({
                top: coords.top,
                left: coords.left
            });

            text.animate({opacity: 1}, ANIMATION_DURATION);
        };

        /**
         * Initialization of draggables and droppables
         *
         * @return undefined
         */
         var init = function(designMode) {
            isDesignMode = !!designMode;
            setupContainers();

            try {
                coordinates = JSON.parse(widget.getPreference(config.preferenceName));
            } catch (e) {
                coordinates = config.defaultCoordinates;
            }

            positionContent();
        };


        /**
         * Cleanup markup
         *
         */
        var cleanup = function(domnode) {
            domnode = $(domnode);
            domnode.find('.' + GRIPPY_CLASS).remove();
            domnode.find(config.draggableAreaSelector).css({
                top: '',
                left: '',
                opacity: ''
            });
        };

        return {
            init: init,
            cleanup: cleanup
        };
    };



    // Define ICE widget event

    var iceEvents = be.ice && be.ice && be.ice.events;
    var lpDragBehavior;

    if(iceEvents) {

        // init ckeditor
        iceEvents.registerEventListener('lp-drag', function(domnode, widget) {
            lpDragBehavior = new DraggableICEBehavior(widget, {});
            lpDragBehavior.init(bd.designMode);
        });

       // cleanup ckeditor stuff
        iceEvents.registerEventCleaner('lp-drag', function(domnode) {
            lpDragBehavior.cleanup(domnode);
        });
    }





    module.exports = DraggableICEBehavior;
    return DraggableICEBehavior; //legacy
});
