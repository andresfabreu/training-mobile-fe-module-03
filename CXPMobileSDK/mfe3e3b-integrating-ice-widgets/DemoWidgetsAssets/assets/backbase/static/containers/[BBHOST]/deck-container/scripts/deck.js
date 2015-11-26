/*global b$, gadgets, lp, bd, be, bc, window, console, $*/
(function(b$, gadgets, bd, be, bc, window, $) {
    'use strict';

    //options

    var NS = b$.bdom.getNamespace('http://backbase.com/2013/portalView');
    var Container = NS.classes.container;

    //  ----------------------------------------------------------------
    var DeckContainer = Container.extend(function(bdomDocument, node) {
        Container.apply(this, arguments);
        this.isPossibleDragTarget = false;
    }, {
        localName: 'DeckContainer',
        namespaceURI: 'launchpad',
        PANEL_NAME_PREFIX: 'Panel', //prefix for new panels
        PANEL: 'panel-container', //still needs nice way to get the correct panel from the catalog
        PANEL_CLASS: 'tab-pane',
        initialized: false,
        state: undefined,
        panelsActive: {}, //stores a list of the active panels inside the deck containers (keys are the names of the deck containers)
        savingPanels: 0, //number of panels asynchronously being saved
        locale: 'en-US', // default locale
        /**
         * Sets up the container by creating 3 initial panels inside the container
         * @constructor
         */
        DOMReady: function(e) {
            var self = this;
            this.initialized = JSON.parse(this.getPreference('initialized') || false);

            if (!this.initialized) {
                self.setPreference('initialized', true);
                self.model.save();
                var initialNumPanels = 3,
                    i = 0;
                for (i; i < initialNumPanels; i++) {
                    self.addPanel();
                }
            }

            //The strange thing that inside a DOMReady event the DOM isn't there in this cycle(thick)
            window.setTimeout(function() {
                self._displayInitialPanel();
                //TODO: get showControls from  designmode/enduser mode(interface, no edit), allways on for convenience during dev
                var showControls = bd.designMode === 'true';
                if (showControls) {
                    var rs = new b$._private.ResourceSequence();

                    if (bd.designMode) {
                        rs.addURI('text/javascript', bd.contextRoot + '/static/containers/[BBHOST]/deck-container/scripts/deck-designmode.js');

                        rs.startLoading(function() {
                            if(self._addControls){
                                self._addControls(null, self.state);
                            }
                            self.removeEventListener('preferenceFormReady', self.enhancePreferenceForm);
                            self.addEventListener('preferenceFormReady', self.enhancePreferenceForm);
                        });
                    }
                }
            }, 10);

            gadgets.pubsub.subscribe('lpi18n:locale:change', $.proxy(this, '_setLocale'));
            gadgets.pubsub.subscribe('lpi18n:data:load', $.proxy(this, '_i18nData'));

            $(window).on('popstate', $.proxy(this, '_popStateHandler'));
        },

        _findMatchingChildrenByTag: function(item, tagName) {
            var findChildrenTags = function(model){
                // Here we using childNodes if available and
                // _children if item did not loadChildren yet
                var children = model.childNodes && model.childNodes.length ? model.childNodes :
                    model._children && model._children.length ? model._children : [];

                var hasOwnTag = (model.tags || []).filter(function(tag){
                    return tag.type === "behavior" && tag.value === tagName;
                }).length;

                return hasOwnTag || children.length && children.filter(findChildrenTags).length;
            };

            var matchingChildren = item.childNodes.filter(function(child){
                return findChildrenTags(child.model);
            });


            return matchingChildren;
        },
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

        /**
         * Returns the number of panels inside this container including those being saved asynchcronously
         */
        _getNumberOfPanels: function() {
            var childs = this.childNodes;
            var L = childs.length;
            var numberOfPanels = 0,
                i;
            for (i = 0; i < L; i++) {
                if (childs[i].model && childs[i].model.extendedItemName === this.PANEL) {
                    numberOfPanels++;
                }
            }
            return numberOfPanels + this.savingPanels;
        },
        /**
         * Returns the list of panels inside the container(left this here just if in the future we need to filter them)
         */
        _getPanels: function() {
            return this.childNodes;
        },
        _displayInitialPanel: function() {
            //hiding all the children, ugly but this is due to css from a extended container not being inserted, only js.
            for (var i = 0; i < this.childNodes.length; i++) {
                var area = parseInt(this.childNodes[i].model.getPreference('area'), 10);
                $(this.htmlAreas[area]).hide();
            }

            this.defaultPanel = this.getPreference('defaultPanel');
            if (!this.defaultPanel && this.childNodes && this.childNodes.length) {
                this.setDefaultPanel(this.childNodes[0].model.name);
                this.defaultPanel = this.childNodes[0].model.name;
            }

            this.state = this.getPreference('state');
            this.state = this.state || this.defaultPanel;
            // this.state = (this.state.length > 0) ? this.state : 0;
            this.showPanel(this.state);
        },
        /**
         * Set default panel of the deck
         *  @param id: (string) name or index of the panel saved as defaultPanel
         */
        setDefaultPanel: function(id) {
            this.setPreference('defaultPanel', id);
            this.model.save();
        },
        /*
         * Saves order setting for all panes and reflows them
         *  @param $dragableNodes: (object) jQuery object the olds the dragable nodes
         */
        _saveOrderAndReflow: function($dragableNodes) {
            var self = this;
            var panels = $();
            //save the order setting for each panel
            $dragableNodes.each(function(a, b, c) {
                var $node = $(b);
                var panel = self.getPanel($node.data('id'));
                var nodeIndex = $node.index();

                panel.setPreference('area', nodeIndex);
                panel.setPreference('order', nodeIndex);
                panel.model.save();

                var $panel = $(panel.htmlNode.viewController.htmlNode);
                $panel.data('order', nodeIndex);

                panels.push($panel);
            });

            // //reoder the panels without reloading

            panels.map(function(idx, panel){
                var $panel = $(panel);
                $panel.appendTo(self.getDisplay('area', true)[$panel.data('order')]);
            });
        },
        /**
         * Creates and returns a panel name
         */
        _getNewPanelName: function() {
            return this.PANEL + '-' + Math.floor(Math.random() * 1000000);
        },

        _getNewPanelData: function(){
            var self = this;
            var order = self.childNodes.length;
            return {
                area: order,
                order: order,
                title: self.PANEL_NAME_PREFIX + ' ' + (order + 1),
                id: self._getNewPanelName()
            };
        },
        /**
         * Returns a specific panel
         *  @param id: (string) name or index of the panel to be removed
         */
        getPanel: function(id) {
            var panels = this._getPanels();
            if (typeof id === 'number' && id < panels.length) {
                return panels[id];
            } else if (typeof id === 'string') {
                var panelsNamedAsid = $.grep(panels || [], function(p) {
                    if (p.model && p.model.nodeName === 'Container') {
                        return p.model.name === id;
                    }
                });
                if (panelsNamedAsid.length > 0) {
                    return panelsNamedAsid[0];
                }
                // console.warn('Panel ' + id + ' doesn\'t exist');
            }

            return null;
        },
        getActivePanel: function() {
            var panels = this._getPanels();
            return panels[this.panelsActive[this.model.name] || 0];
        },
        /**
         * Displays a panel given an index or a name. All other panels are hidden.
         *  @param panelId: (string) name or index of the panel to be removed
         */
        showPanel: function(panelId) {
            var panels = this._getPanels();
            var panel;

            if (typeof panelId === 'number' || typeof panelId === 'string') {
                panel = this.getPanel(panelId);
            } else if (typeof panelId === 'object') {
                panel = panelId;
            }
            if (panel) {
                var area = panel.model.getPreference('area');
                if (panels[this.panelsActive[this.model.name] || 0]) {
                    $(this.htmlAreas).hide().removeClass('active');
                    // $(panels[this.panelsActive[this.model.name] || 0].htmlNode).hide().removeClass('active');
                }

                $(this.htmlAreas[area]).show().addClass('active');
                // $(panel.htmlNode).show().addClass('active');

                this.panelsActive[this.model.name] = panels.indexOf(panel);

                this.state = panel.model.name;
                gadgets.pubsub.publish(this.model.name + '-DeckPanelLoaded', panel.model.name);
            } else {
                return false;
            }
        },

        _popStateHandler: function(ev){
            // this._displayInitialPanel();
            // this.state = this.getPreference('state');
            // console.log('popstate', ev.originalEvent.state, this.state, b$.view.url2state.statefulItems);
            // this.showPanel(this.state);
        },

        updateUrl: function(){ // TODO simplify
            var state = this.getPreference('state_url2state');

            if (state) {
                var pos = state.match(/\[\$(\d+)\]/)[1];
                var loc = window.location;
                var path = loc.pathname;
                var tmp = path.split(b$.view.url2state.separator);
                var states = [];
                if (tmp.length > 1) {
                    states = tmp[1].split('/');
                }
                states[pos-1] = this.state;

                for (var i = 0; i < states.length; i++) {
                    states[i] = states[i] || '_';
                }

                var newUrl = loc.protocol + '//' + loc.host + tmp[0] + b$.view.url2state.separator + states.join('/') + loc.search;

                var oStateObject = b$.view.url2state.getStateData(newUrl);
                if (oStateObject){
                    var histState = window.history.state ? window.history.state : {};
                    histState.stateUrl = oStateObject.stateUrl;
                    histState.vars = oStateObject.vars;
                    if (window.history.pushState){
                        window.history.pushState(histState, newUrl, newUrl);
                    } else {
                        window.location.href = newUrl;
                    }
                }
            }
        },

        /**
         * Adds a new panel into the container
         *  @param data: (object) can have: panelName(id), order, title
         */
        addPanel: function(data, callback) {
            var self = this;
            self.savingPanels++;

            var area =  self._getNumberOfPanels() - 1;
            var defaults = {
                id: self._getNewPanelName(),
                portalName: b$.portal.portalName,
                panelBase: self.PANEL,
                parentItemName: self.model.name,
                title: self.PANEL_NAME_PREFIX + ' ' + (area + 1),
                area: area,
                order: area,
                classes: self.PANEL_CLASS
            };

            var tplData = $.extend({}, defaults, data);

            if(tplData.properties) {
                tplData.properties.map(function(prop){
                    if (defaults[prop.name]) {
                        delete defaults[prop.name];
                        // tplData[prop.name] = prop.value;
                        // prop.ignored = true;
                    }
                });
            }

            var createPanelInstanceTemplate = be.utils.processXMLTemplateByUrl(b$.portal.config.serverRoot + '/static/containers/[BBHOST]/deck-container/templates/xml/createPanel.xml', tplData);

            $.ajax({
                type: 'POST',
                url: b$.portal.config.serverRoot + '/portals/' + b$.portal.portalName + '/containers.xml',
                contentType: 'application/xml',
                data: createPanelInstanceTemplate
            }).done(function(msg) {
                self.savingPanels--;
                if (self.savingPanels === 0) {
                    var panelName = $('container > name', msg).text();
                    // self._displayInitialPanel();
                    self.refreshHTML(function(container){
                        container.showPanel(panelName);
                        // console.log(panelName);
                        if(callback) {
                            callback(msg);
                        }
                    });
                }
            });
        },
        /**
         * Sets the next panel inside the container to active
         *  @param cycle: (bollean) true to cycle from the last to the first
         */
        nextPanel: function(cycle) {
            var current = this.getActivePanel();
            var target = current.nextSibling;
            if (target) {
                this.showPanel(target.model.name);
            }
            if (!target && cycle) {
                this.showPanel(this.firstChild.model.name);
            }
        },
        /**
         * Sets the previous panel inside the container to active
         *  @param cycle: (bollean) true to cycle from the first to the last
         */
        prevPanel: function(cycle) {
            var current = this.getActivePanel();
            var target = current.previousSibling;
            if (target) {
                this.showPanel(target.model.name);
            }
            if (!target && cycle) {
                this.showPanel(this.lastChild.model.name);
            }
        },
        /**
         * Removes a panel inside the container
         *  @param id: (string) name or index of the panel to be removed
         */
        removePanel: function(id) {
            var self = this;
            var panel = this.getPanel(id);

            //This is needed do to the some weird portal client stuf, deletion fails if not in the next tick
            window.setTimeout(function() {
                panel.model.destroyAndSave(function(){

                    // update area property after panel removal
                    var childrenSorted = self.childNodes.sort(function(a, b){
                        var aArea = a.getPreference('order');
                        var bArea = b.getPreference('order');
                        return aArea > bArea ? 1 : aArea < bArea ? -1 : 0;
                    });

                    var count = childrenSorted.length;
                    var callback = function(){
                        if (--count === 0) { // once all panels saved...
                            self.refreshHTML();
                        }
                    };
                    for (var i = 0; i < childrenSorted.length; i++) {
                        childrenSorted[i].setPreference('area', i);
                        childrenSorted[i].setPreference('order', i);
                        childrenSorted[i].model.save(callback);
                    }
                });
            }, 0);

            if (id === this.defaultPanel && panel.nextSibling) {
                this.nextPanel();
                if (!panel.nextSibling && panel.previousSibling) {
                    this.prevPanel();
                }
                if (!panel.nextSibling && !panel.previousSibling) {
                    this.setDefaultPanel('undefined');
                }
            }
        },
        /**
         * Changes the name of a panel
         *  @param id: (string) name or index of the panel to be renamed
         *  @param name: (string) new name for the panel
         */
        renamePanel: function(id, name) {
            var self = this;
            var panel = this.getPanel(id);
            panel.setPreference('title', name);
            panel.model.save(function(){
                self.refreshHTML();
            });
        },
        /**
         * TODO: this method will lazy load panels based on behaviors
         */
        loadByBehavior: function(childBehaviorTag, callback) {
            var matchingChildren = this._findMatchingChildrenByTag(this, childBehaviorTag);
            if (matchingChildren.length > 0) {
                if (typeof callback === 'function') {
                    callback();
                }
            } else {
                console.warn('Couldn\'t load widget, no children with the behavior tag [' + childBehaviorTag + '] were found.');
            }
        },
        /**
         * TODO: this method will display panels based on behaviors
         */
        showByBehavior: function(childBehaviorTag) {
            var matchingChildren = this._findMatchingChildrenByTag(this, childBehaviorTag);
            if (matchingChildren.length === 0) {
                console.warn('Couldn\'t show widget, no children with the behavior tag [' + childBehaviorTag + '] were found.');
            } else {
                //warn, but still proceed to show the first matching child
                if (matchingChildren.length > 1) {
                    console.warn('More than one widget with the behavior tag [' + childBehaviorTag + '] was  found. Selecting the first.');
                }
                this.showPanel(matchingChildren[0]);
            }
        },

        enhancePreferenceForm: function(event) {
            var bc = bc || window.bc;
            event.stopPropagation();
            var childNodes = this.childNodes,
                defaultPanel = this.getPreference('defaultPanel'),
                aPanels = [],
                selected;

            // FIXME: make it proper portalclient form instead of using bc.component
            if (childNodes && bc.component) {
                var $input = $(event.target.htmlNode).find('input[name="defaultPanel"]').hide();
                if ($input){
                    for (var i = 0; i < childNodes.length; i++) {
                        if (childNodes[i].tagName === 'PanelContainer'){
                            aPanels.push({
                                name: childNodes[i].getPreference('title'),
                                value: childNodes[i].model.name
                            });
                            if (childNodes[i].model.name === defaultPanel) {
                                selected = childNodes[i].getPreference('title');
                            }
                        }
                    }

                    var $dd = bc.component.dropdown({
                        target: $input.parent(),
                        label: selected,
                        options: aPanels,
                        selected: $input.val()
                    });

                    $('button[data-action="save"]', event.target.htmlNode).on('click', function() {
                        $input.show().val($dd.siblings('select').val());
                        $dd.remove();
                    });
                }
            }
        }
    }, {
        template: function(json) {
            var data = {item: json.model.originalItem};
            var sTemplate = window['templates_' + this.localName][this.localName](data);
            return sTemplate;
        }
    });



})(b$, gadgets, bd, be, window.bc, window, $);
