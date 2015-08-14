/*global b$, gadgets, bd, be, bc, Mustache, window, console, $*/
(function(b$, bd, be, bc, window, $, Mustache) {
    'use strict';

    /**
     * Add UI to manage the deck
     *  @param el: (strig) selector for the DOM node where to insert controls, defaults to the container and is inserted at the end
     */
    function _addControls(el, state) {
        /*jshint validthis:true */

        var self = this;
        var $controlsHolder = $('<div class="deck-controls">');
        el = el && $(el) || $(this.htmlNode);

        $(this.htmlNode).append($controlsHolder).addClass('deck-controls-enabled');

        function _getPageModel(node){
            if (node.nodeName === 'page') {
                return node;
            }
            return _getPageModel(node.parentNode);
        }

        function createDragNodeHtmlString(data) {
            // stuff to get the edit bar, uncoment the following block to see edit bar on hover a deck title
            var panel = self.getPanel(data.id), $editBar;
            if (panel !== null && (panel.model.manageable !== 'false' || _getPageModel(self).pageType === 'master')) {
                $(panel.htmlNode).addClass('designToolsHidden');

                var template = b$._private.simpleResponseCache_getData(b$.portal.config.serverRoot + '/static/portalclient/templates/dm_editbar.html');
                $editBar = $(Mustache.to_html(template, panel.designTools)).find('.bd-dm-buttons').addClass('deck-dm-buttons');
                $editBar = ($('.bd-dm-button', $editBar).length > 0) ? $editBar[0].outerHTML : ' ';
            }
            var title = $('<div/>').text(data.title).html();

            var temp = '<li class="deck-control draggable ' + data.active + '" data-id="' + data.id +
                '" data-order="' + data.order +
                '" data-title="' + title +
                '" draggable="true">' +
                '<span class="deck-control-title">' + title +
                '</span><div class="deck-control-title-controls">' +
                '<button class="deck-control-title-confirm">&#10004;</button>' +
                '<button class="deck-control-title-cancel">&#10006;</button>' +
                '</div>' +
                ($editBar ? $editBar : '') +
                '</li>';
            return temp;
        }

        function loadPermission (oView) {
            if(!oView.designTools.features.Permission) {
                return;
            }
            var name = oView.model.name;
            var tag = oView.model.localName.toLowerCase();

            if(tag !== 'widget' && tag !== 'container'){
                return;
            }

            var selector = '#editWidgetTabs_Permissions';
            var params = {
                portalName: b$.portal.portalName,
                itemName: name,
                itemType: tag,
                context: b$.portal.config.serverRoot + '/portals/' + b$.portal.portalName + '/' + tag + 's/' + name,
                domParent: selector,
                //         hidePropagate: 'true',
                closeCallback: function() {
                    if (bd.portalName === 'dashboard') {
                        var temp = $('#editWidgetTabs_Permissions');
                        if (temp.length > 0) {
                            be.closeCurrentDialog();
                            temp.hide();
                            temp.remove();
                        }
                    } else {
                        be.animation.flipContainer.hide();
                    }
                }
            };
            bd.Permission.loadPermissionsAndGroups(params);
        }

        function removePanel (panel, callback, errorCallback, skipMessage){
            if(!panel) {
                return;
            }

            if (self.childNodes.length < 2) {
                be.utils.alert({
                    icon: 'warning',
                    title: 'Unable to remove panel',
                    message: 'Container should have at least one panel'
                });
                return;
            }

            var isMA = panel.getPreference && panel.getPreference('isManageableArea'),
                tag = isMA ? panel.getPreference('title') : panel.model.localName,
                msg = 'Are you sure you want to delete this ' + tag.toLowerCase()+'?';

            if(panel.model.localName.toLowerCase() === 'container') {
                msg = isMA ? 'Manageable Areas allow the placement of elements within their regular pages.<br/>Are you sure you want to delete?<br/>This will also delete all elements on regular pages held within this Manageable Area.' :
                             'Are you sure you want to delete this layout, and all its contents?';
            }

            if (skipMessage) {
                self.removePanel(panel.model.name);
            } else {
                $(bd.selectedItem).data('state', { markForDeletion: true } );
                be.utils.confirm({
                    title: 'Delete '+ tag,
                    message: msg,
                    okBtnText: 'Delete',
                    cancelBtnText: 'Cancel',
                    yesCallback: function() {
                        self.removePanel(panel.model.name);
                    },
                    noCallback: function() {
                        $(bd.selectedItem).data('state', { markForDeletion: false } );
                    },
                    closeIcon: false
                });
            }
        }

        var data = {};
        var nodes = [];
        var childs = self.childNodes;

        childs = childs.sort(function(a, b) {
            var aArea = parseInt(a.getPreference('area'), 10);
            var bArea = parseInt(b.getPreference('area'), 10);
            return aArea > bArea ? 1 : bArea > aArea ? -1 : 0;
        });


        var childsL = childs.length;
        var i = 0;
        for (i; i < childsL; i++) {
            var child = childs[i];
            data = {
                order: parseInt(child.getPreference('area'), 10),
                title: child.getPreference('title'),
                id: child.model.name,
                active: (child.model.name === state) ? 'active' : ''
            };
            child.designTools = child.designTools || {};
            child.designTools.hasFeatures = false;
            nodes.push(createDragNodeHtmlString(data));
        }

        var list = '<ul class="deck-controls-nav">' +
            nodes.join('') +
            (self.model.manageable !== 'false' || _getPageModel(self).pageType === 'master' ? '<li class="deck-control"><button class="add-panel">+ ADD</button></li>' : '')  +
            '</ul>';

        $controlsHolder.html(list);

        $controlsHolder.find('.deck-control .bd-dm-buttons').each(function(){
            $(this).css({
                width: ($('.bd-dm-button', this).length * 20) + 12 + 'px'
            });
            $(this).on('mouseenter', function(){
                $(this).parent().addClass('locked');
            }).on('mouseleave', function(){
                $(this).parent().removeClass('locked');
            });
        });

        //D&D ###########################

        var $dragableNodes = $controlsHolder.find('.draggable');
        var $currentDragEl;


        $controlsHolder.on('dragstart', '.draggable', function(e) {
            $currentDragEl = $(this);
            $currentDragEl.addClass('design-tools-disabled');
            var order = $currentDragEl.data('order');
            e.originalEvent.dataTransfer.setData('order', order);
            e.originalEvent.dataTransfer.effectAllowed = 'move';
        });

        $controlsHolder.on('dragover', '.deck-control', function(e) {
            $currentDragEl.hide();
            e.preventDefault();
            var indexDrag = $currentDragEl.index();
            var indexThis = $(this).index();
            if (indexDrag < indexThis) {
                $(this).addClass('hoverR');
            }
            if (indexDrag > indexThis) {
                $(this).addClass('hoverL');
            }
        });

        $controlsHolder.on('drop', '.deck-control', function() {
            // var order = e.originalEvent.dataTransfer.getData('order');
            $(this).removeClass('hoverL').removeClass('hoverR');

            $currentDragEl.removeClass('design-tools-disabled');

            // var indexDrag = $currentDragEl.index();
            // var indexThis = $(this).index();
            $controlsHolder.find('.deck-control').removeClass('hoverR hoverL');
            $currentDragEl.insertBefore(this);

            self._saveOrderAndReflow($dragableNodes);
        });

        $controlsHolder.on('dragleave', '.deck-control', function(e) {
            e.preventDefault();
            $controlsHolder.find('.deck-control').removeClass('hoverR hoverL');

        });

        $controlsHolder.on('dragend', '.draggable', function(e) {
            e.preventDefault();
            $controlsHolder.find('.deck-control').removeClass('hoverR hoverL');
            $currentDragEl.show();
        });


        //Select active
        //set active panel
        $controlsHolder.on('click', '.deck-control-title', function() {
            var $el = $(this).parents('.deck-control');
            self.showPanel($el.data('id'));
            self.updateUrl();
        });

        gadgets.pubsub.subscribe(this.model.name + '-DeckPanelLoaded', function(panelId){
            var $el = $controlsHolder.find('.deck-control[data-id="' + panelId + '"]');
            $el.addClass('active').siblings('.active').removeClass('active');
        });

        function selectText(element) {
            var doc = document,
                range, selection;

            if (doc.body.createTextRange) { //ms
                range = doc.body.createTextRange();
                range.moveToElementText(element);
                range.select();
            } else if (window.getSelection) { //all others
                selection = window.getSelection();
                range = doc.createRange();
                range.selectNodeContents(element);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }

        //set the content editable
        $controlsHolder.on('click', '.deck-control.active .deck-control-title', function() {
            var $el = $(this);
            var panel = self.getPanel($el.parents('.deck-control').data('id'));
            if (panel.model.manageable !== 'false' || _getPageModel(self).pageType === 'master') {
                $el.parent().addClass('design-tools-disabled');
                $el.data('oldTitle', $el.text());
                $el.attr('contenteditable', true);
                $el.focus();
                selectText($el[0]);

                $el.parents('.deck-control').siblings().addClass('faded');
            }
        });

        var $controlButtons = $('.deck-dm-buttons', $controlsHolder);
        $controlButtons
            .on('click', '.bd-icon-trash', function(event){
                event.stopPropagation();
                var panel = self.getPanel($(this).parents('.deck-control').data('id'));
                removePanel(panel);
            })
            .on('click' ,'.bd-icon-edit, .bd-icon-permissions', function(event){
                event.stopPropagation();
                var panel = self.getPanel($(this).parents('.deck-control').data('id'));
                var features = panel.designTools.features;

                var eventParams = {
                    context: panel,
                    permissions: true,
                    params: {
                        permissions: features.Permission,
                        targeting: features.TCont
                    },
                    callback: function(){
                        var $flip3DContainer = jQuery('#flip3DContainer');
                        $flip3DContainer.find('.aa-tabLabels .aa-tab2').click(function(ev) {
                            if(features.Permission){
                                if (!jQuery('#editWidgetTabs_Permissions .aa-permissionForm').length) {
                                    loadPermission(panel);
                                }
                            }
                        });

                        if ($(event.target).hasClass('bd-icon-permissions')) {
                            $flip3DContainer.find('.aa-tabLabels .aa-tab2').trigger('click');
                        }
                    }
                };
                panel.dispatchCustomEvent('preferences-form', true, true, eventParams);
            })
            .on('click','.bd-container-manageable, .bd-container-not-manageable, .bd-widget-manageable, .bd-widget-not-manageable, .bd-undefined-manageable', function(){
                event.stopPropagation();
                var $this =  $(this);
                var panel = self.getPanel($(this).parents('.deck-control').data('id'));

                panel.model.manageable = panel.model.manageable === 'true' ? 'false' : 'true';
                panel.model.save(function(){
                    $this.toggleClass('bd-container-manageable bd-container-not-manageable');
                });
            }).on('click', '.bd-icon-revert', function(){
                event.stopPropagation();
                var panel = self.getPanel($(this).parents('.deck-control').data('id'));

                be.utils.confirm({
                    title: 'Revert to default',
                    message: 'Are you sure you want to reset this item inherited from the master page to its original state? Any customizations will be removed.',
                    okBtnText: 'Ok',
                    cancelBtnText: 'Cancel',
                    yesCallback: function() {
                        if(panel){
                            panel.model.revert(function(){
                                self.refreshHTML();
                            });
                        }
                    },
                    closeIcon: false
                });
            });


        //On blur we may dismiss the active tab and the editing or save the editing, it depends on the blur trigger
        $controlsHolder.on('blur', '.deck-control.active .deck-control-title', function(event) {
            var $self = $(this);
            var $tab;
            if (!event.relatedTarget || $(event.relatedTarget).hasClass('deck-control-title-confirm')) {
                $tab = $self.parents('.deck-control');
                $tab.siblings().removeClass('faded');

                var $titleEl = $tab.find('.deck-control-title');
                var panelId = $tab.data('id');
                var titleText = $titleEl[0].innerText;
                if ($self.data('oldTitle') !== titleText) {
                    self.renamePanel(panelId, titleText);
                }

                $titleEl.attr('contenteditable', false);
                $titleEl.parent().removeClass('design-tools-disabled');
                return;
            }
            if (!$(event.relatedTarget).hasClass('deck-control-title-confirm')) {
                $self.text($self.data('oldTitle'));
                $self.attr('contenteditable', false);
            }

            $self.parents('.deck-control').siblings().removeClass('faded');
        });

        //Listen to the return key, prevent default(open new line) and trigger a pseudo blur to submit
        $controlsHolder.on('keydown keypress', '.deck-control.active .deck-control-title', function(event) {
            console.log(event.which);
            if (event.which === 13) {
                event.preventDefault();
                $(this).trigger('blur');
            }
        });

        //set the content editable
        $controlsHolder.on('mouseover', '.deck-control.active', function() {
            // debugger;
            var $this = $(this);
            // var panel = self.getPanel($this.data('id'));
            $this.addClass('deck-control-show-tools');
        });

        $controlsHolder.on('click', '.add-panel', function(event) {
            event.preventDefault();
            var order = $dragableNodes.length;
            var data = self._getNewPanelData();
            var newPanel = createDragNodeHtmlString(data);
            $dragableNodes.eq(order - 1).after(newPanel);
            self.addPanel(data, function(xml){
                setTimeout(function(){
                    var panelId = $('container > name', xml).text();
                    $('.deck-control[data-id="' + panelId + '"] .deck-control-title', self.htmlNode).trigger('click');
                }, 0);
            });
        });

        $controlsHolder.on('click', '.remove-panel', function(event) {
            event.preventDefault();
            $(this).parent().data('toDelete', true).hide();
        });
    }

    var controls = {
        _addControls: _addControls
    };

    var DeckContainer = b$.bdom.namespaces.launchpad.classes.DeckContainer;
    b$.mixin(DeckContainer.prototype, controls);

})(b$, bd, be, bc, window, $, Mustache);
