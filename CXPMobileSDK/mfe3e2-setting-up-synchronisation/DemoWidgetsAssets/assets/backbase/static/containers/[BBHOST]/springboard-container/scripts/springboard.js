/*global window, launchpad, b$, gadgets*/
/**
 * Backbase Launchpad Springboard container
 * For advanced dashboard layouts
 *
 * @author philip@backbase.com
 */
(function () {
    'use strict';

    /**
     * Path to the default chrome to use with springboard
     * @constant {String}
     */
    var SPRINGBOARD_CHROME = '$(contextRoot)/static/features/[BBHOST]/chromes/springboard/chrome-springboard.html';

    /**
     * Preference constants
     *
     * @enum {String}
     */
    var prefs = {
        AREA: 'area',
        ORDER: 'order',
        NO_FORCE_CHROME: 'noForceChrome',
        CHROME: 'widgetChrome',
        GRID_MODEL: 'gridModel',
        HEIGHT: 'height',
        NUM_ROWS: 'rows',
        NUM_COLS: 'cols',
        BEHAVIORS: 'behaviors'
    };

    /**
     * Perspective constants
     *
     * @enum {String}
     */
    var perspectives = {
        MAXIMIZED: 'Maximized',
        LIVE: 'Widget'
    };

    /**
     * Selector constants
     *
     * @enum {String}
     */
    var selectors = {
        AREA_HOLDER: '.lp-springboard-area-holder',
        AREA: '.lp-springboard-area',
        FREE_AREA_HOLDER: '.lp-springboard-manageable .lp-springboard-area-holder:not(.lp-springboard-occupied)'
    };

    var permissions = {
        ADMIN: 0,
        CREATOR: -1,
        COLLABORATOR: -2,
        CONTRIBUTOR: -3,
        CONSUMER: -4
    };

    /**
     * Classes constants
     *
     * @enum {String}
     */
    var classes = {
        IS_DRAGGING : 'lp-springboard-drag',
        CATALOG_PROMPT: 'lp-springboard-catalog-prompt',
        WAITING_FOR_ADD: 'lp-springboard-waiting'
    };

    var $ = window.jQuery;

    function parseBoolean (val) {
        return JSON.parse(val || false);
    }

    function isDesignMode() {
        return window.bd.designMode;
    }


    /**
     * Springboard Container definition
     */


    var Container = b$.bdom.getNamespace('http://backbase.com/2013/portalView').getClass('container');
//  ----------------------------------------------------------------
    Container.extend(function (bdomDocument, node) {
        Container.apply(this, arguments);
        this.isPossibleDragTarget = true;
    }, {
        localName: 'SpringboardContainer',
        namespaceURI: 'launchpad',
        DOMReady: function () {
            var self = this;
            this.springboard = new launchpad.Springboard({
                rows: parseInt(this.getPreference(prefs.NUM_ROWS), 10) || 3,
                cols: parseInt(this.getPreference(prefs.NUM_COLS), 10) || 7,
                height: parseInt(this.getPreference(prefs.HEIGHT), 10) || '100%',
                isManageable : self.isManageable()
            });

            // Initialize Springboard Grid
            var model = this.getPreference(prefs.GRID_MODEL) || null;
            this.springboard.build(model);

            // Bind event springboard manager to update preference on grid change
            this.springboard.listen('area-changed', function(e, area, $area) {

                self.htmlAreas = [];
                self.$body.find('.bp-area').each(function() {
                    self.htmlAreas.push(this);
                });
                self._updateItemAreas();

                self.setPreference(prefs.GRID_MODEL, self.springboard.serialize());
                self.model.save();
                //we need this to make small modifications to the chrome when the widget is only 1 cell wide.
                //currently, the title is hidden from the chrome.
                $area.toggleClass('lp-springboard-smallcell', area.actualWidth < 175);
            });

            //TODO: change to pref form saves?
            this.model.addEventListener('PrefModified', function (event) {

                if(event.attrName === prefs.NUM_ROWS || event.attrName === prefs.NUM_COLS) {
                    //need to reset the model preference
                    self.setPreference(prefs.GRID_MODEL, null);
                    self.saveAndRefresh = true;
                } else if(event.attrName === prefs.HEIGHT) {
                    self.saveAndRefresh = true;
                }
            });
            this.addEventListener('preferencesSaved', function () {

                if(self.saveAndRefresh) {
                    self.saveAndRefresh = false;
                    self.model.save(function() {
                        self.refreshHTML();
                    });
                }
            });

            this.htmlAreas = this.springboard.getAreaHtmlElements();
            this.htmlNode.appendChild(this.springboard.getHtmlElement());


            this.$body = $(this.htmlNode);

            //html isn't really ready at this stage. add springboard rendering to end of current execution
            window.setTimeout(function() {
                self.springboard.render();

                var SECURITYPROFILE = ['NONE','CONSUMER', 'CONTRIBUTOR','COLLABORATOR','CREATOR','ADMIN'];
                self.allowPersonalize = SECURITYPROFILE.indexOf(self.model.securityProfile) > 1;

                self.allowResize = self.allowPersonalize && parseBoolean(self.getPreference('allowUserResize'));

                if(isDesignMode() || self.allowResize) {
                    self.springboard.makeResizable();
                }
                if(isDesignMode()) {
                    self.$body.prepend('<div class="lp-springboard-bg"></div>');
                }

                // UI provides window.lp.responsive.
                require(['ui'], function(ui) {
                    var responsive = window.lp.responsive.enable(self.$body[0]);
                    responsive.checkSizeInterval = 500;
                    responsive.resize(function() {
                        self.springboard.render();
                    });
                });
            },0);


            //Handle items being remove from the container.
            //So we can mark springboard areas as empty when an item has left
            this.addEventListener('DOMNodeRemoved', function (event) {
                if (event.target.model) {
                    //TODO: need a more elegant way of syncing empty areas when item removed
                    window.setTimeout(function() {
                        self.$body.find('> .lp-springboard > .lp-springboard-area-holder > .lp-springboard-area:empty').each(function(i, el) {
                            var areaId = $(el).parent().prop('id');
                            self.springboard.markAreaEmpty(areaId);
                        });
                    },0);
                }
            });

            // Handle items being inserted in the container
            // Gets triggered both during initialization and dropping of new widgets
            this.addEventListener('DOMNodeInserted', function (event) {

                if (event.target.model &&
                    event.relatedNode.model.extendedItemName.indexOf('springboard-container') > -1) {
                    self._onItemInserted(event.target);
                }
            });

            this._prepareWidgetCatalog();

            gadgets.pubsub.subscribe('lpi18n:locale:change', $.proxy(this, '_setLocale'));
            gadgets.pubsub.subscribe('lpi18n:data:load', $.proxy(this, '_i18nData'));

        },

        // i18n code copied from the DeckContainer

        /**
         * Set locale for the container
         * @param {string} locale expecting something like: 'en-US', 'nl-NL', 'fr-FR', 'ru-RU'
         */
        _setLocale: function(locale){
            // expecting: 'en-US' 'nl-NL' 'fr-FR' 'ru-RU'
            if (this.locale === locale) {
                return;
            }
            this.locale = locale;
            if (this.commonTranslation) {
                this._applyTranslation();
            }
        },

        /**
         * Caches translation object
         * @param  {object} translation hash map object
         */
        _i18nData: function(data){
            this.commonTranslation = data;
            this._applyTranslation();
        },

        /**
         * Translates all labels
         */
        _applyTranslation: function(){
            var that = this;
            // var $labels = $(this.getDisplay('lp-i18n')); // ony returns first matched element
            var $labels = $('[data-lp-i18n]', this.htmlNode);

            $labels.each(function(i, el){
                var $el = $(el);
                var key = $el.data('lp-i18n');
                var lang = that.commonTranslation && that.commonTranslation[that.locale];
                var label = lang && lang[key];
                if (label) {
                    $el.text(label);
                }
            });
        },


        // Allow container to be managed if model has creator or better (admin).
        isManageable : function() {
            return permissions[this.model.securityProfile] >= permissions.CREATOR;
        },

        // TODO: same function is used in the Deck Container
        _findMatchingChildrenByTag: function(item, tagName) {
            function findChildrenTags (model){
                // Here we using childNodes if available and
                // _children if item did not loadChildren yet
                var children = model.childNodes && model.childNodes.length ? model.childNodes :
                    model._children && model._children.length ? model._children : [];

                var hasOwnTag = (model.tags || []).filter(function(tag){
                    return tag.type === 'behavior' && tag.value === tagName;
                }).length;

                return hasOwnTag || children.length && children.filter(findChildrenTags).length;
            }

            var matchingChildren = item.childNodes.filter(function(child){
                return findChildrenTags(child.model);
            });


            return matchingChildren;
        },

        loadByBehavior: function(childBehaviorTag, callback) {

            var matchingChildren = this._findMatchingChildrenByTag(this, childBehaviorTag);

            if(matchingChildren.length > 0) {

                if(typeof callback === 'function') {
                    callback();
                }
            } else {
                console.warn('Couldn\'t load widget, no children with the behavior tag [' + childBehaviorTag + '] were found.');
            }

        },

        showByBehavior: function(childBehaviorTag) {

            var matchingChildren = this._findMatchingChildrenByTag(this, childBehaviorTag);

            if(matchingChildren.length === 0) {
                console.warn('Couldn\'t show widget, no children with the behavior tag [' + childBehaviorTag + '] were found.');
            } else {
                //warn, but still proceed to show the first matching child
                if(matchingChildren.length > 1) {
                    console.warn('More than one widget with the behavior tag [' + childBehaviorTag + '] was  found. Selecting the first.');
                }

                var $widgetNode = $(matchingChildren[0].htmlNode);
                var $area = $widgetNode.closest('.lp-springboard-area-holder');
                var widget = $widgetNode.prop('viewController');
                var maximized = $('.lp-springboard-area-maximized');
                var closeWidget = null;

                // check if there's a maximized widget, and minimize it
                if (maximized.length !== 0) {
                    closeWidget = $('.bp-widget', maximized);
                    var max = closeWidget.prop('viewController');
                    max.setPerspective(perspectives.LIVE);
                }

                // maximize the new widget
                if ($area.hasClass('lp-springboard-smallcell') && !(closeWidget && (closeWidget[0] === widget.htmlNode))) {
                    widget.setPerspective(perspectives.MAXIMIZED);
                }
            }
        },

        _resetPerspectiveClasses: function($widget) {

            $widget.removeClass('lp-springboard-widget-live lp-springboard-widget-maximized');
        },

        _setDraggable: function($widget, isDraggable) {

            var $widgetHead = $widget.children('.bp-widget-head');
            if (isDraggable) {
                $widgetHead.addClass('bp-ui-dragGrip');
            } else {
                $widgetHead.removeClass('bp-ui-dragGrip');
            }
        },

        _minimize: function($widget) {

            $widget.addClass('lp-springboard-widget-minimized');
            this._setDraggable($widget, true);
        },

        _maximize: function($widget, $area) {

            $area.data('restoredPosition', {
                left: $area.css('left'),
                top: $area.css('top'),
                width: $area.css('width'),
                height: $area.css('height'),
                small: $area.hasClass('lp-springboard-smallcell')
            });

            // module-spring-transition provides old window.lp.anim.
            require(['module-spring-transition'], function(transition) {
                transition._maximize($widget, $area);
            });

            this._setDraggable($widget, false);

        },

        _restore: function($widget, $area) {

            var restoredPosition = $area.data('restoredPosition');

            // module-spring-transition provides old window.lp.anim.
            require(['module-spring-transition'], function(transition) {
                // call animation
                transition._restore($widget, $area, restoredPosition);
            });

            this._setDraggable($widget, true);
        },



        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Private
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         *
         * @param item
         * @private
         */
        _onItemInserted: function(item) {

            var toArea = parseInt(item.model.getPreference(prefs.AREA), 10);

            //if area is 0 is sometimes ends up as an empty string.
            if(isNaN(toArea)) {
                toArea = 0;
            }
            var toAreaId = $(this.htmlAreas[toArea]).closest('.lp-springboard-area-holder').prop('id');
            if(toAreaId) {
                this.springboard.markAreaOccupied(toAreaId);
            }

            if(item.model.tag === 'widget') {
                this._onWidgetInserted(item);
            }
        },

        /**
         *
         * @param widget
         * @private
         */
        _onWidgetInserted: function (widget) {

            //TODO: item isn't ready immediately, when will it be ready?
            window.setTimeout(function() {

                //Decide whether to force a chrome
                var noForceChrome = widget.getPreference(prefs.NO_FORCE_CHROME);
                if(!noForceChrome) {
                    widget.setPreference(prefs.CHROME, SPRINGBOARD_CHROME);
                    widget.setPreference(prefs.NO_FORCE_CHROME, true);
                    widget.model.save(function() {
                        widget.refreshHTML();
                    });
                }

                $(widget.htmlNode).addClass(widget.model.extendedItemName).on('click', 'button', function() {
                    var $button = $(this);
                    var widget = $button.closest('.bp-widget').prop('viewController');
                    var action = $button.data('action');
                    if(action === 'lp-springboard-widget-restore') {
                        gadgets.pubsub.publish('Springboard:restoreWidget', { widgetName: widget.model.extendedItemName.replace(/^widget\-/, '') });
                        widget.setPerspective(perspectives.LIVE);
                    } else if(action === 'lp-springboard-widget-maximize') {
                        widget.setPerspective(perspectives.MAXIMIZED);
                    }
                });
            }, 100);
        },

        /**
         *
         * @private
         */
        _updateItemAreas: function() {

            var i, children = this.childNodes;
            for(i = 0; i < children.length; i++) {
                var child = children[i];
                var areaIndex = $(child.htmlNode).closest('.lp-springboard-area-holder').index();
                child.setPreference(prefs.AREA, areaIndex);
                child.model.save();
            }
        },

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        // D+D Override
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Drag enter override
         */
        m_dragEnter: function (evt, dragManager, item) {
            this.$body.addClass(classes.IS_DRAGGING);
            return Container.prototype.m_dragEnter.call(this, evt, dragManager, item);
        },

        /**
         * Drag out override
         */
        m_dragOut: function (evt, dragManager, item) {
            this.$body.removeClass(classes.IS_DRAGGING);
            return Container.prototype.m_dragOut.call(this, evt, dragManager, item);
        },

        /**
         * Drag drop override
         */
        m_dragDrop: function (evt, dragManager, item) {

            var areaEl = this.htmlAreas[parseInt(dragManager.__tmpArea, 10)];
            var areaId = $(areaEl).parent().prop('id');

            //drop is ok
            if (!this.springboard.isAreaOccupied(areaId)) {
                Container.prototype.m_dragDrop.call(this, evt, dragManager, item);
            }
        },

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Catalog things
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * Listens for pubsub notifcation from a wiget catalog that it has loaded.
         * If a widget catalog is not present on a page, the springboard will not initiate catalog behaviors
         * @private
         */
        _prepareWidgetCatalog: function() {

            var self = this;

            //enhance springboard behavior to work with the end user catalog
            gadgets.pubsub.subscribe('widgetCatalogLoaded', function() {

                self.$body
                    //show the catalog
                    .on('click', selectors.FREE_AREA_HOLDER, function () {

                        $(this).addClass(classes.WAITING_FOR_ADD)
                            .siblings(classes.AREA_HOLDER).removeClass(classes.WAITING_FOR_ADD);

                        self.currentWaitingAreaIndex = $(this).index();
                        gadgets.pubsub.publish('openCatalog');

                        //catalog will expect the addItem method to be available on the object we pass
                        gadgets.pubsub.publish('containerReadyForCatalog', self);
                    })
                    //hover styling
                    .on('mouseenter', selectors.FREE_AREA_HOLDER, function () {

                        $(this).addClass(classes.CATALOG_PROMPT);
                    }).on('mouseleave', selectors.FREE_AREA_HOLDER, function () {

                        $(this).removeClass(classes.CATALOG_PROMPT);
                        $('.bp-area', this).html('');
                    });
            });
        },

        /**
         * add a widget to the dashboard area
         * @param catalogItem widget json (same than used by catalog
         */
        addItem: function(catalogItem) {

            var self = this;

            // first create a widget instance from the json properties
            var newItem = this.model.createExtendedElementFromJSON(catalogItem);

            newItem.parentItemName = this.model.name;
            newItem.setPreference(prefs.AREA, this.currentWaitingAreaIndex + '');
            newItem.setPreference(prefs.ORDER, 0);

            // missing preferences on the originalItem
            newItem.originalItem.preferences = newItem.originalItem.preferences || {};

            // save the new widget and then append it to its parent
            newItem.save(function(){
                self.model.appendChild(newItem);
                // redraw the container
                self.reflow();
            });

            gadgets.pubsub.publish('closeCatalog');
        }
    }, {
        template: function(json) {
            var data = {item: json.model.originalItem};
            var sTemplate = window['templates_' + this.localName][this.localName](data);
            return sTemplate;
        },
        handlers: {
            'preferences-form': function(ev){
                // add Springboard Chrome for nested widgets
                if (ev.target.nodeName === 'backbaseWidget' &&
                    ev.target.parentNode.nodeName === 'SpringboardContainer') {
                    var widgetChrome = ev.target.model.preferences.array.filter(function(el){
                        return el.name == 'widgetChrome'
                    });
                    if (widgetChrome && widgetChrome.length){
                        widgetChrome[0].inputType.options.push({
                            label: 'Springboard Chrome',
                            value: SPRINGBOARD_CHROME
                        });
                    }
                }
            }
        }
    });
})();
