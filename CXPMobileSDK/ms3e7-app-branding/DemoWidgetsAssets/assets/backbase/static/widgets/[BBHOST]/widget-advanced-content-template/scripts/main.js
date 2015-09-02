/*global define, bd, be*/

define(function(require, exports, module) {
    'use strict';

    module.name = 'widget-advanced-content-template';

    var $ = require('jquery');

    var DraggableICEBehavior = require('./draggable-ice');

    var bgImages = {};

    var setPageBackground = function(imageSrc) {

        var $main = $('#main');
        var $bg = bgImages[imageSrc];
        if(!$bg) {
            $bg = $('<div class=lp-full-bg />').css('background-image', 'url(' + imageSrc + ')');
            $main.prepend($bg);
            bgImages[imageSrc] = $bg;
        }
        var $otherBgs = $main.children('.lp-full-bg').not($bg);
        $otherBgs.fadeOut(1000);
        $bg.fadeIn($otherBgs.length === 0 ? 0 : 1000);
    };

      /**
     * Helper
     * @param {jQuery} $htmlNode root node to start searching from
     * @returns {String} background image src that is suitable for a LP background
     */
    function getLPBackground($htmlNode) {
        return $htmlNode.find('.lp-background-image:first img').prop('src');
    }
    /**
     * fix chrome bug with contenteditable
     *
     */
    var fixEditing = function (widget) {
        var selector = '[contenteditable=false]:not(img)',
            restart = function(){
            var name, instance,
                cke = window.CKEDITOR;

            if(cke && cke.instances){
                for(name in cke.instances) {
                    instance = cke.instances[name];
                    if(this === instance.element.$) {
                        instance.destroy();
                        $(this).attr('contenteditable', true);
                        cke.inline(this);
                        return;
                    }
                }
            }
        };

        $(widget.body)
            .off('.lp-ice')
            .on('focus.lp-ice', selector, function(){
                $(widget.body).find(selector).each(restart);
            })
            .find(selector).each(restart);
    };

    var initIce = function(widget) {

        var dfd = new $.Deferred();

        // Extend widget in design mode
        if (be.ice && bd && bd.designMode === 'true') {

            // Clone and extend default ice config
            widget.iceConfig = $.extend(true, {}, be.ice.config);
            widget.iceConfig.events.push('lp-drag');

            // var isMasterpage = be.utils.module('top.bd.PageMgmtTree.selectedLink.isMasterPage'),
            var isMasterpage = top && top.bd && top.bd.PageMgmtTree && top.bd.PageMgmtTree.selectedLink && top.bd.PageMgmtTree.selectedLink.isMasterPage,
                isManageable = isMasterpage || (
                    widget.model.manageable === 'true' ||
                    widget.model.manageable === '' ||
                    widget.model.manageable === undefined
                );

            if (isManageable && be.ice.controller) {
                var templateUrl = String(widget.getPreference('templateUrl')),
                    enableEditing = function(){

                        return be.ice.controller.edit(widget, templateUrl)
                            .then(function(dom) {
                                $(widget.body).find('.bp-g-include').html(dom);

                                fixEditing(widget);

                                return dom;
                            });
                    };

                return enableEditing();
            }

        } else {
            // Hide broken images on live
            $('img[src=""], img:not([src])', widget.body).addClass('be-ice-hide-image');
            dfd.resolve();
        }
        return dfd.promise();

    };

      /**
     *
     * @param widget
     * @constructor
     */
    var ContentAccordion = function(widget) {
        this.widget = widget;
        this.$widget = $(widget.body);
    };

    /**
     * Init method of the LP advanced template
     *
     */
    ContentAccordion.prototype.init = function() {

        initIce(this.widget);

        var upClass = 'lp-icon-caret-up';
        var downClass = 'lp-icon-caret-down';
        var $collapsible = $('.lp-faq-content', this.$widget);
        var $arrow = $('.lp-accordion-toggle-class');

        $('.lp-faq-title', this.$widget).click(function() {
            var $target = $(this);
            var isCollapsed = $target.hasClass('collapsed');

            if(isCollapsed) {
                $arrow.removeClass(downClass).addClass(upClass);
                $collapsible.slideDown(300);
            } else {
                $arrow.removeClass(upClass).addClass(downClass);
                $collapsible.slideUp(300);
            }

            $target.toggleClass('collapsed', !isCollapsed);
        });
    };

      /**
     *
     * @param widget
     * @constructor
     */
    var AdvancedContentTemplate = function (widget) {

        var self = this;

        self.widget = widget;

        widget.updateBackground = function() {
            self.setBackground();
        };

        self.$widget = $(widget.body);
    };


    /**
     * Initialize
     *
     */
    AdvancedContentTemplate.prototype.init = function () {

        var self = this;

        initIce(self.widget).then(function(){

            self.DraggableICEBehavior = new DraggableICEBehavior(self.widget, {});
            self.DraggableICEBehavior.init(bd.designMode);

            self.setHeight();

            //fix for wigets not being visible during initialization in PM
            if(self.$widget.is(':visible')) {
                self.setBackground();
            }


            self.widget.model.addEventListener('PrefModified', function(evt) {
                if (evt.attrName === 'ImageOne') {
                    self.setHeight();
                    self.setBackground();
                }
            });

            function launchpadShowHandler() {
                self.setBackground();
                if($(self.widget.htmlNode).attr('data-event') === 'launchpad:show') {
                    // clear "deferred" event bus
                    $(self.widget.htmlNode).removeAttr('data-event');
                }
            }

            $(self.widget.htmlNode).on('launchpad:show', function() {
                // fix chrome bug with content editable
                launchpadShowHandler();
            });

            // expect "deferred" event in case
            // if 'launchpad:show' was fired before 'launchpad:show' listener was added
            if($(self.widget.htmlNode).attr('data-event') === 'launchpad:show') {
                launchpadShowHandler();
            }

            // LPES-3167
            if (bd.designMode) {
                var node = self.widget;
                var panel;
                while (node.parentNode) {
                    node = node.parentNode;
                    if (node.nodeName === 'TCont') {
                        var tCont = node;
                        break;
                    }
                    panel = node;
                }

                if (tCont) {
                    $(tCont.htmlNode).find('.bp-tContFn-tab').on('click', function (e) {
                        var panelIndex = tCont.childNodes.indexOf(panel);
                        var index = $(e.currentTarget).index();
                        // tCont childNodes are shifted and the fallback node is the first actually:
                        // [1] -> 1
                        // [2] -> 2
                        // [*] -> 0 (its node is inserted first)
                        // so we shift the index as well:
                        index = (index + 1) % tCont.childNodes.length;

                        if (panelIndex === index && getLPBackground($(panel.htmlNode)) === getLPBackground(self.$widget)) {
                            self.setBackground();
                        }
                    });
                }
            }

        });

    };

    AdvancedContentTemplate.prototype.setHeight = function () {

        //height of the widget can be optionally controlled by a preference
        var height = this.widget.getPreference('height');
        if(height) {
            this.$widget.height(height);
        }
    };

    AdvancedContentTemplate.prototype.setBackground = function () {

        fixEditing(this.widget);
        //if the template has a background image
        var backgroundImage = getLPBackground(this.$widget);
        if(backgroundImage && backgroundImage.indexOf('blank.gif') === -1) {
            var hasBackground = this.widget.getPreference('setPageBackground');
            if(hasBackground) {
                setPageBackground(backgroundImage);
            } else {
                this.$widget.css({
                    'background-image': 'url(' + backgroundImage + ')',
                    'background-repeat': 'no-repeat',
                    'background-size': '100% 100%'
                });
            }
        }
    };


    /**
     *
     * @param widget
     * @constructor
     */
    var ContentFactory = function (widget) {
        this.widget = widget;
    };

    /**
     * Initialize
     *
     */
    ContentFactory.prototype.init = function () {
        var isAccordion = /content\/accordion/.test(this.widget.model.getPreference('templateUrl')),
            widgetWrapper;

        widgetWrapper = isAccordion ?
            new ContentAccordion(this.widget) :
            new AdvancedContentTemplate(this.widget);

        widgetWrapper.init();

        return widgetWrapper;
    };



    module.exports = function(widget) {
        var gadgets = window.gadgets;

        if(gadgets && gadgets.pubsub && typeof gadgets.pubsub.publish === 'function'){
            window.gadgets.pubsub.publish('cxp.item.loaded', {id: widget.model.name});
        }

        var widgetWrapper = new ContentFactory(widget);
        return widgetWrapper.init();
    };
});
